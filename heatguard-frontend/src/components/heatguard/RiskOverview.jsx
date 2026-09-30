import { Flame, ShieldCheck, ThermometerSun, Bell, Share2, Check, Clock } from "lucide-react";
import { useState } from "react";
import { formatDate, riskStyle, WBGT_THRESHOLD } from "@/lib/risk";

export function RiskOverview({ day }) {
  const style = riskStyle(day.risk);
  const [copied, setCopied] = useState(false);
  const [notifStatus, setNotifStatus] = useState(
    "Notification" in window ? Notification.permission : "default"
  );

  const handleCopy = () => {
    const text = `HeatGuard Risk Report (${formatDate(day.date)}): Risk Level ${style.label}, Max Temp: ${day.temperature.max.toFixed(
      1
    )}°C, Max WBGT: ${day.wbgt.max.toFixed(1)}°C (${day.heatwave ? "Elevated Heat-Stress" : "Normal"}).`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnableNotifications = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        setNotifStatus(perm);
        if (perm === "granted") {
          new Notification("HeatGuard Alerts Enabled", {
            body: "You will receive high-priority notifications for extreme heat risk days.",
            icon: "/favicon.ico",
          });
        }
      });
    }
  };

  return (
    <section id="risk-analysis" className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] scroll-mt-24">
      {/* Left Primary Card */}
      <article className={`fade-rise relative overflow-hidden rounded-2xl border-2 ${style.border} ${style.bg} p-6 sm:p-8 shadow-sm`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Risk level · {formatDate(day.date, { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1 text-xs font-semibold shadow-xs transition-colors hover:bg-secondary"
              title="Copy Risk Summary"
            >
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Share2 className="size-3.5 text-muted-foreground" />}
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
            {notifStatus !== "granted" && (
              <button
                type="button"
                onClick={handleEnableNotifications}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1 text-xs font-semibold shadow-xs transition-colors hover:bg-secondary"
                title="Enable Desktop Notifications"
              >
                <Bell className="size-3.5 text-amber-500" />
                <span>Alerts</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <h2 className={`font-display text-4xl font-semibold sm:text-5xl ${style.text}`}>
            {style.label}
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-xs">
            <span className={`size-2.5 rounded-full ${style.dot} animate-pulse`} />
            Heat-Stress Assessment
          </span>
        </div>

        {/* Visual Gauge Bar */}
        <div className="mt-7">
          <div className="relative h-3 w-full overflow-hidden rounded-full heat-bar opacity-90 shadow-inner" />
          <div className="relative mt-2 h-4">
            <span
              className="absolute -top-6 size-4 rounded-full border-2 border-card shadow-lg transition-all duration-500"
              style={{
                left: `calc(${style.scale * 100}% - 8px)`,
                backgroundColor: style.chart,
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Very High</span>
            <span>Extreme</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Stat
            icon={<ThermometerSun className="size-4 text-risk-high" />}
            label="Max Temperature"
            value={`${day.temperature.max.toFixed(1)} °C`}
            subtext={`Mean: ${day.temperature.mean.toFixed(1)} °C`}
          />
          <Stat
            icon={<Flame className="size-4 text-risk-veryhigh" />}
            label="Max WBGT Index"
            value={`${day.wbgt.max.toFixed(1)} °C`}
            subtext={`Mean: ${day.wbgt.mean.toFixed(1)} °C`}
          />
        </div>
      </article>

      {/* Right Heatwave Condition Card */}
      <article
        className={`fade-rise flex flex-col justify-between rounded-2xl border-2 p-6 sm:p-8 shadow-sm ${
          day.heatwave ? "border-risk-veryhigh/50 bg-risk-veryhigh-soft" : "border-risk-low/40 bg-risk-low-soft"
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Heat-Stress Condition
            </p>
            {day.heatwave_timing?.label && (
              <span className="inline-flex items-center gap-1 rounded-md bg-card/80 px-2 py-0.5 text-[11px] font-medium text-foreground">
                <Clock className="size-3" />
                {day.heatwave_timing.label}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-start gap-3">
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl shadow-xs ${
                day.heatwave ? "bg-risk-veryhigh text-white" : "bg-risk-low text-white"
              }`}
            >
              {day.heatwave ? <Flame className="size-5" /> : <ShieldCheck className="size-5" />}
            </span>
            <h3
              className={`font-display text-2xl font-semibold leading-tight ${
                day.heatwave ? "text-risk-veryhigh" : "text-risk-low"
              }`}
            >
              {day.heatwave ? "ELEVATED HEAT-STRESS RISK" : "NO ELEVATED HEAT-STRESS RISK"}
            </h3>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Determined by ML models using Wet Bulb Globe Temperature (WBGT) heatwave thresholds with a {WBGT_THRESHOLD}°C cutoff.
          </p>
        </div>

        <dl className="mt-6 grid gap-2 border-t border-border/70 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Mean Ambient Temperature</dt>
            <dd className="font-semibold">{day.temperature.mean.toFixed(1)} °C</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Mean WBGT Index</dt>
            <dd className="font-semibold">{day.wbgt.mean.toFixed(1)} °C</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Precipitation Status</dt>
            <dd className="font-semibold">
              {day.rain.total.toFixed(1)} mm · {day.rain.status}
            </dd>
          </div>
        </dl>
      </article>
    </section>
  );
}

function Stat({ icon, label, value, subtext }) {
  return (
    <div className="rounded-xl border border-border bg-card/80 px-4 py-3 shadow-2xs">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <div className="mt-1 flex items-baseline justify-between">
        <p className="font-display text-xl font-semibold">{value}</p>
        {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
      </div>
    </div>
  );
}

