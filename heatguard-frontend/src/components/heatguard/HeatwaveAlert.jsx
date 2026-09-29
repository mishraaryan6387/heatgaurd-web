import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import { formatDate } from "@/lib/risk";

export function HeatwaveAlert({ forecast }) {
  const riskDays = forecast.filter((d) => d.heatwave);
  const active = riskDays.length > 0;
  return (_jsxs("div", {
    role: "status",
    className: `fade-rise flex flex-col gap-3 rounded-2xl border-2 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6 ${active ? "border-risk-veryhigh/50 bg-risk-veryhigh-soft" : "border-risk-low/40 bg-risk-low-soft"}`,
    children: [
      _jsx("span", { className: `flex size-12 shrink-0 items-center justify-center rounded-xl ${active ? "bg-risk-veryhigh text-white" : "bg-risk-low text-white"}`, children: active ? _jsx(TriangleAlert, { className: "size-6" }) : _jsx(ShieldCheck, { className: "size-6" }) }),
      _jsxs("div", { className: "min-w-0", children: [
        _jsx("h3", { className: "font-display text-lg font-semibold sm:text-xl", children: active ? "Elevated Heat-Stress Risk Detected" : "No Elevated Heat-Stress Risk Detected" }),
        _jsx("p", { className: "mt-1 text-sm leading-relaxed text-muted-foreground", children: active ? "The Delhi model indicates elevated heat-stress conditions on the days listed below. Take appropriate precautions during periods of high heat." : "The current Delhi forecast does not indicate elevated heat-stress conditions." }),
        _jsx("p", { className: "mt-2 text-xs font-medium text-muted-foreground", children: "HeatGuard provides an ML-based heat-stress risk assessment, not an official government heatwave declaration." }),
        active && (_jsxs("p", { className: "mt-2 text-xs font-semibold uppercase tracking-wide text-risk-veryhigh", children: ["Affected days: ", riskDays.map((d) => formatDate(d.date)).join(" · ")] }))
      ] })
    ]
  }));
}
