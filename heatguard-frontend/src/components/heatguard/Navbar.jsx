import { Flame, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const LINKS = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "Human Impact", href: "#human-impact" },
    { label: "Risk Analysis", href: "#risk-analysis" },
    { label: "Risk Forecast", href: "#forecast" },
    { label: "Safety", href: "#safety" },
];

export function Navbar({ status }) {
    const [open, setOpen] = useState(false);
    const [activeId, setActiveId] = useState("dashboard");

    const statusLabel =
        status === "online"
            ? "System Online"
            : status === "offline"
                ? "System Offline"
                : "Checking system…";

    const statusColor =
        status === "online"
            ? "bg-risk-low"
            : status === "offline"
                ? "bg-destructive"
                : "bg-risk-moderate";

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 140;

            for (let i = LINKS.length - 1; i >= 0; i--) {
                const el = document.querySelector(LINKS[i].href);
                if (el) {
                    const top = el.offsetTop;
                    if (scrollPosition >= top) {
                        setActiveId(LINKS[i].href.replace("#", ""));
                        return;
                    }
                }
            }
            setActiveId("dashboard");
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        setOpen(false);
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            setActiveId(href.replace("#", ""));
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                <a
                    href="#dashboard"
                    onClick={(e) => handleNavClick(e, "#dashboard")}
                    className="flex items-center gap-3"
                >
                    <span className="flex size-10 items-center justify-center rounded-xl deep-panel shadow-sm">
                        <Flame className="size-5" />
                    </span>
                    <span className="leading-tight">
                        <span className="block font-display text-lg font-semibold tracking-tight">
                            HeatGuard
                        </span>
                        <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            Heat-Stress Intelligence
                        </span>
                    </span>
                </a>

                <nav className="hidden items-center gap-1 md:flex">
                    {LINKS.map((l) => {
                        const isActive = activeId === l.href.replace("#", "");
                        return (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={(e) => handleNavClick(e, l.href)}
                                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${isActive
                                        ? "bg-primary/15 text-primary font-semibold shadow-xs"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                {l.label}
                            </a>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                        <span
                            className={`size-2 rounded-full ${statusColor} ${status === "checking" ? "pulse-dot" : ""
                                }`}
                        />
                        <span className="hidden sm:inline">{statusLabel}</span>
                    </span>
                    <button
                        type="button"
                        aria-label="Toggle navigation"
                        onClick={() => setOpen((v) => !v)}
                        className="flex size-10 items-center justify-center rounded-lg border border-border bg-card md:hidden"
                    >
                        {open ? <X className="size-4" /> : <Menu className="size-4" />}
                    </button>
                </div>
            </div>

            {open && (
                <nav className="border-t border-border bg-card px-4 py-2 md:hidden">
                    {LINKS.map((l) => {
                        const isActive = activeId === l.href.replace("#", "");
                        return (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={(e) => handleNavClick(e, l.href)}
                                className={`block rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary/15 text-primary font-semibold"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                {l.label}
                            </a>
                        );
                    })}
                </nav>
            )}
        </header>
    );
}

