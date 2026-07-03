"use client";

import { type InvoiceTerms, formatDateShort } from "../../lib/types";
import { MICRO } from "./Section";

/* top strip: invoice number, issue date, due date */
export function TermsStrip({ terms }: { terms: InvoiceTerms }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <p className={MICRO}>Invoice no</p>
        <p className="text-[13px] leading-tight text-ink">
          {terms.invoiceNumber || "000001"}
        </p>
      </div>
      <div className="flex gap-9">
        <div>
          <p className={MICRO}>Issued</p>
          <p className="text-[13px] leading-tight text-ink">
            {formatDateShort(terms.issueDate)}
          </p>
        </div>
        <div>
          <p className={MICRO}>Due date</p>
          <p className="text-[13px] leading-tight text-ink">
            {formatDateShort(terms.dueDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
