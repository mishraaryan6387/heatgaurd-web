import { AlertTriangle, Droplets, HeartPulse, ShieldCheck, Snowflake, Sun, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "./MetricsGrid";
import { riskStyle } from "@/lib/risk";

const GUIDANCE = {
  low: {
    title: "Low heat-stress risk",
    intro: "Routine precautions are sufficient. Stay hydrated and monitor conditions if spending long periods outdoors.",
    items: [
      { icon: Droplets, title: "Stay Hydrated", description: "Drink water regularly, especially during prolonged outdoor activity." },
      { icon: Sun, title: "Use Basic Sun Protection", description: "Prefer shade, light clothing and a hat during extended outdoor exposure." },
      { icon: Snowflake, title: "Keep Cool", description: "Take breaks in a cool or shaded place if you begin to feel uncomfortable." },
      { icon: ShieldCheck, title: "Monitor Symptoms", description: "Watch for unusual thirst, dizziness, headache or fatigue and respond early." },
    ],
  },
  moderate: {
    title: "Moderate heat-stress risk",
    intro: "Increase hydration and reduce unnecessary prolonged exposure during the predicted heat-stress window.",
    items: [
      { icon: Droplets, title: "Increase Fluids", description: "Drink water more frequently and carry water when going outdoors." },
      { icon: Sun, title: "Reduce Prolonged Exposure", description: "Schedule strenuous outdoor work around the predicted heat-stress window when possible." },
      { icon: Snowflake, title: "Take Cooling Breaks", description: "Use shade or a cool indoor area for regular recovery breaks." },
      { icon: ShieldCheck, title: "Watch for Symptoms", description: "Stop activity if you develop dizziness, headache, weakness or nausea." },
    ],
  },
  high: {
    title: "High heat-stress risk",
    intro: "Avoid unnecessary prolonged outdoor exposure and take active precautions during the predicted heat-stress window.",
    items: [
      { icon: Droplets, title: "Hydrate Frequently", description: "Drink water at regular intervals and keep fluids readily available." },
      { icon: Sun, title: "Limit Outdoor Exposure", description: "Postpone strenuous outdoor activity where possible during the predicted heat-stress window." },
      { icon: Snowflake, title: "Use Cooling Areas", description: "Take frequent breaks in shade, air-conditioned spaces or other cool locations." },
      { icon: HeartPulse, title: "Protect Vulnerable People", description: "Check on older adults, children and others who may be more sensitive to heat." },
    ],
  },
  "very high": {
    title: "Very high heat-stress risk",
    intro: "Strong precautions are recommended. Minimize outdoor exposure during the predicted heat-stress window.",
    items: [
      { icon: Droplets, title: "Keep Hydrated", description: "Drink water frequently and carry fluids whenever outdoor travel is unavoidable." },
      { icon: Sun, title: "Avoid Strenuous Outdoor Activity", description: "Reschedule non-essential outdoor work or exercise outside the predicted heat-stress window." },
      { icon: Snowflake, title: "Stay in Cool Spaces", description: "Use air conditioning, fans, shade or cooling facilities and take frequent breaks." },
      { icon: HeartPulse, title: "Check Vulnerable People", description: "Regularly check elderly people, children and anyone at higher risk of heat illness." },
    ],
  },
  extreme: {
    title: "Extreme heat-stress risk",
    intro: "Urgent heat-risk precautions are recommended. Minimize outdoor exposure and avoid strenuous activity during the predicted window.",
    items: [
      { icon: AlertTriangle, title: "Minimize Outdoor Exposure", description: "Avoid non-essential outdoor activity during the predicted heat-stress window." },
      { icon: Droplets, title: "Maintain Hydration", description: "Keep water available and drink regularly; do not wait until you feel thirsty." },
      { icon: Snowflake, title: "Seek a Cool Environment", description: "Remain in air-conditioned or well-cooled spaces where possible." },
      { icon: HeartPulse, title: "Act on Heat-Illness Symptoms", description: "Stop activity and seek medical help if severe weakness, confusion or fainting occurs." },
    ],
  },
};

export function SafetySection({ day }) {
  const riskKey = String(day?.risk ?? "low").trim().toLowerCase();
  const guidance = GUIDANCE[riskKey] ?? GUIDANCE.low;
  const style = riskStyle(day?.risk);
  const isHeatwave = Boolean(day?.heatwave);
  const timing = day?.heatwave_timing?.label;
  const windowText = isHeatwave && timing && !timing.toLowerCase().startsWith("no elevated")
    ? `Predicted heat-stress window: ${timing}.`
    : "No elevated heat-stress window is predicted for this day.";

  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (title) => {
    setCheckedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <section id="safety" className="scroll-mt-24">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title={`Heat Safety Guidelines · ${isHeatwave ? style.label : "No Elevated Risk"}`}
          subtitle={isHeatwave ? guidance.intro : "Routine precautions are recommended because no elevated heat-stress condition is predicted."}
        />
        {guidance.items.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-2xs">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span>{completedCount} / {guidance.items.length} Completed</span>
          </span>
        )}
      </div>

      <div className={`mt-5 rounded-2xl border-2 p-4 sm:p-5 shadow-xs ${isHeatwave ? `${style.border} ${style.bg}` : "border-risk-low/40 bg-risk-low-soft"}`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className={`mt-0.5 size-5 shrink-0 ${isHeatwave ? style.text : "text-risk-low"}`} />
          <div>
            <p className={`text-sm font-semibold ${isHeatwave ? style.text : "text-risk-low"}`}>
              {isHeatwave ? guidance.title : "No elevated heat-stress condition"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{windowText}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {guidance.items.map(({ icon: Icon, title, description }) => {
          const isDone = Boolean(checkedItems[title]);
          return (
            <article
              key={title}
              onClick={() => toggleCheck(title)}
              className={`fade-rise surface-card lift-hover cursor-pointer p-5 transition-all select-none ${
                isDone ? "ring-2 ring-emerald-500/50 bg-emerald-50/20" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`flex size-11 items-center justify-center rounded-xl transition-colors ${isDone ? "bg-emerald-500/15 text-emerald-600" : "bg-secondary"}`}>
                  <Icon className={`size-5 ${isDone ? "text-emerald-600" : isHeatwave ? style.text : "text-risk-low"}`} />
                </span>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  {isDone ? <CheckCircle2 className="size-5 text-emerald-500" /> : <Circle className="size-5 opacity-40" />}
                </button>
              </div>

              <h3 className={`mt-4 font-display text-base font-semibold ${isDone ? "line-through opacity-75" : ""}`}>
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

