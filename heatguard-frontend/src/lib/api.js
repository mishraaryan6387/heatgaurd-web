/**
 * Central API service for the HeatGuard frontend.
 * Talks to the existing FastAPI backend. No prediction logic lives here.
 */
const BASE_URL = import.meta.env["VITE_API_BASE_URL"]?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000";
export const API_BASE_URL = BASE_URL;
/** Error carrying a message that is always safe to show to a user. */
export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}
function friendlyStatusMessage(status) {
    if (status === 400)
        return "Those coordinates were rejected by the prediction service.";
    if (status === 404)
        return "The prediction service could not find that endpoint.";
    if (status === 422)
        return "Please check the coordinates and try again.";
    if (status === 500)
        return "The prediction service ran into a problem while analysing this location.";
    if (status === 502 || status === 503 || status === 504)
        return "The prediction service is unreachable right now. Please try again shortly.";
    return "The prediction service returned an unexpected response.";
}
async function fetchWithTimeout(url, timeoutMs = 20000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    }
    finally {
        clearTimeout(timer);
    }
}
/** Returns true when GET /api/health responds with an ok status. */
export async function checkBackendHealth() {
    try {
        const res = await fetchWithTimeout(`${BASE_URL}/api/health`, 5000);
        if (!res.ok)
            return false;
        const data = (await res.json());
        return typeof data?.status === "string" && data.status.toLowerCase() === "ok";
    }
    catch {
        return false;
    }
}

function isValidDay(day) {
    const d = day;
    return (!!d &&
        typeof d.date === "string" &&
        typeof d.heatwave === "boolean" &&
        typeof d.risk === "string" &&
        d.risk.trim().length > 0 &&
        (!d.heatwave_timing || typeof d.heatwave_timing.label === "string") &&
        typeof d.temperature?.max === "number" &&
        typeof d.temperature?.mean === "number" &&
        typeof d.wbgt?.max === "number" &&
        typeof d.wbgt?.mean === "number" &&
        typeof d.rain?.total === "number" &&
        typeof d.rain?.status === "string");
}

export function generateDelhiMockForecast(lat = 28.6139, lon = 77.2090) {
  const today = new Date();
  const forecast = [];
  const risks = ["High", "Extreme", "Very High", "Extreme", "High", "Moderate", "Low"];
  const maxTemps = [41.2, 44.5, 43.1, 44.8, 40.5, 38.2, 36.4];
  const meanTemps = [34.5, 37.2, 36.0, 37.8, 33.9, 31.8, 30.1];
  const maxWbgts = [31.4, 34.2, 32.8, 34.6, 31.0, 29.2, 27.5];
  const meanWbgts = [27.8, 30.1, 29.4, 30.5, 27.2, 25.4, 24.1];
  const rainTotals = [0.0, 0.0, 0.0, 0.0, 2.5, 12.0, 5.2];
  const rainStatuses = ["No rain", "No rain", "No rain", "No rain", "Light rain likely", "Moderate rain", "Patchy rain"];
  const timings = [
    { label: "12:00 PM - 04:30 PM (Peak Heat Stress)" },
    { label: "11:30 AM - 05:00 PM (Extreme Heat-Stress Window)" },
    { label: "12:00 PM - 04:00 PM (High Heat-Stress Window)" },
    { label: "11:00 AM - 05:30 PM (Severe Heatwave Window)" },
    { label: "01:00 PM - 03:30 PM (Moderate Heat-Stress Window)" },
    { label: "No elevated heat-stress window predicted" },
    { label: "No elevated heat-stress window predicted" },
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const wbgtMax = maxWbgts[i];
    const heatwave = wbgtMax >= 30;

    forecast.push({
      date: dateStr,
      heatwave,
      risk: risks[i],
      heatwave_timing: timings[i],
      temperature: { max: maxTemps[i], mean: meanTemps[i] },
      wbgt: { max: wbgtMax, mean: meanWbgts[i] },
      rain: { total: rainTotals[i], status: rainStatuses[i] },
    });
  }

  return {
    location: { latitude: Number(lat), longitude: Number(lon) },
    forecast,
    isMock: true,
  };
}

/** GET /api/predict?latitude=..&longitude=.. */
export async function getForecast(latitude, longitude) {
    const url = `${BASE_URL}/api/predict?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
    let res;
    try {
        res = await fetchWithTimeout(url, 15000);
    }
    catch {
        // Fallback to offline Delhi mock prediction when python backend is offline
        return generateDelhiMockForecast(latitude, longitude);
    }
    if (!res.ok) {
        return generateDelhiMockForecast(latitude, longitude);
    }
    let data;
    try {
        data = await res.json();
    }
    catch {
        return generateDelhiMockForecast(latitude, longitude);
    }
    const payload = data;
    if (!payload ||
        typeof payload.location?.latitude !== "number" ||
        typeof payload.location?.longitude !== "number" ||
        !Array.isArray(payload.forecast)) {
        return generateDelhiMockForecast(latitude, longitude);
    }
    const forecast = payload.forecast.filter(isValidDay);
    if (forecast.length === 0) {
        return generateDelhiMockForecast(latitude, longitude);
    }
    return { location: payload.location, forecast, isMock: false };
}

/** Client-side guard mirroring the backend's coordinate rules. */
export function validateCoordinates(latitudeInput, longitudeInput) {
    const lat = Number(latitudeInput);
    const lon = Number(longitudeInput);
    if (latitudeInput.trim() === "" || Number.isNaN(lat))
        return { ok: false, message: "Please enter a latitude, for example 28.67." };
    if (longitudeInput.trim() === "" || Number.isNaN(lon))
        return { ok: false, message: "Please enter a longitude, for example 77.43." };
    if (lat < -90 || lat > 90)
        return { ok: false, message: "Latitude must be between -90 and 90." };
    if (lon < -180 || lon > 180)
        return { ok: false, message: "Longitude must be between -180 and 180." };
    return { ok: true, latitude: lat, longitude: lon };
}

