export interface CompanyInfo {
  email: string;
  companyName: string;
  logo: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  taxId: string;
}

export interface LineItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface InvoiceDetails {
  currency: string;
  currencySymbol: string;
  items: LineItem[];
  note: string;
  discount: number;
  tax: number;
}

export interface PaymentMethod {
  method: "wallet" | "manual" | null;
  network: string;
  walletAddress: string;
  asset: string;
  fiat: boolean;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
}

export interface InvoiceTerms {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
}

export interface InvoiceData {
  sender: CompanyInfo;
  client: CompanyInfo;
  details: InvoiceDetails;
  payment: PaymentMethod;
  terms: InvoiceTerms;
}

export const STEPS = [
  { id: 0, label: "Your company" },
  { id: 1, label: "Your client" },
  { id: 2, label: "Invoice details" },
  { id: 3, label: "Payment method" },
  { id: 4, label: "Invoice terms" },
  { id: 5, label: "Review & download" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export function getDefaultInvoiceData(): InvoiceData {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14);

  return {
    sender: {
      email: "",
      companyName: "",
      logo: null,
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      taxId: "",
    },
    client: {
      email: "",
      companyName: "",
      logo: null,
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      taxId: "",
    },
    details: {
      currency: "USD",
      currencySymbol: "$",
      items: [{ id: crypto.randomUUID(), name: "", qty: 1, price: 0 }],
      note: "",
      discount: 0,
      tax: 0,
    },
    payment: {
      method: null,
      network: "",
      walletAddress: "",
      asset: "",
      fiat: false,
      bankName: "",
      accountNumber: "",
      routingNumber: "",
    },
    terms: {
      invoiceNumber: "000001",
      issueDate: formatDate(today),
      dueDate: formatDate(dueDate),
    },
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const y = String(date.getFullYear()).slice(-2);
    return `${m}/${d.toString().padStart(2, "0")}/${y}`;
  } catch {
    return dateStr;
  }
}

export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

export function calculateTotal(
  items: LineItem[],
  discount: number,
  tax: number,
): number {
  const subtotal = calculateSubtotal(items);
  const discounted = subtotal - discount;
  const taxed = discounted + (discounted * tax) / 100;
  return Math.max(0, taxed);
}

export function formatCurrency(amount: number, symbol: string = "$"): string {
  return `${symbol}${amount.toFixed(2)}`;
}
