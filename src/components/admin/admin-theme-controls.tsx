"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Printer, X } from "lucide-react";

type Theme = {
  id: "teal" | "teal-large" | "midnight" | "ember" | "mono" | "cyberpunk" | "rose";
  name: string;
  description: string;
  swatches: readonly [string, string, string];
};

const themes: readonly Theme[] = [
  { id: "teal", name: "Hermes Teal", description: "Classic dark teal / the canonical Hermes look", swatches: ["#041c1c", "#ffe6cb", "#ffbd38"] },
  { id: "teal-large", name: "Hermes Teal (Large)", description: "Hermes Teal with bigger fonts and roomier spacing", swatches: ["#041c1c", "#ffe6cb", "#ffbd38"] },
  { id: "midnight", name: "Midnight", description: "Deep blue-violet with cool accents", swatches: ["#0a0a1f", "#d4c8ff", "#a78bfa"] },
  { id: "ember", name: "Ember", description: "Warm crimson and bronze / forge vibes", swatches: ["#1a0a06", "#ffd8b0", "#f97316"] },
  { id: "mono", name: "Mono", description: "Clean grayscale / minimal and focused", swatches: ["#0e0e0e", "#eaeaea", "#bcbcbc"] },
  { id: "cyberpunk", name: "Cyberpunk", description: "Neon green on black / matrix terminal", swatches: ["#040608", "#9bffcf", "#00ff88"] },
  { id: "rose", name: "Rosé", description: "Soft pink and warm ivory / easy on the eyes", swatches: ["#1a0f15", "#ffd4e1", "#f9a8d4"] },
];

const storageKey = "vet68-admin-theme";

function applyTheme(theme: Theme["id"]) {
  document.querySelector<HTMLElement>(".admin-signal")?.setAttribute("data-admin-theme", theme);
}

export function AdminThemeControls() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Theme["id"]>("teal");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const theme = themes.some((item) => item.id === saved) ? saved as Theme["id"] : "teal";
    applyTheme(theme);
    const timer = window.setTimeout(() => setSelected(theme), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const activeTheme = themes.find((theme) => theme.id === selected) ?? themes[0];
  const portalRoot = typeof document === "undefined" ? null : document.querySelector<HTMLElement>(".admin-signal");
  const selectTheme = (theme: Theme["id"]) => {
    setSelected(theme);
    applyTheme(theme);
    window.localStorage.setItem(storageKey, theme);
    setOpen(false);
  };

  return (
    <div className="admin-theme-controls">
      <button type="button" className="admin-theme-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-controls="admin-theme-dialog">
        <span className="admin-theme-trigger-label">Theme</span>
        <span className="admin-theme-trigger-name">{activeTheme.name}</span>
      </button>
      <button type="button" className="admin-print-trigger" onClick={() => window.print()}>
        <Printer aria-hidden="true" /> <span>Print / PDF</span>
      </button>

      {open && portalRoot ? createPortal(
        <div className="admin-theme-overlay" role="presentation" onMouseDown={() => setOpen(false)}>
          <section id="admin-theme-dialog" className="admin-theme-panel" role="dialog" aria-modal="true" aria-labelledby="admin-theme-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="admin-theme-panel-head">
              <h2 id="admin-theme-title">Theme</h2>
              <button ref={closeButtonRef} type="button" className="admin-theme-close" onClick={() => setOpen(false)} aria-label="Đóng chọn theme"><X aria-hidden="true" /></button>
            </header>
            <div className="admin-theme-list">
              {themes.map((theme) => {
                const isActive = theme.id === selected;
                return (
                  <button key={theme.id} type="button" className="admin-theme-option" data-active={isActive || undefined} onClick={() => selectTheme(theme.id)}>
                    <span className="admin-theme-swatch" aria-hidden="true">{theme.swatches.map((swatch) => <i key={swatch} style={{ backgroundColor: swatch }} />)}</span>
                    <span className="admin-theme-copy"><strong>{theme.name}</strong><span>{theme.description}</span></span>
                    <Check className="admin-theme-check" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>
        </div>,
        portalRoot,
      ) : null}
    </div>
  );
}
