import { useState, useMemo } from "react";
import { Clock, Info, ShieldAlert } from "lucide-react";
import { calculateHumanImpact, RECOMMENDED_ACTIONS } from "@/lib/vulnerabilityData";

export function HumanImpact({ day, stateName }) {
  const [activeAction, setActiveAction] = useState(null);

  const impact = useMemo(() => {
    if (!day) return null;
    return calculateHumanImpact(day, stateName);
  }, [day, stateName]);

  if (!impact) return null;

  // SVG Radial Progress Calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (impact.score / 100) * circumference;

  const vulnItems = [
    {
      id: "elderly",
      icon: "👴",
      label: "Elderly Population",
      level: impact.vulnerabilities.elderly.level,
      score: impact.vulnerabilities.elderly.score,
      color:
        impact.vulnerabilities.elderly.level === "VERY HIGH"
          ? "bg-risk-veryhigh"
          : impact.vulnerabilities.elderly.level === "HIGH"
          ? "bg-risk-high"
          : "bg-risk-moderate",
      textColor:
        impact.vulnerabilities.elderly.level === "VERY HIGH"
          ? "text-risk-veryhigh"
          : impact.vulnerabilities.elderly.level === "HIGH"
          ? "text-risk-high"
          : "text-risk-moderate",
    },
    {
      id: "workers",
      icon: "👷",
      label: "Outdoor Workers",
      level: impact.vulnerabilities.outdoorWorkers.level,
      score: impact.vulnerabilities.outdoorWorkers.score,
      color:
        impact.vulnerabilities.outdoorWorkers.level === "VERY HIGH"
          ? "bg-risk-veryhigh"
          : impact.vulnerabilities.outdoorWorkers.level === "HIGH"
          ? "bg-risk-high"
          : "bg-risk-moderate",
      textColor:
        impact.vulnerabilities.outdoorWorkers.level === "VERY HIGH"
          ? "text-risk-veryhigh"
          : impact.vulnerabilities.outdoorWorkers.level === "HIGH"
          ? "text-risk-high"
          : "text-risk-moderate",
    },
    {
      id: "density",
      icon: "🏙",
      label: "Population Density",
      level: impact.vulnerabilities.density.level,
      score: impact.vulnerabilities.density.score,
      color:
        impact.vulnerabilities.density.level === "VERY HIGH"
          ? "bg-risk-veryhigh"
          : impact.vulnerabilities.density.level === "HIGH"
          ? "bg-risk-high"
          : "bg-risk-moderate",
      textColor:
        impact.vulnerabilities.density.level === "VERY HIGH"
          ? "text-risk-veryhigh"
          : impact.vulnerabilities.density.level === "HIGH"
          ? "text-risk-high"
          : "text-risk-moderate",
    },
  ];

  return (
    <section id="human-impact" className="scroll-mt-24 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-primary" />
          <h2 className="font-display text-2xl font-bold tracking-tight">Human Impact</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-2xs">
          <Info className="size-3 text-primary" />
          <span>Decision-Support Prototype</span>
        </span>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* LEFT COLUMN: Large Visual Human Impact Score */}
        <div className="fade-rise surface-card flex flex-col items-center justify-between p-6 sm:p-8 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Human Impact Index
          </p>

          {/* Radial Circular Progress */}
          <div className="relative my-6 flex items-center justify-center">
            <svg className="size-44 -rotate-90 transform" viewBox="0 0 140 140">
              {/* Background Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-secondary"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={impact.color}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tight ${impact.textColor}`}>
                {impact.score}
              </span>
              <span className={`mt-0.5 text-xs font-bold uppercase tracking-wider ${impact.textColor}`}>
                {impact.category}
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground">
                Estimated human impact
              </span>
            </div>
          </div>

          {/* Bottom Summary & Peak Window */}
          <div className="w-full border-t border-border/70 pt-4">
            <p className="text-xs font-medium text-muted-foreground">
              {impact.score >= 65
                ? "Elevated thermal stress & exposure detected"
                : "Moderate localized heat-stress exposure"}
            </p>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground">
              <Clock className="size-3.5 text-primary" />
              <span>Peak risk: {impact.peakRisk}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Compact Vulnerability Breakdown */}
        <div className="fade-rise surface-card flex flex-col justify-between p-6 sm:p-8 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold tracking-tight">
                WHO IS MOST EXPOSED?
              </h3>
              <span className="text-[11px] font-medium text-muted-foreground">
                {stateName}
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {vulnItems.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className={`font-bold tracking-wide uppercase ${item.textColor}`}>
                      {item.level}
                    </span>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${item.color}`}
                      style={{ width: `${Math.round(item.score * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border/60 bg-secondary/30 px-3.5 py-2.5 text-[11px] text-muted-foreground">
            Combined from demographic density and environmental exposure indices.
          </div>
        </div>
      </div>

      {/* RECOMMENDED NOW - Pill/Chip Style Action Items */}
      <div className="fade-rise rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Recommended Now
          </p>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Click or hover to inspect action protocol
          </span>
        </div>

        {/* Action Pills */}
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {RECOMMENDED_ACTIONS.map((action) => {
            const isSelected = activeAction?.id === action.id;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => setActiveAction(isSelected ? null : action)}
                onMouseEnter={() => setActiveAction(action)}
                className={`group relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary"
                }`}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Action Detail Tooltip/Popover */}
        {activeAction && (
          <div className="mt-3.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs transition-all animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <span>{activeAction.icon}</span>
              <span>{activeAction.fullTitle}</span>
            </div>
            <p className="mt-1 text-muted-foreground leading-relaxed">
              {activeAction.tooltip}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
