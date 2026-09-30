# HeatGuard - AI-Powered Heat-Stress Intelligence & Risk Assessment

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![Scikit--Learn](https://img.shields.io/badge/Scikit--Learn-ML-f7931e?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Render](https://img.shields.io/badge/Render-Backend_Live-46E3B7?logo=render&logoColor=black)](https://heatgaurd-backend.onrender.com)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend_Live-000000?logo=vercel&logoColor=white)](https://vercel.com/)

An AI-driven Heat-Stress Risk Assessment platform for India, translating multi-parameter meteorological predictions and machine learning models into actionable Wet Bulb Globe Temperature (WBGT) insights, localized spatial risk mapping, demographic human vulnerability analysis, and public safety advisories.

> 📘 **Looking for technical deep dives?** Check out the full **[Project Workflow & Architecture (PROJECT_WORKFLOW.md)](./PROJECT_WORKFLOW.md)** for spatial ray-casting algorithms, WBGT physics, and data flow diagrams.

---

## 🌐 Live Deployments

| Component | Platform | Status | URL |
|---|---|---|---|
| **Frontend Application** | **Vercel** | 🟢 **Live** | [Deployed on Vercel](https://heatgaurd-web-p9t6.vercel.app) |
| **ML Backend API** | **Render** | 🟢 **Live** | [`https://heatgaurd-backend.onrender.com`](https://heatgaurd-backend.onrender.com) |
| **Interactive API Docs** | **Swagger UI** | 🟢 **Live** | [`https://heatgaurd-backend.onrender.com/docs`](https://heatgaurd-backend.onrender.com/docs) |
| **API Health Endpoint** | **REST Service** | 🟢 **200 OK** | [`https://heatgaurd-backend.onrender.com/api/health`](https://heatgaurd-backend.onrender.com/api/health) |

---

## 📖 In-Depth Project Documentation

* 🗺️ **[PROJECT_WORKFLOW.md](./PROJECT_WORKFLOW.md)**: Comprehensive architectural pipeline, GIS ray-casting algorithm, WBGT calculation physics, and component tree.


---

## 🌟 Key Features

- **🗺️ Interactive State-Based Heat Risk Map (GIS & GeoJSON)**:
  - Powered by Leaflet & React-Leaflet with official India state boundary GeoJSON polygons.
  - Automatic boundary detection with smooth camera zoom (`fitBounds`).
  - Spatial ray-casting point sampling inside polygon borders to visualize risk distribution across the landmass.
  - Interactive map markers with risk-coded pins and floating human impact preview popups.
  - **"Use My Location"** button with automatic reverse geocoding to identify your state.

- **🤖 ML Prediction Engine & Resilient Offline Fallback**:
  - Connects to the live FastAPI backend (`/api/predict?latitude=...&longitude=...`) for high-resolution 7-day temperature, WBGT, and heatwave predictions (active ML coverage for Delhi).
  - Clean *"Coverage in Progress"* status for other Indian states while models are being trained.
  - **Built-in Offline Resilience**: If the backend is unreachable, the frontend automatically switches to an internal simulation model (`generateDelhiMockForecast`), ensuring uninterrupted demos and zero crash states.

- **📅 7-Day Synchronized Date Stepper & Carousel**:
  - Interactive date timeline controller with "Today", "Tomorrow", and relative day labels.
  - "Back to Today" shortcut button.
  - Unidirectional state management: selecting any date synchronizes all dashboard metrics, human impact scores, WBGT breakdowns, and safety guidelines.

- **👥 Human Impact Assessment Layer**:
  - Visual 0–100 SVG radial score ring evaluated via deterministic multi-factor scoring:
    $$\text{Human Impact Score} = \text{Thermal Stress (50\%)} + \text{Demographic Vulnerability (30\%)} + \text{Outdoor Labor Exposure (20\%)}$$
  - Demographic vulnerability progress bars (Elderly ratio, Outdoor Workers, Population Density).
  - **"Recommended Now" Action Chips**: Interactive action triggers (*Hydration*, *Shift Work Hours*, *Elderly Alert*, *Hospital Readiness*, *Cooling Shelters*) with hover/click micro-tooltips.

- **📊 Meteorological & WBGT Metrics Breakdown**:
  - Real-time heatwave risk gauge and multi-day condition banners.
  - 6-metric weather cards (Max/Mean Air Temp, Max/Mean WBGT, Precipitation, Humidity, Wind Speed, Solar Radiation).
  - Educational WBGT index section with visual heat-stress threshold gauge ($30^\circ\text{C}$ cutoff).

- **📈 Interactive Data Visualizations (Recharts)**:
  - Dual line/area charts comparing Dry-Bulb Air Temperature vs. Wet Bulb Globe Temperature.
  - Daily rainfall depth bar chart with conditional precipitation highlights.
  - Heatwave cutoff reference line indicators ($30^\circ\text{C}$).

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

| Domain | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 19, JavaScript (JSX), Vite 8 | Ultra-fast client-side SPA architecture |
| **Styling & Design** | Tailwind CSS v4, OKLCH tokens | Modern glassmorphic theme with responsive layout |
| **GIS & Mapping** | Leaflet 1.9, React-Leaflet 5, GeoJSON | Ray-casting point sampling inside Indian state borders |
| **Data Visualization** | Recharts 2.15 | Dual-axis line charts and precipitation histograms |
| **Backend & API** | FastAPI, Uvicorn, Python 3.12 | REST API handling predictions, CORS, and health checks |
| **Machine Learning** | Scikit-Learn, Joblib, NumPy, Pandas | Random Forest classifiers trained on ERA5 reanalysis data |
| **Heat-Stress Science** | Liljegren / PyWBGT, MetPy | Wet Bulb Globe Temperature calculation formulation |
| **Cloud Hosting** | Vercel (Frontend), Render (Backend) | Production cloud infrastructure |

---

## 📁 Repository Structure

```
heatgaurd/
├── PROJECT_SUMMARY.md             # Complete architecture and SIH PPT overview
├── README.md                      # Primary project overview & live deployment links
│
├── SIH-main/                      # Backend ML Service (Deployed on Render)
│   ├── backend/
│   │   ├── main.py                # FastAPI server, CORS middleware & route handlers
│   │   ├── prediction_services.py # ML model loading and feature matrix inference
│   │   ├── weather_services.py    # Open-Meteo weather forecast caching pipeline
│   │   └── schemas.py             # Pydantic response and request models
│   ├── models/
│   │   ├── heatwave_model.pkl     # Trained Random Forest Heatwave Classifier
│   │   └── risk_model.pkl         # Trained Multi-class Risk Severity Classifier
│   ├── calculate_wbgt.py          # ERA5 NetCDF loader & WBGT Liljegren formulation
│   ├── train_model.py             # Chronological ML training script
│   ├── requirements.txt           # Python dependencies
│   ├── Procfile                   # Cloud process execution rule for Render
│   └── BACKEND_SETUP.md           # Backend setup documentation
│
└── heatguard-frontend/            # Frontend Web Application (Deployed on Vercel)
    ├── src/
    │   ├── components/heatguard/  # Navbar, StateRiskMap, HumanImpact, Charts, etc.
    │   ├── lib/                   # API client, risk tokens, mock engine, vulnerability data
    │   ├── routes/                # Application root page orchestrator
    │   └── styles.css             # Design tokens, gradients, animations
    ├── index.html                 # HTML entry point
    ├── vercel.json                # Vercel SPA routing and rewrite rules
    ├── package.json               # Node.js dependencies & scripts
    └── vite.config.js             # Vite 8 & Tailwind CSS v4 config
```

---

## 🚀 Local Development Setup

### 1. Backend (Python FastAPI)

```powershell
# Navigate to backend directory
cd SIH-main

# Install dependencies
pip install -r requirements.txt

# Start local server on port 8000
uvicorn backend.main:app --reload --port 8000
```
- API Base: `http://127.0.0.1:8000`
- Interactive Docs: `http://127.0.0.1:8000/docs`

---

### 2. Frontend (React + Vite)

```powershell
# Navigate to frontend directory
cd heatguard-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
- Local URL: `http://localhost:5173` (or `http://localhost:8080`)

---

## ⚙️ Environment Configuration

### Frontend (`heatguard-frontend/.env`)
```env
# Point to your local server or production Render backend:
VITE_API_BASE_URL=https://heatgaurd-backend.onrender.com
```

### Backend Environment Variables (`Render Dashboard`)
```env
# Allow Vercel frontend domains to call the API:
FRONTEND_ORIGINS=*
PYTHON_VERSION=3.12.8
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health-check endpoint returning `{"status": "ok"}`. |
| `GET` | `/api/predict?latitude={lat}&longitude={lon}` | Returns 7-day meteorological metrics, WBGT maximum/mean, heatwave flags, timing windows, and risk classification. |

---

## 📄 License

This project is licensed under the MIT License.
