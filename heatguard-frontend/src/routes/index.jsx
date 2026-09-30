import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/heatguard/Navbar";
import { Hero } from "@/components/heatguard/Hero";
import { LoadingState } from "@/components/heatguard/LoadingState";
import { ErrorState } from "@/components/heatguard/ErrorState";
import { LocationCard } from "@/components/heatguard/LocationCard";
import { RiskOverview } from "@/components/heatguard/RiskOverview";
import { HeatwaveAlert } from "@/components/heatguard/HeatwaveAlert";
import { MetricsGrid } from "@/components/heatguard/MetricsGrid";
import { WbgtSection } from "@/components/heatguard/WbgtSection";
import { ForecastList } from "@/components/heatguard/ForecastList";
import { Charts } from "@/components/heatguard/Charts";
import { SafetySection } from "@/components/heatguard/SafetySection";
import { HumanImpact } from "@/components/heatguard/HumanImpact";
import { DateSelector } from "@/components/heatguard/DateSelector";
import { Footer } from "@/components/heatguard/Footer";
import { checkBackendHealth, getForecast, ApiError } from "@/lib/api";

const DELHI_ONLY_MESSAGE =
  "Heat-stress predictions are currently available for Delhi only. The model is trained and validated on Delhi data; coverage for other states is still in progress.";

function isDelhi(state) {
  const normalized = String(state ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  return normalized === "delhi" || normalized === "nctofdelhi" || normalized === "nationalcapitalterritoryofdelhi";
}

function Index() {
  const [selectedState, setSelectedState] = useState("Delhi");
  const [forecastData, setForecastData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationMessage, setValidationMessage] = useState(null);
  const [status, setStatus] = useState("checking");
  const [lastCoords, setLastCoords] = useState(null);

  useEffect(() => {
    let active = true;
    checkBackendHealth().then((ok) => {
      if (active) setStatus(ok ? "online" : "offline");
    });
    return () => { active = false; };
  }, []);

  const handleScanComplete = useCallback((forecast, representative) => {
    const forecastArray = Array.isArray(forecast) ? forecast : forecast?.forecast;
    if (!Array.isArray(forecastArray) || forecastArray.length === 0) {
      setError("The prediction service returned an invalid forecast for Delhi.");
      return;
    }
    setError(null);
    setValidationMessage(null);
    setForecastData({
      location: {
        latitude: representative.latitude,
        longitude: representative.longitude,
      },
      forecast: forecastArray,
    });
    setLastCoords({ lat: representative.latitude, lon: representative.longitude });
    setSelectedIndex(0);

    if ("Notification" in window && Notification.permission === "granted") {
      const extreme = forecastArray.some((day) => String(day.risk ?? "").trim().toLowerCase() === "extreme");
      if (extreme) {
        new Notification("HeatGuard: Extreme Heat-Stress Risk", {
          body: "Delhi has a forecast day with Extreme heat-stress risk.",
          icon: "/favicon.ico",
        });
      }
    }
  }, []);

  const handleStateChange = useCallback((state) => {
    const canonicalState = isDelhi(state) ? "Delhi" : state;
    setSelectedState(canonicalState);
    setForecastData(null);
    setError(null);
    setValidationMessage(null);
    setSelectedIndex(0);
    setLastCoords(null);
    if (canonicalState && !isDelhi(canonicalState)) {
      setValidationMessage(DELHI_ONLY_MESSAGE);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (!lastCoords || !isDelhi(selectedState)) return;
    setLoading(true);
    setError(null);
    getForecast(lastCoords.lat, lastCoords.lon)
      .then((data) => {
        setForecastData(data);
        setSelectedIndex(0);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not refresh the heat-stress prediction.");
      })
      .finally(() => setLoading(false));
  }, [lastCoords, selectedState]);

  const selectedDay = useMemo(() => {
    if (!forecastData) return null;
    return forecastData.forecast[selectedIndex] ?? forecastData.forecast[0] ?? null;
  }, [forecastData, selectedIndex]);

  const showResults = Boolean(isDelhi(selectedState) && forecastData && selectedDay && !loading && !error);
  const showInProgress = Boolean(selectedState && !isDelhi(selectedState) && !loading && !error);

  return (
    <div className="min-h-screen bg-background">
      <Navbar status={status} />
      <Hero
        selectedState={selectedState}
        onStateChange={handleStateChange}
        loading={loading}
        validationMessage={validationMessage}
        onScanComplete={handleScanComplete}
        setLoading={setLoading}
      />
      <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12 sm:px-6 sm:py-16">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={handleRetry} />}
        {!loading && !error && !selectedState && (
          <section className="fade-rise rounded-2xl border border-border bg-secondary/20 px-6 py-10 text-center">
            <p className="font-display text-xl font-semibold">Select a state to begin</p>
            <p className="mt-2 text-sm text-muted-foreground">Choose a state above. Heat-stress ML predictions are currently available for Delhi only.</p>
          </section>
        )}
        {showInProgress && (
          <section className="fade-rise overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-12 text-center sm:px-10">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="text-2xl">◌</span>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{selectedState} · Coverage in progress</p>
            <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">Heat-stress prediction is still in progress</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              HeatGuard's current ML model is trained and validated on Delhi data only. We are not showing a risk prediction for {selectedState} until a model trained for that region is available.
            </p>
            <div className="mx-auto mt-6 max-w-xl rounded-xl border border-primary/20 bg-card px-4 py-3 text-left text-sm">
              <p className="font-semibold">Current ML coverage</p>
              <p className="mt-1 text-muted-foreground">Delhi only · Other states: prediction coverage still in progress</p>
            </div>
          </section>
        )}
        {showResults && (
          <div className="space-y-12">
            <LocationCard stateName={selectedState} />
            <HeatwaveAlert forecast={forecastData.forecast} />
            <DateSelector forecast={forecastData.forecast} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
            {selectedDay && <HumanImpact day={selectedDay} stateName={selectedState} />}
            {selectedDay && <RiskOverview day={selectedDay} />}
            {selectedDay && <MetricsGrid day={selectedDay} />}
            <ForecastList forecast={forecastData.forecast} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
            <Charts forecast={forecastData.forecast} />
            <SafetySection day={selectedDay} />
            {selectedDay && <WbgtSection day={selectedDay} />}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Index;
