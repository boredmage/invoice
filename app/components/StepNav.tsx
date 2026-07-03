"use client";

/* Back / Next bar — in flow on mobile, pinned to the sidebar footer on desktop.
   Each button shows the neighboring step's name under the action label. */
export default function StepNav({
  prevLabel,
  nextLabel,
  onBack,
  onNext,
}: {
  prevLabel: string | null;
  nextLabel: string | null;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="-mx-6 mt-auto flex items-stretch justify-between bg-white px-3 pt-1 pb-5 lg:sticky lg:bottom-0 lg:-mx-12 lg:pb-3">
      {prevLabel ? (
        <button
          onClick={onBack}
          className="group flex cursor-pointer items-start gap-1 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#FAFAFA]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-ink-muted mt-0.5 shrink-0 transition-transform group-hover:-translate-x-0.5"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            <span className="text-ink block text-sm font-medium">Back</span>
            <span className="text-ink mt-0.5 block text-xs font-semibold">
              {prevLabel}
            </span>
          </span>
        </button>
      ) : (
        <div />
      )}

      {nextLabel !== null && (
        <button
          onClick={onNext}
          className="group flex cursor-pointer items-start justify-end gap-1 rounded-lg bg-[#FAFAFA] px-4 py-2.5 text-right transition-colors hover:bg-[#F0F0F0]"
        >
          <span>
            <span className="text-ink flex items-center justify-end gap-1 text-sm font-medium">
              Next
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-ink mt-0.5 block text-xs font-semibold">
              {nextLabel}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
