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
      <span className="bg-accent flex h-4 w-4 items-center justify-center rounded-full">
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

interface SearchDropdownProps {
  open: boolean;
  onClose: () => void;
  items: DropdownItem[];
  onSelect: (key: string) => void;
  searchPlaceholder: string;
  groupLabel?: string;
  checkStyle?: "check" | "checkbox";
}

/* thin gate — the panel mounts fresh on every open, so its search query
   always starts empty without effect-driven state resets */
export function SearchDropdown(props: SearchDropdownProps) {
  if (!props.open) return null;
  return <DropdownPanel {...props} />;
}

function DropdownPanel({
  onClose,
  items,
  onSelect,
  searchPlaceholder,
  groupLabel,
  checkStyle = "check",
}: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [onClose]);

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.code.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 left-0 z-20 overflow-hidden rounded-b-lg bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
    >
      <div className="border-line flex items-center gap-2 border-b px-4 py-3">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-ink-muted shrink-0"
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
          <p className="text-ink-muted px-4 pt-2 pb-1 text-xs">{groupLabel}</p>
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
            <span className="text-ink text-sm font-medium">{item.name}</span>
            <span className="text-ink-muted text-sm">{item.code}</span>
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
          <p className="text-ink-muted px-4 py-3 text-sm">No results</p>
        )}
      </div>
    </div>
  );
}
