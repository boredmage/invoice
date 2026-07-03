"use client";

import {
  type InvoiceDetails,
  calculateSubtotal,
  calculateTotal,
} from "../../lib/types";
import { fmtNum } from "../../lib/format";
import { Dots, DotLine } from "./DotMatrix";
import { MICRO } from "./Section";

const GRID = "grid grid-cols-[1fr_60px_90px_100px] gap-4";

/* items table + note + totals block */
export function ItemsSection({
  details,
  fmtMoney,
}: {
  details: InvoiceDetails;
  fmtMoney: (n: number) => string;
}) {
  const subtotal = calculateSubtotal(details.items);
  const total = calculateTotal(details.items, details.discount, details.tax);
  const hasItems = details.items.some((i) => i.name || i.price > 0);
  // placeholders only exist while the whole section is empty
  const itemsEmpty = !hasItems && !details.note;

  return (
    <div className="px-8 py-6">
      <div className={GRID}>
        <p className={MICRO}>Description</p>
        <p className={`${MICRO} text-right`}>Qty</p>
        <p className={`${MICRO} text-right`}>Price</p>
        <p className={`${MICRO} text-right`}>Amount</p>
      </div>

      {hasItems ? (
        details.items.map((item) => (
          <div
            key={item.id}
            className={`${GRID} border-b border-line py-3.5 text-[13px] text-ink`}
          >
            <p>{item.name || "—"}</p>
            <p className="text-right">{item.qty}</p>
            <p className="text-right">{fmtNum(item.price)}</p>
            <p className="text-right">{fmtNum(item.qty * item.price)}</p>
          </div>
        ))
      ) : itemsEmpty ? (
        <div className={`${GRID} border-b border-line py-3.5`}>
          <DotLine widths={[64, 40, 52]} />
          <span className="flex justify-end">
            <Dots w={28} />
          </span>
          <span className="flex justify-end">
            <Dots w={44} />
          </span>
          <span className="flex justify-end">
            <Dots w={56} />
          </span>
        </div>
      ) : (
        <div className="border-b border-line py-3.5" />
      )}

      {/* note + totals */}
      <div className="mt-4 grid grid-cols-2 gap-8">
        <div>
          {details.note && (
            <>
              <p className="text-[13px] text-ink-muted">Note</p>
              <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-snug text-ink-soft">
                {details.note}
              </p>
            </>
          )}
        </div>
        <div className="text-[13px]">
          <div className="flex items-center justify-between border-b border-line py-2.5">
            <span className="text-ink-muted">Subtotal</span>
            <span className="text-ink">{fmtMoney(subtotal)}</span>
          </div>
          {details.discount > 0 && (
            <div className="flex items-center justify-between border-b border-line py-2.5">
              <span className="text-ink-muted">Discount</span>
              <span className="text-ink">-{fmtMoney(details.discount)}</span>
            </div>
          )}
          {details.tax > 0 && (
            <div className="flex items-center justify-between border-b border-line py-2.5">
              <span className="text-ink-muted">Tax ({details.tax}%)</span>
              <span className="text-ink">
                {fmtMoney(
                  (Math.max(0, subtotal - details.discount) * details.tax) /
                    100
                )}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between py-3">
            <span className="text-ink-muted">Total</span>
            <span className="text-lg font-semibold text-ink">
              {fmtMoney(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
