"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type StepId, STEPS } from "../lib/types";
import { useInvoiceDraft } from "../lib/useInvoiceDraft";
import Header from "./Header";
import FormPanel from "./FormPanel";
import InvoicePreview from "./InvoicePreview";

export default function InvoiceGenerator() {
  const { invoiceData, updateInvoiceData, resetDraft } = useInvoiceDraft();
  const [currentStep, setCurrentStep] = useState<StepId>(0);
  const asideRef = useRef<HTMLElement>(null);

  // Mobile: the sheet rests low enough that scrolling up reveals the whole
  // preview; start pre-scrolled so the first view is the usual card peek.
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches && asideRef.current) {
      window.scrollTo(0, Math.max(0, asideRef.current.offsetTop - 416));
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) =>
      prev < STEPS.length - 1 ? ((prev + 1) as StepId) : prev,
    );
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => (prev > 0 ? ((prev - 1) as StepId) : prev));
  }, []);

  const handleReset = useCallback(() => {
    resetDraft();
    setCurrentStep(0);
  }, [resetDraft]);

  return (
    <div className="flex min-h-screen w-full flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* ── Sidebar: bottom sheet on mobile (scrolls over the fixed preview,
             sized by its content), left pane on desktop ── */}
      <aside
        ref={asideRef}
        className="print-hidden lg:border-line relative z-10 order-2 mt-[532px] flex min-h-[calc(100dvh-416px)] w-full flex-col rounded-t-2xl bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:order-1 lg:mt-0 lg:h-full lg:min-h-0 lg:w-[500px] lg:shrink-0 lg:overflow-hidden lg:rounded-none lg:border-r lg:shadow-none"
      >
        <div className="flex min-h-0 flex-1 flex-col px-6 pt-8 lg:overflow-y-auto lg:px-12 lg:pt-12">
          <div className="hidden lg:block">
            <Header />
          </div>

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
