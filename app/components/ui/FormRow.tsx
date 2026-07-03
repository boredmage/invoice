"use client";

import type { ReactNode } from "react";

/* ── standard sidebar form row: label left, control right ── */
export function FormRow({
  label,
  children,
  last = false,
}: {
  label: ReactNode;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[54px] items-center justify-between gap-4 py-[17px] ${
        last ? "" : "border-line border-b"
      }`}
    >
      <label className="text-ink shrink-0 text-[15px]">{label}</label>
      <div className="flex min-w-0 flex-1 items-center justify-end">
        {children}
      </div>
    </div>
  );
}

export function RowInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`text-ink w-full border-none bg-transparent text-right text-sm outline-none ${props.className ?? ""}`}
    />
  );
}
