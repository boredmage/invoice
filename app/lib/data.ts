export interface Currency {
  name: string;
  code: string;
  symbol: string;
  /* used in the generated PDF when `symbol` has no glyph in the embedded
     latin-subset Geist font (₦, ₹, ₩, ₪, ₾, ৳ …) */
  pdfSymbol?: string;
}

/* Full catalog of known currencies. The picker only offers the subset in
   ENABLED_CURRENCY_CODES below — add codes there to bring the rest back. */
const CURRENCY_CATALOG: Currency[] = [
  { name: "US Dollar", code: "USD", symbol: "$" },
  { name: "Euro", code: "EUR", symbol: "€" },
  { name: "British Pound", code: "GBP", symbol: "£" },
  { name: "Canadian Dollar", code: "CAD", symbol: "CA$" },
  { name: "UAE Dirham", code: "AED", symbol: "AED " },
  { name: "Argentine Peso", code: "ARS", symbol: "ARS " },
  { name: "Australian Dollar", code: "AUD", symbol: "A$" },
  {
    name: "Bangladeshi Taka",
    code: "BDT",
    symbol: "৳",
    pdfSymbol: "BDT ",
  },
  { name: "Bahraini Dinar", code: "BHD", symbol: "BHD " },
  { name: "Bermudian Dollar", code: "BMD", symbol: "BD$" },
  { name: "Brazilian Real", code: "BRL", symbol: "R$" },
  { name: "Swiss Franc", code: "CHF", symbol: "CHF " },
  { name: "Chilean Peso", code: "CLP", symbol: "CLP " },
  { name: "Chinese Yuan", code: "CNY", symbol: "¥" },
  { name: "Czech Koruna", code: "CZK", symbol: "Kč " },
  { name: "Danish Krone", code: "DKK", symbol: "kr " },
  {
    name: "Georgian Lari",
    code: "GEL",
    symbol: "₾",
    pdfSymbol: "GEL ",
  },
  { name: "Hong Kong Dollar", code: "HKD", symbol: "HK$" },
  { name: "Hungarian Forint", code: "HUF", symbol: "Ft " },
  { name: "Indonesian Rupiah", code: "IDR", symbol: "Rp " },
  {
    name: "Israeli New Shekel",
    code: "ILS",
    symbol: "₪",
    pdfSymbol: "ILS ",
  },
  {
    name: "Indian Rupee",
    code: "INR",
    symbol: "₹",
    pdfSymbol: "INR ",
  },
  { name: "Japanese Yen", code: "JPY", symbol: "¥" },
  {
    name: "South Korean Won",
    code: "KRW",
    symbol: "₩",
    pdfSymbol: "KRW ",
  },
  { name: "Kuwaiti Dinar", code: "KWD", symbol: "KWD " },
  { name: "Sri Lankan Rupee", code: "LKR", symbol: "Rs " },
  { name: "Myanmar Kyat", code: "MMK", symbol: "K " },
  { name: "Mexican Peso", code: "MXN", symbol: "MX$" },
  {
    name: "Nigerian Naira",
    code: "NGN",
    symbol: "₦",
    pdfSymbol: "NGN ",
  },
];

/* Currencies currently offered in the invoice form. Temporarily narrowed to
   these four — widen this set to re-enable the rest of CURRENCY_CATALOG. */
const ENABLED_CURRENCY_CODES = new Set(["NGN", "USD", "GBP", "EUR"]);

export const CURRENCIES: Currency[] = CURRENCY_CATALOG.filter((c) =>
  ENABLED_CURRENCY_CODES.has(c.code),
);

export interface Network {
  name: string;
  code: string;
  color: string;
  paymentLink?: boolean;
}

export const NETWORKS: Network[] = [
  { name: "Ethereum", code: "ETH", color: "#454A75", paymentLink: true },
  { name: "Tron", code: "TRX", color: "#EB0029" },
  { name: "BNB Smart Chain", code: "BSC", color: "#F0B90B" },
  { name: "Solana", code: "SOL", color: "#121212" },
  { name: "Arbitrum", code: "ARB", color: "#213147", paymentLink: true },
  { name: "Base", code: "BASE", color: "#0052FF", paymentLink: true },
  { name: "Avalanche", code: "AVAX", color: "#E84142" },
  { name: "Polygon", code: "MATIC", color: "#8247E5", paymentLink: true },
  { name: "Optimism", code: "OETH", color: "#FF0420", paymentLink: true },
  { name: "zkSync", code: "ZKS", color: "#1E69FF" },
  { name: "Cosmos", code: "ATOM", color: "#2E3148" },
  { name: "Stellar", code: "XLM", color: "#0F0F0F" },
  { name: "Axelar", code: "AXELAR", color: "#54ABF8" },
  { name: "Celestia", code: "CELESTIA", color: "#7B2BF9" },
  { name: "Celo", code: "Celo", color: "#FCFF52", paymentLink: true },
  { name: "Canton", code: "CANTON", color: "#C4372E" },
];

export interface Asset {
  name: string;
  code: string;
  color: string;
}

export const ASSETS: Asset[] = [
  { name: "Ethereum", code: "ETH", color: "#454A75" },
  { name: "BNB", code: "BNB", color: "#F0B90B" },
  { name: "USD Coin", code: "USDC", color: "#2775CA" },
  { name: "Lido Staked Ether", code: "STETH", color: "#00A3FF" },
  { name: "EURC", code: "EURC", color: "#2775CA" },
  { name: "PayPal USD", code: "PYUSD", color: "#0070E0" },
  { name: "Global Dollar", code: "USDG", color: "#1F1F1F" },
  { name: "Tether", code: "USDT", color: "#26A17B" },
  { name: "Toncoin", code: "TON", color: "#0098EA" },
  { name: "Polygon", code: "MATIC", color: "#8247E5" },
  { name: "Wrapped Fantom", code: "WFTM", color: "#1969FF" },
  { name: "The Graph", code: "GRT", color: "#6747ED" },
  { name: "ZetaChain", code: "ZETA", color: "#005741" },
  { name: "Wrapped Bitcoin", code: "WBTC", color: "#F09242" },
  { name: "Shiba Inu", code: "SHIB", color: "#FFA409" },
  { name: "Boba Network", code: "BOBA", color: "#CBFF00" },
  { name: "Chainlink", code: "LINK", color: "#2A5ADA" },
  { name: "Dai", code: "DAI", color: "#F5AC37" },
  { name: "LEO Token", code: "LEO", color: "#F7931A" },
  { name: "TrueUSD", code: "TUSD", color: "#1B5AFF" },
];

export function currencyByCode(code: string): Currency {
  return CURRENCY_CATALOG.find((c) => c.code === code) ?? CURRENCY_CATALOG[0];
}

export function assetByCode(code: string): Asset | undefined {
  return ASSETS.find((a) => a.code === code);
}

export function networkByCode(code: string): Network | undefined {
  return NETWORKS.find((n) => n.code === code);
}
