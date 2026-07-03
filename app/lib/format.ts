import type { CompanyInfo } from "./types";

/* 1,234.56 */
export function fmtNum(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* $1,234.56 — bind to the invoice currency symbol once */
export function makeMoneyFormatter(symbol: string) {
  return (n: number) => `${symbol}${fmtNum(n)}`;
}

/* street / "city, state zip" / country lines for a party block */
export function partyAddressLines(p: CompanyInfo): string[] {
  const lines: string[] = [];
  if (p.address) lines.push(p.address);
  const cityLine = [p.city, p.state].filter(Boolean).join(", ");
  if (cityLine || p.zip)
    lines.push([cityLine, p.zip].filter(Boolean).join(" "));
  if (p.country) lines.push(p.country);
  return lines;
}

/* split long unbroken strings (wallet addresses) into explicit lines so
   PDF rendering wraps without injecting hyphens */
export function chunkString(s: string, n = 26): string {
  return s.match(new RegExp(`.{1,${n}}`, "g"))?.join("\n") ?? s;
}
