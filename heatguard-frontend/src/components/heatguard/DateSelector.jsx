import { Calendar, ChevronLeft, ChevronRight, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { formatDate, riskStyle } from "@/lib/risk";

export function DateSelector({ forecast, selectedIndex, onSelect }) {
  if (!forecast || forecast.length === 0) return null;

  const currentDay = forecast[selectedIndex] ?? forecast[0];
  const currentRisk = riskStyle(currentDay.heatwave ? currentDay.risk : "Low");

  const handlePrev = () => {
    if (selectedIndex > 0) onSelect(selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex < forecast.length - 1) onSelect(selectedIndex + 1);
  };

  const getDayRelativeLabel = (idx) => {
    if (idx === 0) return "Today";
    if (idx === 1) return "Tomorrow";
    return `Day ${idx + 1}`;
  };

  return (
    <div className="fade-rise rounded-2xl border border-white/65 bg-white/80 dark:bg-card/80 p-4 sm:p-5 shadow-lg shadow-black/5 backdrop-blur-xl">
      {/* Top Controller Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 dark:border-white/10 pb-4">
        {/* Left: Active Date Info */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs">
            <Calendar className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {formatDate(currentDay.date, { weekday: "long", day: "numeric", month: "long" })}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-2xs ${currentRisk.border} ${currentRisk.bg} ${currentRisk.text}`}>
                {currentDay.heatwave ? <Flame className="size-3" /> : <ShieldCheck className="size-3" />}
                {currentRisk.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Inspecting {getDayRelativeLabel(selectedIndex)}'s heat-stress simulation & human impact layer
            </p>
          </div>
        </div>

        {/* Right: Stepper Navigation Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className="flex size-9 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-foreground shadow-2xs transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 backdrop-blur-md"
            title="Previous Day"
            aria-label="Previous day"
          >
            <ChevronLeft className="size-4" />
          </button>

          {selectedIndex !== 0 && (
            <button
              type="button"
              onClick={() => onSelect(0)}
              className="inline-flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15 backdrop-blur-md"
            >
              <Sparkles className="size-3" />
              <span>Back to Today</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={selectedIndex === forecast.length - 1}
            className="flex size-9 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-foreground shadow-2xs transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 backdrop-blur-md"
            title="Next Day"
            aria-label="Next day"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* 7-Day Interactive Horizontal Strip */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
        {forecast.map((day, idx) => {
          const isSelected = idx === selectedIndex;
          const style = day.heatwave ? riskStyle(day.risk) : riskStyle("Low");

          return (
            <button
              key={`${day.date}-${idx}`}
              type="button"
              onClick={() => onSelect(idx)}
              className={`group relative flex flex-col items-center justify-between rounded-xl border p-2.5 text-center transition-all backdrop-blur-md ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30 scale-[1.02]"
                  : "border-white/60 bg-white/60 hover:bg-white/95 hover:border-primary/40 text-foreground shadow-2xs"
              }`}
            >
              {/* Day / Relative Label */}
              <div className="text-center">
                <span className={`block text-[11px] font-semibold uppercase tracking-wider ${isSelected ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                  {formatDate(day.date, { weekday: "short" })}
                </span>
                <span className="font-display text-base font-bold">
                  {formatDate(day.date, { day: "numeric" })}
                </span>
              </div>

              {/* Mini Temperature & Risk Indicator */}
              <div className="mt-2 flex w-full items-center justify-between border-t border-current/15 pt-1.5 text-[11px]">
                <span className="font-medium">
                  {day.temperature.max.toFixed(0)}°
                </span>
                <span
                  className={`size-2 rounded-full ${
                    isSelected ? "bg-white" : style.dot
                  }`}
                  title={`Risk: ${style.label}`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
