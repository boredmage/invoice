"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type InvoiceData,
  type StepId,
  STEPS,
  getDefaultInvoiceData,
} from "../lib/types";
import Header from "./Header";
import FormPanel from "./FormPanel";
import InvoicePreview from "./InvoicePreview";

const STORAGE_KEY = "crypto-invoice-draft";

export default function InvoiceGenerator() {
  const [currentStep, setCurrentStep] = useState<StepId>(0);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(
    getDefaultInvoiceData
  );
  const [showBanner, setShowBanner] = useState(true);
  const hydrated = useRef(false);
  const asideRef = useRef<HTMLElement>(null);

  // Mobile: the sheet rests low enough that scrolling up reveals the whole
  // preview; start pre-scrolled so the first view is the usual card peek.
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches && asideRef.current) {
      window.scrollTo(0, Math.max(0, asideRef.current.offsetTop - 416));
    }
  }, []);

  // restore a saved draft (internal tool — everything stays in the browser)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data) {
          setInvoiceData({ ...getDefaultInvoiceData(), ...parsed.data });
        }
      }
    } catch {
      /* corrupt draft — start fresh */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: invoiceData }));
    } catch {
      /* storage full/unavailable — drafts just won't persist */
    }
  }, [invoiceData]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) =>
      prev < STEPS.length - 1 ? ((prev + 1) as StepId) : prev
    );
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => (prev > 0 ? ((prev - 1) as StepId) : prev));
  }, []);

  const handleReset = useCallback(() => {
    setInvoiceData(getDefaultInvoiceData());
    setCurrentStep(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const updateInvoiceData = useCallback(
    (updater: (prev: InvoiceData) => InvoiceData) => {
      setInvoiceData(updater);
    },
    []
  );

  return (
    <div className="flex min-h-screen w-full flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* ── Sidebar: bottom sheet on mobile (scrolls over the fixed preview,
             sized by its content), left pane on desktop ── */}
      <aside
        ref={asideRef}
        className="print-hidden relative z-10 order-2 mt-[532px] flex min-h-[calc(100dvh-416px)] w-full flex-col rounded-t-2xl bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:order-1 lg:mt-0 lg:min-h-0 lg:h-full lg:w-[500px] lg:shrink-0 lg:overflow-hidden lg:rounded-none lg:border-r lg:border-line lg:shadow-none"
      >
        <div className="flex min-h-0 flex-1 flex-col px-6 pt-8 lg:overflow-y-auto lg:px-12 lg:pt-12">
          <div className="hidden lg:block">
            <Header />
          </div>

          {showBanner && currentStep < 5 && (
            <div className="flex items-center gap-2 rounded-lg bg-[#FAFAFA] py-2.5 pl-4 pr-3 text-[13px] lg:mt-5">
              <span className="font-semibold text-accent">NEW</span>
              <span className="text-[#DDDDDD]">|</span>
              <span className="text-ink-soft">
                Invoice tracking, automated emails and more
              </span>
              <button
                onClick={() => setShowBanner(false)}
                className="ml-auto shrink-0 cursor-pointer text-ink-muted transition-colors hover:text-ink"
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
          )}

          <FormPanel
            currentStep={currentStep}
            invoiceData={invoiceData}
            updateInvoiceData={updateInvoiceData}
            onNext={handleNext}
            onBack={handleBack}
            onReset={handleReset}
          />
        </div>
      </aside>

      {/* ── Canvas: fixed backdrop on mobile (the sheet slides over it),
             right pane on desktop ── */}
      <main className="dot-canvas fixed inset-x-0 top-0 z-0 order-1 lg:static lg:order-2 lg:h-full lg:min-w-0 lg:flex-1 lg:overflow-y-auto">
        <div className="px-6 pt-6 lg:hidden">
          <Header />
        </div>
        <div className="flex h-[460px] justify-center overflow-hidden pt-6 lg:h-auto lg:overflow-visible lg:px-10 lg:py-10 lg:pt-10">
          <div className="preview-scale w-[612px] shrink-0 origin-top scale-50 md:scale-75 lg:scale-100">
            <InvoicePreview
              invoiceData={invoiceData}
              currentStep={currentStep}
              onSectionClick={(step) => setCurrentStep(step)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
