"use client";

export default function Header() {
  return (
    <header className="flex items-start gap-3">
      {/* logo mark — dark rounded square with a chain link */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect
            x="1.5"
            y="5.5"
            width="6"
            height="5"
            rx="2.5"
            stroke="white"
            strokeWidth="1.4"
          />
          <rect
            x="8.5"
            y="5.5"
            width="6"
            height="5"
            rx="2.5"
            stroke="white"
            strokeWidth="1.4"
          />
        </svg>
      </div>

      <div className="leading-tight">
        <h1 className="text-ink text-[15px] font-semibold">
          Crypto Invoice Generator
        </h1>
        <p className="text-ink-muted text-xs">
          Internal edition — data stays in your browser
        </p>
      </div>
    </header>
  );
}
