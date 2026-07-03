"use client";

import type { PaymentMethod } from "../../lib/types";
import { type Currency, assetByCode, networkByCode } from "../../lib/data";
import { TokenDot } from "../ui";
import { Dots, DotLine } from "./DotMatrix";
import { MICRO } from "./Section";

function InstructionRow({
  label,
  value,
  placeholderWidth,
  show,
  mono = false,
}: {
  label: string;
  value: string;
  placeholderWidth: number;
  show: boolean;
  mono?: boolean;
}) {
  if (!show) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-ink-muted shrink-0">{label}</span>
      {value ? (
        <span
          className={
            mono
              ? "text-ink text-right text-xs leading-snug break-all"
              : "text-ink text-right"
          }
        >
          {value}
        </span>
      ) : (
        <Dots w={placeholderWidth} />
      )}
    </div>
  );
}

/* payment footer: crypto "payable in / instructions" block, plus a second
   block for fiat bank details when the fiat toggle is on */
export function PaymentSection({
  payment,
  currency,
}: {
  payment: PaymentMethod;
  currency: Currency;
}) {
  const asset = payment.asset ? assetByCode(payment.asset) : undefined;
  const network = payment.network ? networkByCode(payment.network) : undefined;

  // placeholders only exist while the whole section is empty
  const paymentEmpty = !(
    asset ||
    network ||
    payment.walletAddress ||
    (payment.fiat &&
      (payment.bankName || payment.accountNumber || payment.routingNumber))
  );

  return (
    <>
      <div className="grid grid-cols-2 px-8 py-7">
        <div>
          <p className={MICRO}>Payable in</p>
          <div className="mt-3.5">
            {asset ? (
              <div className="flex items-center gap-2.5">
                <TokenDot color={asset.color} label={asset.name} size={28} />
                <div>
                  <p className="text-ink text-sm leading-tight font-medium">
                    {asset.name}
                  </p>
                  <p className="text-ink-muted text-xs leading-tight">
                    {asset.code}
                  </p>
                </div>
              </div>
            ) : paymentEmpty ? (
              <div className="flex items-center gap-2.5">
                <Dots w={28} h={28} circle />
                <span className="space-y-1.5">
                  <DotLine widths={[64]} />
                  <DotLine widths={[34]} h={8} />
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <p className={MICRO}>Instructions</p>
          <div className="mt-3.5 space-y-2 text-[13px]">
            <InstructionRow
              label="Network"
              value={network?.name ?? ""}
              placeholderWidth={92}
              show={!!network || paymentEmpty}
            />
            <InstructionRow
              label="Wallet"
              value={payment.walletAddress}
              placeholderWidth={140}
              show={!!payment.walletAddress || paymentEmpty}
              mono
            />
          </div>
        </div>
      </div>

      {/* fiat gets its own block under the crypto part */}
      {payment.fiat && (
        <div className="border-line grid grid-cols-2 border-t px-8 py-7">
          <div>
            <p className={MICRO}>Payable in</p>
            <div className="mt-3.5 flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-sm leading-none">
                {currency.flag}
              </span>
              <div>
                <p className="text-ink text-sm leading-tight font-medium">
                  {currency.name}
                </p>
                <p className="text-ink-muted text-xs leading-tight">
                  {currency.code}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className={MICRO}>Instructions</p>
            <div className="mt-3.5 space-y-2 text-[13px]">
              <InstructionRow
                label="Bank"
                value={payment.bankName}
                placeholderWidth={92}
                show={!!payment.bankName || paymentEmpty}
              />
              <InstructionRow
                label="Account"
                value={payment.accountNumber}
                placeholderWidth={120}
                show={!!payment.accountNumber || paymentEmpty}
                mono
              />
              <InstructionRow
                label="Routing / IBAN"
                value={payment.routingNumber}
                placeholderWidth={100}
                show={!!payment.routingNumber || paymentEmpty}
                mono
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
