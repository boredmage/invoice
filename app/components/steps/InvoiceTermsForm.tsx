"use client";

import { useRef } from "react";
import type { InvoiceTerms } from "../../lib/types";
import { FormRow, RowInput } from "../ui";

interface InvoiceTermsFormProps {
  data: InvoiceTerms;
  onChange: (data: InvoiceTerms) => void;
}

function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (formatted: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex items-center gap-1.5">
      <button
        onClick={openPicker}
        className="text-ink flex cursor-pointer items-center gap-1.5 text-sm"
      >
        {value}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-ink-muted"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="date"
        className="pointer-events-none absolute top-full right-0 h-0 w-0 opacity-0"
        onChange={(e) => {
          if (!e.target.value) return;
          const [y, m, d] = e.target.value.split("-").map(Number);
          const date = new Date(y, m - 1, d);
          onChange(
            date.toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
              year: "numeric",
            }),
          );
        }}
      />
    </div>
  );
}

export default function InvoiceTermsForm({
  data,
  onChange,
}: InvoiceTermsFormProps) {
  return (
    <div>
      <h2 className="text-ink text-2xl font-semibold tracking-[-0.01em]">
        Invoice terms
      </h2>

      <div className="mt-4">
        <FormRow label="Invoice number">
          <RowInput
            type="text"
            value={data.invoiceNumber}
            onChange={(e) =>
              onChange({ ...data, invoiceNumber: e.target.value })
            }
          />
        </FormRow>

        <FormRow label="Issue date">
          <DateField
            value={data.issueDate}
            onChange={(issueDate) => onChange({ ...data, issueDate })}
          />
        </FormRow>

        <FormRow label="Due date">
          <DateField
            value={data.dueDate}
            onChange={(dueDate) => onChange({ ...data, dueDate })}
          />
        </FormRow>
      </div>
    </div>
  );
}
