"use client";

import type { InvoiceData, StepId } from "../lib/types";
import { currencyByCode } from "../lib/data";
import { makeMoneyFormatter } from "../lib/format";
import { Section } from "./preview/Section";
import { TermsStrip } from "./preview/TermsStrip";
import { PartyBlock } from "./preview/PartyBlock";
import { ItemsSection } from "./preview/ItemsSection";
import { PaymentSection } from "./preview/PaymentSection";

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  currentStep: StepId;
  onSectionClick: (step: StepId) => void;
}

/* the live invoice card: five clickable sections, one per wizard step */
export default function InvoicePreview({
  invoiceData,
  currentStep,
  onSectionClick,
}: InvoicePreviewProps) {
  const { sender, client, details, payment, terms } = invoiceData;
  const currency = currencyByCode(details.currency);
  const fmtMoney = makeMoneyFormatter(currency.symbol);

  return (
    <div
      id="invoice-card"
      className="flex w-[612px] shrink-0 flex-col rounded-lg bg-white shadow-[0_6px_30px_rgba(0,0,0,0.08)]"
      style={{ minHeight: 866 }}
    >
      <Section
        step={4}
        label="Invoice terms"
        active={currentStep === 4}
        onClick={() => onSectionClick(4)}
        className="flex h-14 shrink-0 items-center justify-between border-b border-line px-8"
      >
        <TermsStrip terms={terms} />
      </Section>

      <div className="grid shrink-0 grid-cols-2 border-b border-line">
        <Section
          step={0}
          label="Your company"
          active={currentStep === 0}
          onClick={() => onSectionClick(0)}
          className="min-h-[254px] border-r border-line"
        >
          <PartyBlock label="From" party={sender} />
        </Section>
        <Section
          step={1}
          label="Your client"
          active={currentStep === 1}
          onClick={() => onSectionClick(1)}
          className="min-h-[254px]"
        >
          <PartyBlock label="To" party={client} />
        </Section>
      </div>

      <Section
        step={2}
        label="Invoice details"
        active={currentStep === 2}
        onClick={() => onSectionClick(2)}
        className="flex-1"
      >
        <ItemsSection details={details} fmtMoney={fmtMoney} />
      </Section>

      <Section
        step={3}
        label="Payment method"
        active={currentStep === 3}
        onClick={() => onSectionClick(3)}
        className="min-h-[156px] shrink-0 border-t border-line"
      >
        <PaymentSection payment={payment} currency={currency} />
        <p className="px-8 pb-5 text-[11px] text-ink-muted">
          Prepared with the internal invoice tool
        </p>
      </Section>
    </div>
  );
}
