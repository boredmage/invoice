"use client";

import type { CompanyInfo } from "../../lib/types";
import { partyAddressLines } from "../../lib/format";
import { Dots, DotLine } from "./DotMatrix";
import { MICRO } from "./Section";

/* From / To block: avatar, name, email + address lines.
   Once any field has data, all placeholder matrices vanish. */
export function PartyBlock({
  label,
  party,
}: {
  label: string;
  party: CompanyInfo;
}) {
  const { companyName: name, email, taxId, logo } = party;
  const addressLines = partyAddressLines(party);
  const empty =
    !name && !email && addressLines.length === 0 && !taxId && !logo;

  return (
    <div className="px-8 py-7">
      <p className={MICRO}>{label}</p>

      {/* avatar — fixed 44px box so swapping canvas/image never shifts layout */}
      <div className="mt-4 h-11 w-11">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt=""
            className="block h-11 w-11 rounded-full object-cover"
          />
        ) : name ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0F0F0] text-lg font-medium text-ink">
            {name.charAt(0).toUpperCase()}
          </span>
        ) : empty ? (
          <Dots w={44} h={44} circle />
        ) : null}
      </div>

      {/* name */}
      <div className="mt-4 min-h-[28px]">
        {name ? (
          <p className="text-xl font-semibold leading-tight tracking-[-0.01em] text-ink">
            {name}
          </p>
        ) : empty ? (
          <DotLine widths={[74, 60]} h={12} />
        ) : null}
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
