"use client";

import { useState, type ReactNode } from "react";
import {
  type InvoiceData,
  type StepId,
  calculateSubtotal,
  calculateTotal,
  formatDateShort,
} from "../lib/types";
import { assetByCode, currencyByCode, networkByCode } from "../lib/data";
import { TokenDot } from "./ui";

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  currentStep: StepId;
  onSectionClick: (step: StepId) => void;
}

/* ── fine-dot placeholder line ── */
function Dots({ w, h = 10 }: { w: number; h?: number }) {
  return (
    <span className="redacted inline-block" style={{ width: w, height: h }} />
  );
}

/* ── a run of placeholder "words" ── */
function DotLine({ widths, h = 10 }: { widths: number[]; h?: number }) {
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
      {widths.map((w, i) => (
        <Dots key={i} w={w} h={h} />
      ))}
    </span>
  );
}

/* ── clickable preview section: hover chip + active brackets ── */
function Section({
  step,
  label,
  active,
  onClick,
  className = "",
  children,
}: {
  step: number;
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative cursor-pointer text-left ${active ? "brackets" : ""} ${className}`}
    >
      {active && <span className="bracket-b" />}
      {children}
      {hover && !active && (
        <span className="print-hidden absolute bottom-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink-soft text-[10px] font-semibold text-white">
            {step + 1}
          </span>
          <span className="text-xs font-medium text-ink">{label}</span>
        </span>
      )}
    </div>
  );
}

const MICRO =
  "text-[11px] font-semibold uppercase tracking-[0.02em] text-ink-muted";

function PartyBlock({
  label,
  name,
  email,
  addressLines,
  taxId,
  logo,
}: {
  label: string;
  name: string;
  email: string;
  addressLines: string[];
  taxId: string;
  logo: string | null;
}) {
  const empty = !name && !email && addressLines.length === 0 && !taxId;
  return (
    <div className="px-8 py-7">
      <p className={MICRO}>{label}</p>

      {/* avatar */}
      <div className="mt-4">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt=""
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : name ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0F0F0] text-lg font-medium text-ink">
            {name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="redacted-circle block h-11 w-11" />
        )}
      </div>

      {/* name */}
      <div className="mt-4 min-h-[28px]">
        {name ? (
          <p className="text-xl font-semibold leading-tight tracking-[-0.01em] text-ink">
            {name}
          </p>
        ) : (
          <DotLine widths={[74, 60]} h={12} />
        )}
      </div>

      {/* email + address */}
      <div className="mt-2 space-y-[5px] text-[13px] leading-snug text-ink-soft">
        {empty ? (
          <>
            <span className="mt-1 block">
              <DotLine widths={[120, 46]} />
            </span>
            <span className="mt-2 block">
              <DotLine widths={[88]} />
            </span>
            <span className="block">
              <DotLine widths={[64]} />
            </span>
            <span className="block">
              <DotLine widths={[42]} />
            </span>
          </>
        ) : (
          <>
            {email && <p>{email}</p>}
            {addressLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            {taxId && <p>Tax ID: {taxId}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default function InvoicePreview({
  invoiceData,
  currentStep,
  onSectionClick,
}: InvoicePreviewProps) {
  const { sender, client, details, payment, terms } = invoiceData;

  const currency = currencyByCode(details.currency);
  const asset = payment.asset ? assetByCode(payment.asset) : undefined;
  const network = payment.network ? networkByCode(payment.network) : undefined;

  const subtotal = calculateSubtotal(details.items);
  const total = calculateTotal(details.items, details.discount, details.tax);

  const fmtMoney = (n: number) =>
    `${currency.symbol}${n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const fmtNum = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const partyAddress = (p: typeof sender) => {
    const lines: string[] = [];
    if (p.address) lines.push(p.address);
    const cityLine = [p.city, p.state].filter(Boolean).join(", ");
    if (cityLine || p.zip)
      lines.push([cityLine, p.zip].filter(Boolean).join(" "));
    if (p.country) lines.push(p.country);
    return lines;
  };

  const hasItems = details.items.some((i) => i.name || i.price > 0);

  return (
    <div
      id="invoice-card"
      className="flex w-[612px] shrink-0 flex-col rounded-lg bg-white shadow-[0_6px_30px_rgba(0,0,0,0.08)]"
      style={{ minHeight: 866 }}
    >
      {/* ── header: invoice no / dates (terms step) ── */}
      <Section
        step={4}
        label="Invoice terms"
        active={currentStep === 4}
        onClick={() => onSectionClick(4)}
        className="flex h-14 shrink-0 items-center justify-between border-b border-line px-8"
      >
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
      </Section>

      {/* ── from / to ── */}
      <div className="grid shrink-0 grid-cols-2 border-b border-line">
        <Section
          step={0}
          label="Your company"
          active={currentStep === 0}
          onClick={() => onSectionClick(0)}
          className="min-h-[254px] border-r border-line"
        >
          <PartyBlock
            label="From"
            name={sender.companyName}
            email={sender.email}
            addressLines={partyAddress(sender)}
            taxId={sender.taxId}
            logo={sender.logo}
          />
        </Section>
        <Section
          step={1}
          label="Your client"
          active={currentStep === 1}
          onClick={() => onSectionClick(1)}
          className="min-h-[254px]"
        >
          <PartyBlock
            label="To"
            name={client.companyName}
            email={client.email}
            addressLines={partyAddress(client)}
            taxId={client.taxId}
            logo={client.logo}
          />
        </Section>
      </div>

      {/* ── items table ── */}
      <Section
        step={2}
        label="Invoice details"
        active={currentStep === 2}
        onClick={() => onSectionClick(2)}
        className="flex-1"
      >
        <div className="px-8 py-6">
          <div className="grid grid-cols-[1fr_60px_90px_100px] gap-4">
            <p className={MICRO}>Description</p>
            <p className={`${MICRO} text-right`}>Qty</p>
            <p className={`${MICRO} text-right`}>Price</p>
            <p className={`${MICRO} text-right`}>Amount</p>
          </div>

          {hasItems ? (
            details.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_60px_90px_100px] gap-4 border-b border-line py-3.5 text-[13px] text-ink"
              >
                <p>{item.name || "—"}</p>
                <p className="text-right">{item.qty}</p>
                <p className="text-right">{fmtNum(item.price)}</p>
                <p className="text-right">{fmtNum(item.qty * item.price)}</p>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-[1fr_60px_90px_100px] gap-4 border-b border-line py-3.5">
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
                  <span className="text-ink">
                    -{fmtMoney(details.discount)}
                  </span>
                </div>
              )}
              {details.tax > 0 && (
                <div className="flex items-center justify-between border-b border-line py-2.5">
                  <span className="text-ink-muted">Tax ({details.tax}%)</span>
                  <span className="text-ink">
                    {fmtMoney(
                      (Math.max(0, subtotal - details.discount) *
                        details.tax) /
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
      </Section>

      {/* ── payment footer ── */}
      <Section
        step={3}
        label="Payment method"
        active={currentStep === 3}
        onClick={() => onSectionClick(3)}
        className="min-h-[156px] shrink-0 border-t border-line"
      >
        <div className="grid grid-cols-2 px-8 py-7">
          <div>
            <p className={MICRO}>Payable in</p>
            <div className="mt-3.5">
              {asset ? (
                <div className="flex items-center gap-2.5">
                  <TokenDot color={asset.color} label={asset.name} size={28} />
                  <div>
                    <p className="text-sm font-medium leading-tight text-ink">
                      {asset.name}
                    </p>
                    <p className="text-xs leading-tight text-ink-muted">
                      {asset.code}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <span className="redacted-circle block h-7 w-7" />
                  <span className="space-y-1.5">
                    <DotLine widths={[64]} />
                    <DotLine widths={[34]} h={8} />
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className={MICRO}>Instructions</p>
            <div className="mt-3.5 space-y-2 text-[13px]">
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-ink-muted">Network</span>
                {network ? (
                  <span className="text-right text-ink">{network.name}</span>
                ) : (
                  <Dots w={92} />
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-ink-muted">Wallet</span>
                {payment.walletAddress ? (
                  <span className="break-all text-right text-xs leading-snug text-ink">
                    {payment.walletAddress}
                  </span>
                ) : (
                  <Dots w={140} />
                )}
              </div>
              {payment.fiat && payment.bankName && (
                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-ink-muted">Bank</span>
                  <span className="text-right text-xs leading-snug text-ink">
                    {[
                      payment.bankName,
                      payment.accountNumber,
                      payment.routingNumber,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="px-8 pb-5 text-[11px] text-ink-muted">
          Prepared with the internal invoice tool
        </p>
      </Section>
    </div>
  );
}
