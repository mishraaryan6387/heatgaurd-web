# HeatGuard - AI-Powered Heat-Stress Intelligence & Risk Assessment

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-22b5bf)](https://recharts.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend_Live-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Backend_Live-46E3B7?logo=render&logoColor=black)](https://heatgaurd-backend.onrender.com)

An AI-driven Heat-Stress Risk Assessment platform for India, translating meteorological predictions and machine learning models into actionable Wet Bulb Globe Temperature (WBGT) insights, localized spatial risk mapping, demographic human vulnerability analysis, and public safety advisories.

> 📘 **For comprehensive workflow diagrams, spatial ray-casting algorithms, and complete mathematical formulations, check out [PROJECT_WORKFLOW.md](./PROJECT_WORKFLOW.md).**

---

## 🌐 Live Deployments

| Component | Platform | Status | URL |
|---|---|---|---|
| **Frontend Web App** | **Vercel** | 🟢 **Live** | [Deployed on Vercel](https://heatgaurd-web-p9t6.vercel.app) |
| **ML Backend API** | **Render** | 🟢 **Live** | [`https://heatgaurd-backend.onrender.com`](https://heatgaurd-backend.onrender.com) |
| **Interactive API Docs** | **Swagger UI** | 🟢 **Live** | [`https://heatgaurd-backend.onrender.com/docs`](https://heatgaurd-backend.onrender.com/docs) |
| **API Health Endpoint** | **REST Service** | 🟢 **200 OK** | [`https://heatgaurd-backend.onrender.com/api/health`](https://heatgaurd-backend.onrender.com/api/health) |

---

## 🌟 Key Features

- **🗺️ Interactive State-Based Heat Risk Map (GIS & GeoJSON)**:
  - Powered by Leaflet & React-Leaflet with official India state boundary GeoJSON polygons.
  - Automatic boundary detection with smooth camera zoom (`fitBounds`).
  - Spatial ray-casting point sampling inside polygon borders to visualize risk distribution.
  - Interactive map markers with risk-coded pins and floating human impact preview popups.
  - **"Use My Location"** button with automatic reverse geocoding to identify your state.

- **🤖 ML Prediction Integration & Resilient Offline Fallback**:
  - Connects to the live FastAPI backend (`/api/predict?latitude=...&longitude=...`) for high-resolution 7-day temperature, WBGT, and heatwave predictions (active ML coverage for Delhi).
  - Clean *"Coverage in Progress"* status for other Indian states while models are being trained.
  - **Built-in Offline Resilience**: If the backend is offline or unreachable, the frontend automatically switches to a realistic Delhi simulation model (`generateDelhiMockForecast`), ensuring seamless live demos and testing.

- **📅 7-Day Synchronized Date Stepper & Carousel**:
  - Interactive date timeline controller with "Today", "Tomorrow", and relative day labels.
  - "Back to Today" shortcut button.
  - Unidirectional state management: selecting any date synchronizes all dashboard metrics, human impact scores, WBGT breakdowns, and safety guidelines.

- **👥 Human Impact Assessment Layer**:
  - Visual 0–100 SVG radial score ring evaluated via deterministic scoring:
    $$\text{Human Impact Score} = \text{Thermal Stress (50\%)} + \text{Vulnerability (30\%)} + \text{Exposure (20\%)}$$
  - Demographic vulnerability progress bars (Elderly ratio, Outdoor Workers, Population Density).
  - **"Recommended Now" Action Chips**: Interactive action triggers (*Hydration*, *Shift Work Hours*, *Elderly Alert*, *Hospital Readiness*, *Cooling Shelters*) with hover/click micro-tooltips.

- **📊 Meteorological & WBGT Metrics Breakdown**:
  - Real-time heatwave risk gauge and multi-day condition banners.
  - 6-metric weather cards (Max/Mean Air Temp, Max/Mean WBGT, Precipitation, Humidity, Wind Speed, Solar Radiation).
  - Educational WBGT index section with visual heat-stress threshold gauge ($30^\circ\text{C}$ cutoff).

- **📈 Interactive Data Visualizations (Recharts)**:
  - Dual line/area charts comparing Dry-Bulb Air Temperature vs. Wet Bulb Globe Temperature.
  - Daily rainfall depth bar chart with conditional precipitation highlights.
  - Heatwave cutoff reference line indicators.

- **🛡️ Tailored Heat Safety Guidelines & Interactive Checklist**:
  - Dynamically customized advice for Hydration, Sun Protection, Cooling, and Vulnerable Care.
  - Interactive item checkboxes with a real-time completion counter (`X / Y Completed`).

- **🔔 Alerts, Sharing & PDF Export**:
  - HTML5 Web Notification API integration for high-priority alerts on Extreme heat-stress days.
  - Web Share API integration with clipboard link copy fallback.
  - Print / PDF export layout trigger (`window.print()`).
  - Sticky header with real-time `IntersectionObserver` scroll-spy and live backend health indicator.

---

## 🛠️ Technology Stack

| Domain | Technology |
|---|---|
| **Frontend Framework** | React 19, JavaScript (JSX), Vite 8 |
| **Styling & Design System** | Tailwind CSS v4 (`@tailwindcss/vite`, `tw-animate-css`), OKLCH color palette |
| **GIS & Mapping** | Leaflet 1.9.4, React-Leaflet 5.0.0, OpenStreetMap, GeoJSON (`udit-001/india-maps-data`) |
| **Data Visualization** | Recharts 2.15 (AreaChart, LineChart, BarChart) |
| **Iconography** | Lucide React |
| **UI Primitives** | Radix UI primitives (`@radix-ui/react-*`), class-variance-authority, clsx, tailwind-merge |
| **Backend Integration** | REST API connected to live Render service at `https://heatgaurd-backend.onrender.com` |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/mishraaryan6387/heatgaurd-web.git
cd heatguard-frontend

# Install dependencies
npm install
```

### Environment Configuration

To point to the live Render backend or local server, configure `.env`:

```env
VITE_API_BASE_URL=https://heatgaurd-backend.onrender.com
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` or `http://localhost:8080` in your browser.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

This project is licensed under the MIT License.
