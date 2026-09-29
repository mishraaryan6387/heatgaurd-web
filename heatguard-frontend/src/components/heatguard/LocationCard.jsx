import { Globe2, MapPin, Printer, Bell, Share2, Download, Check } from "lucide-react";
import { useState } from "react";

export function LocationCard({ stateName }) {
  const [copied, setCopied] = useState(false);
  const [notifGranted, setNotifGranted] = useState(
    typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted"
  );

  const handlePrint = () => {
    window.print();
  };

  const handleRequestNotification = async () => {
    if (!("Notification" in window)) {
      alert("Browser notifications are not supported on this device.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifGranted(true);
      new Notification("HeatGuard Alerts Enabled", {
        body: "You will receive alerts when Delhi heat-stress risk reaches Extreme levels.",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "HeatGuard Heat-Stress Forecast",
        text: `Check out the AI-powered heatwave & WBGT risk prediction for ${stateName || "Delhi"}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="fade-rise surface-card overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
        <div className="p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <MapPin className="size-3.5 text-primary" /> Analyzed State
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold">{stateName || "Selected State"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            HeatGuard's current ML model analyses sampled locations in Delhi. Detailed forecasts below reflect the high-resolution AI heat-stress predictions.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-secondary"
            >
              <Printer className="size-3.5 text-primary" /> Print / Export PDF Report
            </button>
            <button
              type="button"
              onClick={handleRequestNotification}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                notifGranted
                  ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-border bg-card text-foreground shadow-sm hover:bg-secondary"
              }`}
            >
              <Bell className="size-3.5 text-amber-500" />
              {notifGranted ? "Alerts Enabled" : "Enable Alerts"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-secondary"
            >
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Share2 className="size-3.5 text-accent" />}
              {copied ? "Link Copied!" : "Share Analysis"}
            </button>
          </div>
        </div>

        <div className="relative min-h-56 deep-panel p-6 sm:p-8">
          <div className="absolute inset-0 opacity-25">
            <div className="size-full" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.25) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.25) 1px, transparent 1px)", backgroundSize: "8.333% 11.11%" }} />
          </div>
          <div className="relative flex h-full min-h-44 items-center justify-center">
            <div className="text-center">
              <Globe2 className="mx-auto size-10 opacity-80" />
              <p className="mt-3 text-base font-semibold">Delhi Heat-Stress Intelligence</p>
              <p className="mt-1 max-w-xs text-xs opacity-85">
                AI prediction algorithms combine temperature, humidity & solar radiation data to calculate WBGT risk scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

