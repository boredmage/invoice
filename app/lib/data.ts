export interface Currency {
  name: string;
  code: string;
  symbol: string;
  flag: string;
  /* used in the generated PDF when `symbol` has no glyph in the embedded
     latin-subset Geist font (₦, ₹, ₩, ₪, ₾, ৳ …) */
  pdfSymbol?: string;
}

export const CURRENCIES: Currency[] = [
  { name: "US Dollar", code: "USD", symbol: "$", flag: "🇺🇸" },
  { name: "Euro", code: "EUR", symbol: "€", flag: "🇪🇺" },
  { name: "British Pound", code: "GBP", symbol: "£", flag: "🇬🇧" },
  { name: "Canadian Dollar", code: "CAD", symbol: "CA$", flag: "🇨🇦" },
  { name: "UAE Dirham", code: "AED", symbol: "AED ", flag: "🇦🇪" },
  { name: "Argentine Peso", code: "ARS", symbol: "ARS ", flag: "🇦🇷" },
  { name: "Australian Dollar", code: "AUD", symbol: "A$", flag: "🇦🇺" },
  {
    name: "Bangladeshi Taka",
    code: "BDT",
    symbol: "৳",
    pdfSymbol: "BDT ",
    flag: "🇧🇩",
  },
  { name: "Bahraini Dinar", code: "BHD", symbol: "BHD ", flag: "🇧🇭" },
  { name: "Bermudian Dollar", code: "BMD", symbol: "BD$", flag: "🇧🇲" },
  { name: "Brazilian Real", code: "BRL", symbol: "R$", flag: "🇧🇷" },
  { name: "Swiss Franc", code: "CHF", symbol: "CHF ", flag: "🇨🇭" },
  { name: "Chilean Peso", code: "CLP", symbol: "CLP ", flag: "🇨🇱" },
  { name: "Chinese Yuan", code: "CNY", symbol: "¥", flag: "🇨🇳" },
  { name: "Czech Koruna", code: "CZK", symbol: "Kč ", flag: "🇨🇿" },
  { name: "Danish Krone", code: "DKK", symbol: "kr ", flag: "🇩🇰" },
  {
    name: "Georgian Lari",
    code: "GEL",
    symbol: "₾",
    pdfSymbol: "GEL ",
    flag: "🇬🇪",
  },
  { name: "Hong Kong Dollar", code: "HKD", symbol: "HK$", flag: "🇭🇰" },
  { name: "Hungarian Forint", code: "HUF", symbol: "Ft ", flag: "🇭🇺" },
  { name: "Indonesian Rupiah", code: "IDR", symbol: "Rp ", flag: "🇮🇩" },
  {
    name: "Israeli New Shekel",
    code: "ILS",
    symbol: "₪",
    pdfSymbol: "ILS ",
    flag: "🇮🇱",
  },
  {
    name: "Indian Rupee",
    code: "INR",
    symbol: "₹",
    pdfSymbol: "INR ",
    flag: "🇮🇳",
  },
  { name: "Japanese Yen", code: "JPY", symbol: "¥", flag: "🇯🇵" },
  {
    name: "South Korean Won",
    code: "KRW",
    symbol: "₩",
    pdfSymbol: "KRW ",
    flag: "🇰🇷",
  },
  { name: "Kuwaiti Dinar", code: "KWD", symbol: "KWD ", flag: "🇰🇼" },
  { name: "Sri Lankan Rupee", code: "LKR", symbol: "Rs ", flag: "🇱🇰" },
  { name: "Myanmar Kyat", code: "MMK", symbol: "K ", flag: "🇲🇲" },
  { name: "Mexican Peso", code: "MXN", symbol: "MX$", flag: "🇲🇽" },
  {
    name: "Nigerian Naira",
    code: "NGN",
    symbol: "₦",
    pdfSymbol: "NGN ",
    flag: "🇳🇬",
  },
];

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
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function assetByCode(code: string): Asset | undefined {
  return ASSETS.find((a) => a.code === code);
}

export function networkByCode(code: string): Network | undefined {
  return NETWORKS.find((n) => n.code === code);
}
