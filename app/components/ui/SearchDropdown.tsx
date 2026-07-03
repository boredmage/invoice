"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* ── searchable dropdown panel, anchored under a form row ── */
export interface DropdownItem {
  key: string;
  name: string;
  code: string;
  icon?: ReactNode;
  badge?: string;
  selected?: boolean;
}

function SelectionMark({
  style,
  selected,
}: {
  style: "check" | "checkbox";
  selected?: boolean;
}) {
  if (style === "check") {
    if (!selected) return null;
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent">
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5.2L4.2 7.4L8 3"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span
      className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
        selected ? "border-accent bg-accent" : "border-[#DDDDDD] bg-white"
      }`}
    >
      {selected && (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5.2L4.2 7.4L8 3"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

export function SearchDropdown({
  open,
  onClose,
  items,
  onSelect,
  searchPlaceholder,
  groupLabel,
  checkStyle = "check",
}: {
  open: boolean;
  onClose: () => void;
  items: DropdownItem[];
  onSelect: (key: string) => void;
  searchPlaceholder: string;
  groupLabel?: string;
  checkStyle?: "check" | "checkbox";
}) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 top-full z-20 overflow-hidden rounded-b-lg bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="shrink-0 text-ink-muted"
        >
          <circle
            cx="6"
            cy="6"
            r="4.25"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M9.5 9.5L12 12"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full border-none bg-transparent text-left text-sm outline-none"
        />
      </div>

      <div className="max-h-[264px] overflow-y-auto py-1">
        {groupLabel && !query && (
          <p className="px-4 pb-1 pt-2 text-xs text-ink-muted">{groupLabel}</p>
        )}
        {filtered.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`flex w-full cursor-pointer items-center gap-2.5 px-4 py-[10px] text-left transition-colors hover:bg-[#FAFAFA] ${
              item.selected ? "bg-[#FAFAFA]" : ""
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium text-ink">{item.name}</span>
            <span className="text-sm text-ink-muted">{item.code}</span>
            <span className="ml-auto flex items-center gap-2">
              {item.badge && (
                <span className="rounded-full bg-[#E8F7EE] px-2.5 py-0.5 text-[11px] text-[#1D8348]">
                  {item.badge}
                </span>
              )}
              <SelectionMark style={checkStyle} selected={item.selected} />
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-3 text-sm text-ink-muted">No results</p>
        )}
      </div>
    </div>
  );
}
