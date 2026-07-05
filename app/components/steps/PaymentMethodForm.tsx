"use client";

import { useState } from "react";
import type { PaymentMethod } from "../../lib/types";
import { ASSETS, NETWORKS } from "../../lib/data";
import { AddTrigger, FormRow, RowInput, SearchDropdown, TokenDot } from "../ui";

interface PaymentMethodFormProps {
  data: PaymentMethod;
  onChange: (data: PaymentMethod) => void;
}

export default function PaymentMethodForm({
  data,
  onChange,
}: PaymentMethodFormProps) {
  const [manual, setManual] = useState(
    data.method === "manual" || !!data.walletAddress,
  );
  const [showNetwork, setShowNetwork] = useState(false);
  const [showAsset, setShowAsset] = useState(false);

  // treat a legacy draft with no `crypto` field as crypto-enabled
  const cryptoOn = data.crypto !== false;

  const selectedNetwork = NETWORKS.find((n) => n.code === data.network);
  const selectedAsset = ASSETS.find((a) => a.code === data.asset);

  return (
    <div>
      <h2 className="text-ink text-2xl font-semibold tracking-[-0.01em]">
        Payment method
      </h2>

      <p className="text-ink-soft mt-3 text-[15px]">
        Choose the rails you want to accept on this invoice.
      </p>

      {/* Crypto toggle — reveals wallet / asset details */}
      <div className="mt-6">
        <FormRow label="Crypto" last={!cryptoOn}>
          <button
            className={`toggle ${cryptoOn ? "on" : ""}`}
            onClick={() => onChange({ ...data, crypto: !cryptoOn })}
            aria-label="Toggle crypto payment details"
          />
        </FormRow>

        {cryptoOn && (
          <div className="step-transition">
            <div className="flex items-center justify-end pt-1">
              {!manual ? (
                <button
                  onClick={() => {
                    setManual(true);
                    onChange({ ...data, method: "manual" });
                  }}
                  className="text-ink flex cursor-pointer items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <rect
                      x="4.5"
                      y="1.5"
                      width="8"
                      height="8"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M9.5 12.5h-6a2 2 0 0 1-2-2v-6"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add manually
                </button>
              ) : (
                <button
                  onClick={() => {
                    setManual(false);
                    onChange({ ...data, method: "wallet" });
                  }}
                  className="text-ink flex cursor-pointer items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="1.5"
                      y="3.5"
                      width="13"
                      height="9.5"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M1.5 6.5H15"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <circle cx="12" cy="9.75" r="0.9" fill="currentColor" />
                  </svg>
                  Connect wallet
                </button>
              )}
            </div>

            {!manual && (
              <button
                onClick={() => {
                  setManual(true);
                  onChange({ ...data, method: "manual" });
                }}
                className="border-line text-accent mt-4 flex cursor-pointer items-center gap-2 border-b pb-4 text-sm font-medium transition-opacity hover:opacity-75"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="1.5"
                    y="3.5"
                    width="13"
                    height="9.5"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M1.5 6.5H15"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <circle cx="12" cy="9.75" r="0.9" fill="currentColor" />
                </svg>
                Connect wallet
              </button>
            )}

            {manual && (
              <div className="step-transition">
                <FormRow label="Wallet address">
                  <RowInput
                    type="text"
                    placeholder="0x0000000"
                    value={data.walletAddress}
                    onChange={(e) =>
                      onChange({ ...data, walletAddress: e.target.value })
                    }
                  />
                </FormRow>

                <div className="relative">
                  <FormRow label="Network">
                    <AddTrigger
                      value={selectedNetwork?.name ?? null}
                      open={showNetwork}
                      onClick={() => setShowNetwork((v) => !v)}
                    />
                  </FormRow>
                  <SearchDropdown
                    open={showNetwork}
                    onClose={() => setShowNetwork(false)}
                    searchPlaceholder="Search your network..."
                    checkStyle="checkbox"
                    items={NETWORKS.map((n) => ({
                      key: n.code,
                      name: n.name,
                      code: n.code,
                      icon: <TokenDot color={n.color} label={n.name} />,
                      badge: n.paymentLink
                        ? "Payment link supported"
                        : undefined,
                      selected: n.code === data.network,
                    }))}
                    onSelect={(code) => {
                      onChange({
                        ...data,
                        network: code === data.network ? "" : code,
                      });
                      setShowNetwork(false);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Asset */}
            <div className="relative">
              <FormRow label="Asset">
                <AddTrigger
                  value={selectedAsset ? selectedAsset.name : null}
                  open={showAsset}
                  onClick={() => setShowAsset((v) => !v)}
                />
              </FormRow>
              <SearchDropdown
                open={showAsset}
                onClose={() => setShowAsset(false)}
                searchPlaceholder="Search your asset..."
                checkStyle="checkbox"
                items={ASSETS.map((a) => ({
                  key: a.code,
                  name: a.name,
                  code: a.code,
                  icon: <TokenDot color={a.color} label={a.name} />,
                  selected: a.code === data.asset,
                }))}
                onSelect={(code) => {
                  onChange({ ...data, asset: code === data.asset ? "" : code });
                  setShowAsset(false);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fiat toggle — reveals simple bank details for the invoice footer */}
      <div className="mt-10">
        <FormRow label="Fiat" last={!data.fiat}>
          <button
            className={`toggle ${data.fiat ? "on" : ""}`}
            onClick={() => onChange({ ...data, fiat: !data.fiat })}
            aria-label="Toggle fiat payment details"
          />
        </FormRow>

        {data.fiat && (
          <div className="step-transition">
            <FormRow label="Bank name">
              <RowInput
                type="text"
                placeholder="e.g. Chase"
                value={data.bankName}
                onChange={(e) =>
                  onChange({ ...data, bankName: e.target.value })
                }
              />
            </FormRow>
            <FormRow label="Account number">
              <RowInput
                type="text"
                placeholder="000123456789"
                value={data.accountNumber}
                onChange={(e) =>
                  onChange({ ...data, accountNumber: e.target.value })
                }
              />
            </FormRow>
            <FormRow label="Routing / IBAN" last>
              <RowInput
                type="text"
                placeholder="021000021"
                value={data.routingNumber}
                onChange={(e) =>
                  onChange({ ...data, routingNumber: e.target.value })
                }
              />
            </FormRow>
          </div>
        )}
      </div>
    </div>
  );
}
