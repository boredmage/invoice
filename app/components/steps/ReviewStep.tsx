"use client";

import { useState } from "react";
import type { InvoiceData } from "../../lib/types";

interface ReviewStepProps {
  invoiceData: InvoiceData;
  onReset: () => void;
}

export default function ReviewStep({ invoiceData, onReset }: ReviewStepProps) {
  const [downloading, setDownloading] = useState(false);
  const clientName = invoiceData.client.companyName.trim();
  const clientEmail = invoiceData.client.email.trim();

  const handleSend = () => {
    const subject = encodeURIComponent(
      `Invoice ${invoiceData.terms.invoiceNumber} from ${
        invoiceData.sender.companyName || "us"
      }`,
    );
    const body = encodeURIComponent(
      `Hi,\n\nPlease find invoice ${invoiceData.terms.invoiceNumber} attached.\n\nIssue date: ${invoiceData.terms.issueDate}\nDue date: ${invoiceData.terms.dueDate}\n\nThank you!`,
    );
    window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      // both are client-only; load them on demand so the wizard stays light
      const [{ pdf }, { default: InvoicePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("../InvoicePdf"),
      ]);
      const blob = await pdf(<InvoicePdf invoiceData={invoiceData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceData.terms.invoiceNumber || "000001"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex h-full min-h-[560px] flex-col pt-6 lg:min-h-0 lg:pt-16">
      <h2 className="text-ink text-center text-[32px] leading-[1.1] font-semibold tracking-[-0.02em] lg:text-left lg:text-[44px]">
        Your invoice
        <br className="hidden lg:block" /> is ready
      </h2>
      <p className="text-ink-soft mt-4 text-center text-lg lg:mt-5 lg:text-left">
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
          Send to {clientName || "client"}
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="text-ink flex cursor-pointer items-center gap-2 text-[15px] font-medium transition-opacity hover:opacity-70 disabled:cursor-wait disabled:opacity-50"
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
          {downloading ? "Preparing PDF..." : "Download"}
        </button>
      </div>

      <button
        onClick={onReset}
        className="text-ink mx-auto mt-auto flex cursor-pointer items-center gap-2 pt-16 pb-2 text-[15px] font-medium transition-opacity hover:opacity-70"
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
