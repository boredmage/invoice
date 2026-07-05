"use client";

import { type InvoiceData, type StepId, STEPS } from "../lib/types";
import StepNav from "./StepNav";
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
  const prevLabel = currentStep > 0 ? STEPS[currentStep - 1].label : null;
  const nextLabel =
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
            currencyCode={invoiceData.details.currency}
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
        return <ReviewStep invoiceData={invoiceData} onReset={onReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div key={currentStep} className="step-transition flex-1 pt-10 pb-6">
        {renderStep()}
      </div>

      <StepNav
        prevLabel={prevLabel}
        nextLabel={currentStep < 5 ? nextLabel : null}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}
