import {
  AreaChart,
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CloudRain, TrendingUp, Layers } from "lucide-react";
import { useState } from "react";
import { formatDate, WBGT_THRESHOLD } from "@/lib/risk";
import { SectionHeading } from "./MetricsGrid";

const axis = { fontSize: 12, fill: "var(--muted-foreground)" };

function tooltipStyle() {
  return {
    contentStyle: {
      borderRadius: 12,
      border: "1px solid var(--color-border)",
      background: "var(--color-card)",
      fontSize: 12,
      boxShadow: "var(--shadow-card)",
      padding: "10px 14px",
    },
  };
}

export function Charts({ forecast }) {
  const [activeTab, setActiveTab] = useState("all");

  const data = forecast.map((d) => ({
    date: formatDate(d.date),
    tempMax: d.temperature.max,
    tempMean: d.temperature.mean,
    wbgtMax: d.wbgt.max,
    wbgtMean: d.wbgt.mean,
    rain: d.rain.total,
    overThreshold: d.wbgt.max >= WBGT_THRESHOLD,
  }));

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Interactive Environmental Trends"
          subtitle="Real-time ML forecast comparisons over the next 7 days."
        />
        <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/40 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "all" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Charts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wbgt")}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "wbgt" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            WBGT Index Only
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {(activeTab === "all" || activeTab === "temp") && (
          <ChartCard
            title="Air Temperature Trend (°C)"
            note="Daily maximum and mean dry-bulb air temperature"
            icon={<TrendingUp className="size-4 text-risk-high" />}
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="tempMaxGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--risk-high)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--risk-high)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" tick={axis} tickLine={false} axisLine={false} />
                <YAxis tick={axis} tickLine={false} axisLine={false} width={48} label={{ value: "°C", angle: -90, position: "insideLeft", style: axis }} />
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)} °C`} {...tooltipStyle()} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="tempMax" name="Max Air Temp" stroke="var(--risk-high)" fill="url(#tempMaxGrad)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="tempMean" name="Mean Air Temp" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {(activeTab === "all" || activeTab === "wbgt") && (
          <ChartCard
            title="Wet Bulb Globe Temperature (WBGT)"
            note={`Reference dashed line indicates ${WBGT_THRESHOLD}°C threshold`}
            icon={<Layers className="size-4 text-risk-veryhigh" />}
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="wbgtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--risk-veryhigh)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--risk-veryhigh)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" tick={axis} tickLine={false} axisLine={false} />
                <YAxis tick={axis} tickLine={false} axisLine={false} width={48} label={{ value: "°C", angle: -90, position: "insideLeft", style: axis }} />
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)} °C`} {...tooltipStyle()} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine
                  y={WBGT_THRESHOLD}
                  stroke="var(--risk-extreme)"
                  strokeDasharray="6 4"
                  label={{
                    value: "Heatwave Cutoff",
                    position: "insideTopRight",
                    fill: "var(--risk-extreme)",
                    fontSize: 11,
                  }}
                />
                <Area type="monotone" dataKey="wbgtMax" name="Max WBGT Index" stroke="var(--risk-veryhigh)" fill="url(#wbgtGrad)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="wbgtMean" name="Mean WBGT Index" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {activeTab === "all" && (
        <ChartCard
          title="Precipitation Outlook (mm)"
          note="Total predicted daily rainfall depth"
          icon={<CloudRain className="size-4 text-blue-500" />}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" tick={axis} tickLine={false} axisLine={false} />
              <YAxis tick={axis} tickLine={false} axisLine={false} width={48} label={{ value: "mm", angle: -90, position: "insideLeft", style: axis }} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(1)} mm`} {...tooltipStyle()} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="rain" name="Daily Rain" radius={[8, 8, 0, 0]} maxBarSize={54}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.rain > 0 ? "var(--color-accent)" : "var(--color-border)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </section>
  );
}

function ChartCard({ title, note, icon, children }) {
  return (
    <article className="fade-rise surface-card p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        </div>
        {icon && <span className="flex size-8 items-center justify-center rounded-lg bg-secondary/80">{icon}</span>}
      </div>
      <div className="w-full overflow-hidden">{children}</div>
    </article>
  );
}

