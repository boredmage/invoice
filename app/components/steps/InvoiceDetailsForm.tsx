"use client";

import { useState } from "react";
import type { InvoiceDetails, LineItem } from "../../lib/types";
import { CURRENCIES, currencyByCode } from "../../lib/data";
import { FormRow } from "../ui";
import { SearchDropdown } from "../ui";

interface InvoiceDetailsFormProps {
  data: InvoiceDetails;
  onChange: (data: InvoiceDetails) => void;
}

export default function InvoiceDetailsForm({
  data,
  onChange,
}: InvoiceDetailsFormProps) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  const currency = currencyByCode(data.currency);

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    onChange({
      ...data,
      items: data.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        { id: crypto.randomUUID(), name: "", qty: 1, price: 0 },
      ],
    });
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) {
      onChange({
        ...data,
        items: [{ id: crypto.randomUUID(), name: "", qty: 1, price: 0 }],
      });
      return;
    }
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-[-0.01em] text-ink">
        Invoice details
      </h2>
      <p className="mt-3 text-[15px] text-ink-soft">
        Select an invoice currency
      </p>

      {/* Currency selector */}
      <div className="relative mt-2">
        <FormRow label="Currency">
          <button
            onClick={() => setShowCurrency((v) => !v)}
            className="flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-[#FAFAFA]"
          >
            <span className="text-base leading-none">{currency.flag}</span>
            <span className="text-sm font-medium text-ink">
              {currency.code}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`text-ink-muted transition-transform ${showCurrency ? "rotate-180" : ""}`}
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
        </FormRow>

        <SearchDropdown
          open={showCurrency}
          onClose={() => setShowCurrency(false)}
          searchPlaceholder="Select a currency..."
          groupLabel="Fiat"
          checkStyle="check"
          items={CURRENCIES.map((c) => ({
            key: c.code,
            name: c.name,
            code: c.code,
            icon: <span className="text-base leading-none">{c.flag}</span>,
            selected: c.code === data.currency,
          }))}
          onSelect={(code) => {
            const c = currencyByCode(code);
            onChange({ ...data, currency: c.code, currencySymbol: c.symbol });
            setShowCurrency(false);
          }}
        />
      </div>

      {/* Items */}
      <div className="mt-8">
        <div className="flex items-center border-b border-line pb-2">
          <span className="text-[15px] text-ink-soft">Items</span>
          <span className="ml-auto w-12 text-right text-sm text-ink-muted">
            Qty
          </span>
          <span className="w-20 text-right text-sm text-ink-muted">Price</span>
        </div>

        {data.items.map((item) => (
          <div
            key={item.id}
            className="group relative flex items-center gap-3 border-b border-line py-[15px]"
          >
            <button
              onClick={() => removeItem(item.id)}
              className="absolute -left-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-ink-muted opacity-0 transition-opacity hover:bg-[#F5F5F5] hover:text-ink group-hover:opacity-100"
              aria-label="Remove item"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 3L9 9M9 3L3 9"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Item name"
              value={item.name}
              onChange={(e) => updateItem(item.id, "name", e.target.value)}
              className="min-w-0 flex-1 border-none bg-transparent text-sm text-ink outline-none"
            />
            <input
              type="number"
              placeholder="Qty"
              min={0}
              value={item.qty || ""}
              onChange={(e) =>
                updateItem(item.id, "qty", Number(e.target.value) || 0)
              }
              className="w-12 border-none bg-transparent text-right text-sm text-ink outline-none"
            />
            <input
              type="number"
              placeholder="Price"
              min={0}
              step="0.01"
              value={item.price || ""}
              onChange={(e) =>
                updateItem(item.id, "price", Number(e.target.value) || 0)
              }
              className="w-20 border-none bg-transparent text-right text-sm text-ink outline-none"
            />
          </div>
        ))}

        <button
          onClick={addItem}
          className="flex w-full cursor-pointer items-center gap-1.5 border-b border-line py-[15px] text-sm font-medium text-accent transition-opacity hover:opacity-75"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 2.5V9.5M2.5 6H9.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          Add item
        </button>
      </div>

      {/* Note */}
      <div className="mt-8">
        <p className="border-b border-line pb-2 text-[15px] text-ink-soft">
          Note
        </p>
        <textarea
          placeholder="Add a note"
          value={data.note}
          onChange={(e) => onChange({ ...data, note: e.target.value })}
          rows={2}
          className="mt-3 w-full resize-none border-none bg-transparent pb-3 text-left text-sm text-ink outline-none"
        />
      </div>

      {/* More options */}
      <div className="mt-4">
        <button
          onClick={() => setShowMoreOptions((v) => !v)}
          className="-mx-3 flex w-[calc(100%+24px)] cursor-pointer items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-[#FAFAFA]"
        >
          <span className="text-[15px] text-ink">More options</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`text-ink-muted transition-transform ${showMoreOptions ? "rotate-180" : ""}`}
          >
            <path
              d="M3.5 5.25L7 8.75L10.5 5.25"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {showMoreOptions && (
          <div className="step-transition">
            <FormRow label="Discount">
              <input
                type="number"
                placeholder="0.00"
                min={0}
                step="0.01"
                value={data.discount || ""}
                onChange={(e) =>
                  onChange({ ...data, discount: Number(e.target.value) || 0 })
                }
                className="w-full border-none bg-transparent text-right text-sm text-ink outline-none"
              />
            </FormRow>
            <FormRow label="Taxes" last>
              <input
                type="number"
                placeholder="0"
                min={0}
                step="0.1"
                value={data.tax || ""}
                onChange={(e) =>
                  onChange({ ...data, tax: Number(e.target.value) || 0 })
                }
                className="w-10 border-none bg-transparent text-right text-sm text-ink outline-none"
              />
              <span className="ml-1 text-sm text-ink-muted">%</span>
            </FormRow>
          </div>
        )}
      </div>
    </div>
  );
}
