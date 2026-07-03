"use client";

import { type InvoiceData, type StepId, STEPS } from "../lib/types";
import CompanyForm from "./steps/CompanyForm";
import InvoiceDetailsForm from "./steps/InvoiceDetailsForm";
import PaymentMethodForm from "./steps/PaymentMethodForm";
import InvoiceTermsForm from "./steps/InvoiceTermsForm";
import ReviewStep from "./steps/ReviewStep";

interface FormPanelProps {
  currentStep: StepId;
  invoiceData: InvoiceData;
  updateInvoiceData: (updater: (prev: InvoiceData) => InvoiceData) => void;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

export default function FormPanel({
  currentStep,
  invoiceData,
  updateInvoiceData,
  onNext,
  onBack,
  onReset,
}: FormPanelProps) {
  const prevStep = currentStep > 0 ? STEPS[currentStep - 1].label : null;
  const nextStep =
    currentStep < STEPS.length - 1 ? STEPS[currentStep + 1].label : null;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CompanyForm
            title="Your company"
            data={invoiceData.sender}
            onChange={(sender) =>
              updateInvoiceData((prev) => ({ ...prev, sender }))
            }
          />
        );
      case 1:
        return (
          <CompanyForm
            title="Your client"
            data={invoiceData.client}
            onChange={(client) =>
              updateInvoiceData((prev) => ({ ...prev, client }))
            }
          />
        );
      case 2:
        return (
          <InvoiceDetailsForm
            data={invoiceData.details}
            onChange={(details) =>
              updateInvoiceData((prev) => ({ ...prev, details }))
            }
          />
        );
      case 3:
        return (
          <PaymentMethodForm
            data={invoiceData.payment}
            onChange={(payment) =>
              updateInvoiceData((prev) => ({ ...prev, payment }))
            }
          />
        );
      case 4:
        return (
          <InvoiceTermsForm
            data={invoiceData.terms}
            onChange={(terms) =>
              updateInvoiceData((prev) => ({ ...prev, terms }))
            }
          />
        );
      case 5:
        return (
          <ReviewStep
            invoiceData={invoiceData}
            onReset={onReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div key={currentStep} className="step-transition flex-1 pb-6 pt-10">
        {renderStep()}
      </div>

      {/* bottom navigation — in flow on mobile, pinned to the sidebar footer on desktop */}
      <div className="-mx-6 mt-auto flex items-stretch justify-between bg-white px-3 pb-5 pt-1 lg:sticky lg:bottom-0 lg:-mx-12 lg:pb-3">
        {currentStep > 0 ? (
          <button
            onClick={onBack}
            className="group flex cursor-pointer items-start gap-1 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#FAFAFA]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="mt-0.5 shrink-0 text-ink-muted transition-transform group-hover:-translate-x-0.5"
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
              <span className="block text-sm font-medium text-ink">Back</span>
              <span className="mt-0.5 block text-xs font-semibold text-ink">
                {prevStep}
              </span>
            </span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 && (
          <button
            onClick={onNext}
            className="group flex cursor-pointer items-start justify-end gap-1 rounded-lg bg-[#FAFAFA] px-4 py-2.5 text-right transition-colors hover:bg-[#F0F0F0]"
          >
            <span>
              <span className="flex items-center justify-end gap-1 text-sm font-medium text-ink">
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
              <span className="mt-0.5 block text-xs font-semibold text-ink">
                {nextStep}
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
