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
    <div className="flex h-screen w-full overflow-hidden">
      {/* ── Left: sidebar ── */}
      <aside className="print-hidden relative flex h-full w-[500px] shrink-0 flex-col overflow-hidden border-r border-line bg-white">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-12 pt-12">
          <Header />

          {showBanner && currentStep < 5 && (
            <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#FAFAFA] py-2.5 pl-4 pr-3 text-[13px]">
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

      {/* ── Right: dotted canvas with live preview ── */}
      <main className="dot-canvas relative h-full min-w-0 flex-1 overflow-y-auto">
        <div className="flex justify-center px-10 py-10">
          <InvoicePreview
            invoiceData={invoiceData}
            currentStep={currentStep}
            onSectionClick={(step) => setCurrentStep(step)}
          />
        </div>
      </main>
    </div>
  );
}
