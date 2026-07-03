"use client";

import { useState, type ReactNode } from "react";

/* shared micro-label style for the invoice card */
export const MICRO =
  "text-[11px] font-semibold uppercase tracking-[0.02em] text-ink-muted";

/* ── clickable preview section ──
   Shows pulsing corner brackets when its step is active and a numbered
   chip at the top center on hover. Clicking jumps to the step. */
export function Section({
  step,
  label,
  active,
  onClick,
  className = "",
  children,
}: {
  step: number;
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative cursor-pointer text-left ${active ? "brackets" : ""} ${className}`}
    >
      {active && <span className="bracket-b" />}
      {children}
      {hover && (
        <span className="step-chip print-hidden absolute top-2 left-1/2 z-10 flex items-center gap-1.5 rounded-full bg-white py-1 pr-2.5 pl-1 shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
          <span className="bg-ink-soft flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-white">
            {step + 1}
          </span>
          <span className="text-ink text-xs font-medium whitespace-nowrap">
            {label}
          </span>
        </span>
      )}
    </div>
  );
}
