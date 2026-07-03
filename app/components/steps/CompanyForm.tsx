"use client";

import { useRef } from "react";
import type { CompanyInfo } from "../../lib/types";
import { FormRow, RowInput } from "../ui";

interface CompanyFormProps {
  title: string;
  data: CompanyInfo;
  onChange: (data: CompanyInfo) => void;
}

export default function CompanyForm({
  title,
  data,
  onChange,
}: CompanyFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof CompanyInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ ...data, logo: (ev.target?.result as string) ?? null });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h2>

      <div className="mt-4">
        <FormRow label="Email">
          <RowInput
            type="email"
            placeholder="e.g. info@acme.inc"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </FormRow>
        <p className="pb-4 pt-2 text-[13px] text-ink-muted">
          We&apos;ll fill the billing details automatically if we find the
          company.
        </p>
      </div>

      <p className="pb-1 pt-4 text-[15px] text-ink-soft">Billing details</p>

      <FormRow label="Company name">
        <RowInput
          type="text"
          placeholder="Acme Inc"
          value={data.companyName}
          onChange={(e) => update("companyName", e.target.value)}
        />
      </FormRow>

      <FormRow label="Logo">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
        {data.logo ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer"
            title="Change logo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.logo}
              alt="Logo"
              className="h-7 w-7 rounded-full object-cover"
            />
          </button>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-ink-muted hover:text-ink"
            aria-label="Upload logo"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 2.5V9.5M2.5 6H9.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </FormRow>

      <FormRow label="Address">
        <RowInput
          type="text"
          placeholder="Mission Street, 79"
          value={data.address}
          onChange={(e) => update("address", e.target.value)}
        />
      </FormRow>

      <FormRow label="City">
        <RowInput
          type="text"
          placeholder="San Francisco"
          value={data.city}
          onChange={(e) => update("city", e.target.value)}
        />
      </FormRow>

      <FormRow label="State">
        <RowInput
          type="text"
          placeholder="California"
          value={data.state}
          onChange={(e) => update("state", e.target.value)}
        />
      </FormRow>

      <FormRow label="Zip">
        <RowInput
          type="text"
          placeholder="94016"
          value={data.zip}
          onChange={(e) => update("zip", e.target.value)}
        />
      </FormRow>

      <FormRow label="Country">
        <RowInput
          type="text"
          placeholder="United States"
          value={data.country}
          onChange={(e) => update("country", e.target.value)}
        />
      </FormRow>

      <FormRow label="Tax ID">
        <RowInput
          type="text"
          placeholder="0123VS"
          value={data.taxId}
          onChange={(e) => update("taxId", e.target.value)}
        />
      </FormRow>
    </div>
  );
}
