"use client";

export default function Header() {
  return (
    <header className="flex items-start gap-3">
      {/* logo mark */}
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8"
        />
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
