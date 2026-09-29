import { MapPin, Sparkles, TriangleAlert, Shield, Activity, Navigation } from "lucide-react";
import { StateRiskMap } from "./StateRiskMap";

const QUICK_STATES = [
  { name: "Delhi", active: true },
  { name: "Maharashtra", active: false },
  { name: "Rajasthan", active: false },
  { name: "Uttar Pradesh", active: false },
  { name: "Tamil Nadu", active: false },
];

export function Hero({
  selectedState,
  onStateChange,
  loading,
  validationMessage,
  onScanComplete,
  setLoading,
}) {
  return (
    <section id="dashboard" className="relative overflow-hidden deep-panel scroll-mt-24">
      {/* Background glow graphics */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 size-[32rem] rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--risk-high), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-20 size-[30rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 65%)" }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:py-16">
        <div className="fade-rise flex flex-col justify-between lg:pt-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass-chip px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm">
              <Sparkles className="size-3.5 text-amber-300" />
              <span>AI-Powered Heat-Stress Intelligence</span>
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              Know the Heat. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300">
                Understand the Risk.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg">
              Explore real-time spatial heatwave risk and 7-day Wet Bulb Globe Temperature (WBGT) predictions across India.
            </p>

            {/* Quick State Selectors */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider opacity-75">Quick Select Region</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {QUICK_STATES.map((st) => {
                  const isSelected = selectedState === st.name;
                  return (
                    <button
                      key={st.name}
                      type="button"
                      onClick={() => onStateChange(st.name)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-white text-slate-900 shadow-md ring-2 ring-white/50"
                          : "glass-chip hover:bg-white/20 text-white"
                      }`}
                    >
                      <MapPin className="size-3" />
                      {st.name}
                      {st.name === "Delhi" && (
                        <span className="ml-1 rounded bg-amber-400/30 px-1 py-0.2 text-[10px] text-amber-200">
                          Active ML
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Key feature callouts */}
            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {[
                { icon: Shield, k: "WBGT Scale", v: "Heat stress index" },
                { icon: Activity, k: "7-Day Outlook", v: "Daily risk analysis" },
                { icon: Navigation, k: "Delhi ML", v: "Live predictions" },
              ].map((item) => (
                <div key={item.k} className="rounded-xl glass-chip p-3 transition-all hover:bg-white/15">
                  <dt className="flex items-center gap-1.5 font-display text-xs font-semibold">
                    <item.icon className="size-3.5 opacity-80" />
                    {item.k}
                  </dt>
                  <dd className="mt-1 text-[11px] opacity-80 leading-tight">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {selectedState && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Currently inspecting: <strong>{selectedState}</strong></span>
            </div>
          )}
        </div>

        {/* Right Map Panel */}
        <div className="fade-rise rounded-2xl border border-white/20 bg-white/95 p-5 text-foreground shadow-2xl backdrop-blur sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">Interactive State Heat Risk Map</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              India GIS
            </span>
          </div>

          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Select any state or click coordinates on the map. Selecting <strong>Delhi</strong> runs the active ML model; other states indicate coverage in progress.
          </p>

          {validationMessage && (
            <div
              className="mt-3 mb-3 flex items-start gap-3 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-xs text-slate-700 shadow-sm"
              role="status"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-800">Coverage in Progress</p>
                <p className="mt-0.5 leading-relaxed">{validationMessage}</p>
              </div>
            </div>
          )}

          <div className="mt-3">
            <StateRiskMap
              selectedState={selectedState}
              onStateChange={onStateChange}
              onScanComplete={onScanComplete}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

