# HeatGuard backend setup

Run from the project root (`SIH-main`):

```powershell
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

The API is available at `http://127.0.0.1:8000`.

The prediction endpoint remains the same:
`GET /api/predict?latitude=<lat>&longitude=<lon>`

The optional `heatwave_timing` field is derived from the hourly WBGT forecast using the same 30°C / 3-consecutive-hour rule. If timing calculation fails, the core risk prediction still returns normally and `heatwave_timing` is `null`.
