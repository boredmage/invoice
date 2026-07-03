"use client";

/* ── colored circle standing in for a token/network icon ── */
export function TokenDot({
  color,
  label,
  size = 20,
}: {
  color: string;
  label: string;
  size?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.45,
      }}
    >
      {label.charAt(0).toUpperCase()}
    </span>
  );
}
