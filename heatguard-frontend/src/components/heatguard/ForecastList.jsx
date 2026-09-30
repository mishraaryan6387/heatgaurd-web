import { CloudRain, Flame, ShieldCheck, Calendar, Sparkles } from "lucide-react";
import { formatDate, riskStyle } from "@/lib/risk";
import { SectionHeading } from "./MetricsGrid";

const GLASS_STYLES = {
  low: {
    bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(240, 253, 244, 0.65) 100%)",
    border: "rgba(34, 197, 94, 0.4)",
    shadow: "0 8px 30px -4px rgba(34, 197, 94, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)",
    activeGlow: "0 12px 36px -4px rgba(34, 197, 94, 0.28), inset 0 1px 2px 0 rgba(255, 255, 255, 1)",
    pill: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
    textRisk: "text-emerald-700 dark:text-emerald-400",
  },
  moderate: {
    bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(254, 252, 232, 0.65) 100%)",
    border: "rgba(234, 179, 8, 0.45)",
    shadow: "0 8px 30px -4px rgba(234, 179, 8, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)",
    activeGlow: "0 12px 36px -4px rgba(234, 179, 8, 0.28), inset 0 1px 2px 0 rgba(255, 255, 255, 1)",
    pill: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    textRisk: "text-amber-700 dark:text-amber-400",
  },
  high: {
    bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 247, 237, 0.7) 100%)",
    border: "rgba(249, 115, 22, 0.45)",
    shadow: "0 8px 30px -4px rgba(249, 115, 22, 0.14), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)",
    activeGlow: "0 12px 36px -4px rgba(249, 115, 22, 0.32), inset 0 1px 2px 0 rgba(255, 255, 255, 1)",
    pill: "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30",
    textRisk: "text-orange-700 dark:text-orange-400",
  },
  veryhigh: {
    bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(254, 242, 242, 0.72) 100%)",
    border: "rgba(239, 68, 68, 0.45)",
    shadow: "0 8px 30px -4px rgba(239, 68, 68, 0.16), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)",
    activeGlow: "0 12px 36px -4px rgba(239, 68, 68, 0.35), inset 0 1px 2px 0 rgba(255, 255, 255, 1)",
    pill: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30",
    textRisk: "text-rose-700 dark:text-rose-400",
  },
  extreme: {
    bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(254, 226, 226, 0.75) 100%)",
    border: "rgba(185, 28, 28, 0.5)",
    shadow: "0 8px 30px -4px rgba(185, 28, 28, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)",
    activeGlow: "0 12px 36px -4px rgba(185, 28, 28, 0.4), inset 0 1px 2px 0 rgba(255, 255, 255, 1)",
    pill: "bg-red-700/15 text-red-900 dark:text-red-200 border-red-700/35",
    textRisk: "text-red-700 dark:text-red-400",
  },
};

export function ForecastList({ forecast, selectedIndex, onSelect }) {
  return (
    <section id="forecast" className="scroll-mt-24">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title={`${forecast.length}-Day Heat-Stress Forecast`}
          subtitle="Select a day to update the live overview, metrics grid, WBGT analysis, and interactive charts."
        />
        <div className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/70 px-3.5 py-1 text-xs font-semibold text-muted-foreground shadow-2xs backdrop-blur-md">
          <Calendar className="size-3.5 text-primary" />
          <span>7-Day ML Outlook</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {forecast.map((day, index) => {
          const style = day.heatwave ? riskStyle(day.risk) : riskStyle("Low");
          const riskKey = (day.heatwave ? day.risk : "low").toLowerCase().replace(/[^a-z]/g, "");
          const glass = GLASS_STYLES[riskKey] || GLASS_STYLES.low;
          const selected = index === selectedIndex;

          return (
            <button
              key={`${day.date}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={selected}
              className={`fade-rise lift-hover text-left p-5 transition-all duration-300 relative overflow-hidden rounded-2xl border backdrop-blur-xl ${
                selected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.025]"
                  : "hover:scale-[1.015]"
              }`}
              style={{
                background: glass.bg,
                borderColor: selected ? "var(--color-primary)" : glass.border,
                boxShadow: selected ? glass.activeGlow : glass.shadow,
              }}
            >
              {/* Frosted Glass Sheen Gradient */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent opacity-70"
              />

              {/* Active Indicator Badge */}
              {selected && (
                <span className="absolute top-0 right-0 inline-flex items-center gap-1 rounded-bl-xl bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-xs">
                  <Sparkles className="size-2.5" />
                  Active
                </span>
              )}

              {/* Card Header: Date & Glass Risk Pill */}
              <div className="relative flex items-center justify-between gap-2">
                <p className="font-display text-sm font-bold tracking-tight text-foreground">
                  {formatDate(day.date)}
                </p>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase backdrop-blur-md shadow-2xs ${glass.pill}`}
                >
                  {style.label}
                </span>
              </div>

              {/* Condition Status */}
              <p className={`relative mt-3 flex items-center gap-1.5 text-xs font-semibold ${day.heatwave ? glass.textRisk : "text-emerald-700 dark:text-emerald-400"}`}>
                {day.heatwave ? <Flame className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                {day.heatwave ? "Elevated heat-stress" : "No elevated heat-stress"}
              </p>

              {/* Sensor Rows */}
              <dl className="relative mt-4 space-y-1.5 text-xs">
                <Row label="Temp max / mean" value={`${day.temperature.max.toFixed(1)} / ${day.temperature.mean.toFixed(1)} °C`} />
                <Row label="WBGT max / mean" value={`${day.wbgt.max.toFixed(1)} / ${day.wbgt.mean.toFixed(1)} °C`} />
                <Row label="Rainfall" value={`${day.rain.total.toFixed(1)} mm`} />
              </dl>

              {/* Footer status */}
              <p className="relative mt-4 flex items-center gap-1.5 border-t border-black/5 dark:border-white/10 pt-3 text-xs font-medium text-muted-foreground">
                <CloudRain className="size-3.5" />
                {day.rain.status}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}


