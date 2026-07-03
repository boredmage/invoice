"use client";

/* dismissible "NEW" announcement bar at the top of the sidebar */
export default function Banner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#FAFAFA] py-2.5 pr-3 pl-4 text-[13px] lg:mt-5">
      <span className="text-accent font-semibold">NEW</span>
      <span className="text-[#DDDDDD]">|</span>
      <span className="text-ink-soft">
        Invoice tracking, automated emails and more
      </span>
      <button
        onClick={onDismiss}
        className="text-ink-muted hover:text-ink ml-auto shrink-0 cursor-pointer transition-colors"
        aria-label="Dismiss banner"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
