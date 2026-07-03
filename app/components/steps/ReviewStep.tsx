"use client";

import type { InvoiceData } from "../../lib/types";

interface ReviewStepProps {
  invoiceData: InvoiceData;
  onReset: () => void;
}

export default function ReviewStep({ invoiceData, onReset }: ReviewStepProps) {
  const clientName = invoiceData.client.companyName.trim();
  const clientEmail = invoiceData.client.email.trim();

  const handleSend = () => {
    const subject = encodeURIComponent(
      `Invoice ${invoiceData.terms.invoiceNumber} from ${
        invoiceData.sender.companyName || "us"
      }`
    );
    const body = encodeURIComponent(
      `Hi,\n\nPlease find invoice ${invoiceData.terms.invoiceNumber} attached.\n\nIssue date: ${invoiceData.terms.issueDate}\nDue date: ${invoiceData.terms.dueDate}\n\nThank you!`
    );
    window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="flex h-full flex-col pt-16">
      <h2 className="text-[44px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
        Your invoice
        <br />
        is ready
      </h2>
      <p className="mt-5 text-lg text-ink-soft">
        Take a final look before downloading it.
      </p>

      <div className="mt-12 flex flex-col items-center gap-5">
        <button
          onClick={handleSend}
          disabled={!clientEmail}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1c1c1c] py-3.5 text-[15px] font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          title={clientEmail ? undefined : "Add a client email first"}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M14.5 1.5L7.5 8.5M14.5 1.5L10 14.5L7.5 8.5M14.5 1.5L1.5 6L7.5 8.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
          Send to {clientName || "your client"}
        </button>

        <button
          onClick={handleDownload}
          className="flex cursor-pointer items-center gap-2 text-[15px] font-medium text-ink transition-opacity hover:opacity-70"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2V10.5M8 10.5L4.5 7M8 10.5L11.5 7"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 11.5V13a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 14 13v-1.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Download
        </button>
      </div>

      <button
        onClick={onReset}
        className="mx-auto mt-auto flex cursor-pointer items-center gap-2 pb-2 pt-16 text-[15px] font-medium text-ink transition-opacity hover:opacity-70"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.5 8a5.5 5.5 0 1 1-1.61-3.89M13.5 1.5v3h-3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Create new
      </button>
    </div>
  );
}
