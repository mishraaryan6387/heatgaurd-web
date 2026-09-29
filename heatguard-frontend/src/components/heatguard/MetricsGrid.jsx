import { Activity, CloudRain, Droplets, Gauge, Thermometer, ThermometerSun } from "lucide-react";
import { formatDate } from "@/lib/risk";

export function MetricsGrid({ day }) {
  const getStatus = (label, val) => {
    if (label.includes("WBGT")) {
      return val >= 31 ? "Extreme Risk" : val >= 28 ? "High Risk" : val >= 25 ? "Caution" : "Normal";
    }
    if (label.includes("Temperature")) {
      return val >= 40 ? "Extreme Heat" : val >= 35 ? "High Heat" : "Moderate";
    }
    return null;
  };

  const metrics = [
    {
      icon: <ThermometerSun className="size-5 text-risk-high" />,
      label: "Maximum Temperature",
      value: day.temperature.max.toFixed(1),
      unit: "°C",
      status: getStatus("Temperature", day.temperature.max),
    },
    {
      icon: <Thermometer className="size-5 text-accent" />,
      label: "Mean Temperature",
      value: day.temperature.mean.toFixed(1),
      unit: "°C",
      status: getStatus("Temperature", day.temperature.mean),
    },
    {
      icon: <Activity className="size-5 text-risk-veryhigh" />,
      label: "Maximum WBGT Index",
      value: day.wbgt.max.toFixed(1),
      unit: "°C",
      status: getStatus("WBGT", day.wbgt.max),
    },
    {
      icon: <Gauge className="size-5 text-primary" />,
      label: "Mean WBGT Index",
      value: day.wbgt.mean.toFixed(1),
      unit: "°C",
      status: getStatus("WBGT", day.wbgt.mean),
    },
    {
      icon: <Droplets className="size-5 text-blue-500" />,
      label: "Precipitation Total",
      value: day.rain.total.toFixed(1),
      unit: "mm",
      status: day.rain.total > 0 ? "Rain Recorded" : "Dry",
    },
    {
      icon: <CloudRain className="size-5 text-primary" />,
      label: "Precipitation Outlook",
      value: day.rain.status,
      unit: "",
      status: null,
    },
  ];

  return (
    <section>
      <SectionHeading
        title="Meteorological & Heat-Stress Metrics"
        subtitle={`Detailed sensor parameters for ${formatDate(day.date, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}`}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <article
            key={m.label}
            className="fade-rise surface-card lift-hover flex flex-col justify-between p-5 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {m.label}
                </p>
                {m.status && (
                  <span className="mt-1.5 inline-block rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-semibold text-foreground">
                    {m.status}
                  </span>
                )}
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary/70 shadow-2xs">
                {m.icon}
              </span>
            </div>

            <p className="mt-4 font-display text-3xl font-semibold">
              {m.value}
              {m.unit && <span className="ml-1 text-base font-medium text-muted-foreground">{m.unit}</span>}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SectionHeading({ title, subtitle }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

