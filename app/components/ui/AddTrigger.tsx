"use client";

/* ── "+ Add" pill / selected-value trigger for dropdown rows ── */
export function AddTrigger({
  value,
  open,
  onClick,
}: {
  value: string | null;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-1.5"
    >
      {value ? (
        <span className="text-ink text-sm font-medium">{value}</span>
      ) : (
        <span className="bg-accent/5 text-accent flex h-6 items-center gap-1 rounded-full pr-2.5 pl-1.5 text-sm font-medium">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 2.5V9.5M2.5 6H9.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          Add
        </span>
      )}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={`text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
      >
        <path
          d="M3 4.5L6 7.5L9 4.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
