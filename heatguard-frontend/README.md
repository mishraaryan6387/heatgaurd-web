# HeatGuard - AI-Powered Heat-Stress Intelligence & Risk Assessment

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-22b5bf)](https://recharts.org/)

An AI-driven Heat-Stress Risk Assessment platform for India, translating meteorological predictions and machine learning models into actionable Wet Bulb Globe Temperature (WBGT) insights, localized spatial risk mapping, demographic human vulnerability analysis, and public safety advisories.

> 📘 **For comprehensive workflow diagrams, spatial ray-casting algorithms, and complete mathematical formulations, check out [PROJECT_WORKFLOW.md](./PROJECT_WORKFLOW.md).**

---

## 🌟 Key Features

- **🗺️ Interactive State-Based Heat Risk Map (GIS & GeoJSON)**:
  - Powered by Leaflet & React-Leaflet with official India state boundary GeoJSON polygons.
  - Automatic boundary detection with smooth camera zoom (`fitBounds`).
  - Spatial ray-casting point sampling inside polygon borders to visualize risk distribution.
  - Interactive map markers with risk-coded pins and floating human impact preview popups.
  - **"Use My Location"** button with automatic reverse geocoding to identify your state.

- **🤖 ML Prediction Integration & Resilient Offline Fallback**:
  - Connects to the FastAPI backend (`/api/predict?latitude=...&longitude=...`) for high-resolution 7-day temperature, WBGT, and heatwave predictions (active ML coverage for Delhi).
  - Clean *"Coverage in Progress"* status for other Indian states while models are being trained.
  - **Built-in Offline Resilience**: If the backend is offline or unreachable, the frontend automatically switches to a realistic Delhi simulation model (`generateDelhiMockForecast`), ensuring seamless live demos and testing.

- **📅 7-Day Synchronized Date Stepper & Carousel**:
  - Interactive date timeline controller with "Today", "Tomorrow", and relative day labels.
  - "Back to Today" shortcut button.
  - Unidirectional state management: selecting any date synchronizes all dashboard metrics, human impact scores, WBGT breakdowns, and safety guidelines.

- **👥 Human Impact Assessment Layer**:
  - Visual 0–100 SVG radial score ring evaluated via deterministic scoring:
    $$\text{Thermal Stress (50\%)} + \text{Vulnerability (30\%)} + \text{Exposure (20\%)}$$
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
| **Backend Integration** | REST API (FastAPI backend at `http://127.0.0.1:8000` with offline mock fallback) |

---

## 📁 Project Directory Structure

```
heatguard-frontend/
├── index.html                     # HTML5 entry point
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # Vite & Tailwind CSS v4 configuration
├── .env.example                   # Environment variable template
├── PROJECT_WORKFLOW.md            # Detailed architecture & workflow documentation
├── README.md                      # Project overview & guide
├── public/                        # Static assets & icons
└── src/
    ├── main.jsx                   # Application entry point
    ├── styles.css                 # OKLCH design variables, glassmorphism & animations
    ├── routes/
    │   └── index.jsx              # Main dashboard page orchestrator
    ├── components/
    │   ├── heatguard/             # HeatGuard domain-specific components
    │   │   ├── Navbar.jsx         # Sticky scroll-spy navigation & health badge
    │   │   ├── Hero.jsx           # Hero banner, quick-state buttons & GIS card
    │   │   ├── StateRiskMap.jsx   # Leaflet map, ray-casting sampling & pin popups
    │   │   ├── LocationCard.jsx   # State info, PDF print, notifications & share
    │   │   ├── HeatwaveAlert.jsx  # Multi-day heatwave warning banner
    │   │   ├── DateSelector.jsx   # 7-day timeline controller & date switcher
    │   │   ├── HumanImpact.jsx    # Radial score ring, vulnerability bars & action chips
    │   │   ├── RiskOverview.jsx   # Risk meter gauge & condition callouts
    │   │   ├── MetricsGrid.jsx    # Environmental & meteorological metrics cards
    │   │   ├── ForecastList.jsx   # 7-day outlook card carousel
    │   │   ├── Charts.jsx         # Recharts temperature, WBGT & rain graphs
    │   │   ├── SafetySection.jsx  # Heat safety guidelines with interactive checklist
    │   │   ├── WbgtSection.jsx    # WBGT educational breakdown & gauge
    │   │   ├── LoadingState.jsx   # Skeleton loaders
    │   │   ├── ErrorState.jsx     # Error boundary card with retry
    │   │   └── Footer.jsx         # Application footer
    │   └── ui/                    # Reusable UI component library
    └── lib/
        ├── api.js                 # API service, health checks & offline mock fallback
        ├── risk.js                # Risk rankings, color scales & formatting helpers
        ├── vulnerabilityData.js   # Human impact formula & state vulnerability profiles
        └── utils.js               # Tailwind styling utilities
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/heatguard-frontend.git
cd heatguard-frontend

# 2. Install dependencies
npm install
```

### Environment Configuration

The frontend works out of the box with the default backend URL (`http://127.0.0.1:8000`) or offline mock simulation. To customize the backend endpoint, create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Set your backend URL:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📡 Backend Integration

The frontend connects to a FastAPI machine learning service. Expected endpoints:

- `GET /api/health` - Service liveness status (`{"status": "ok"}`).
- `GET /api/predict?latitude={lat}&longitude={lon}` - Returns 7-day maximum/mean temperatures, WBGT indices, heatwave flags, timing windows, and rainfall forecasts.

*Note: If the backend is not running, HeatGuard automatically activates its offline simulation mode for Delhi coordinates so you can evaluate all features without a local Python server.*

---

## 📄 License

This project is licensed under the MIT License.
