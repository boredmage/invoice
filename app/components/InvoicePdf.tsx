import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  type InvoiceData,
  calculateSubtotal,
  calculateTotal,
  formatDateShort,
} from "../lib/types";
import { assetByCode, currencyByCode, networkByCode } from "../lib/data";

Font.register({
  family: "Geist",
  fonts: [
    { src: "/fonts/geist-400.woff", fontWeight: 400 },
    { src: "/fonts/geist-500.woff", fontWeight: 500 },
    { src: "/fonts/geist-600.woff", fontWeight: 600 },
  ],
});
// never hyphenate — long strings (wallet addresses) are pre-chunked with
// explicit newlines so no misleading "-" gets injected mid-address
Font.registerHyphenationCallback((word) => [word]);

const chunk = (s: string, n = 26) => s.match(new RegExp(`.{1,${n}}`, "g"))?.join("\n") ?? s;

const INK = "#000000";
const SOFT = "#494949";
const MUTED = "#999999";
const LINE = "#ECECEC";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Geist",
    fontSize: 13,
    color: INK,
    display: "flex",
    flexDirection: "column",
  },
  micro: {
    fontSize: 8.5,
    fontWeight: 600,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingHorizontal: 32,
  },
  headerValue: { fontSize: 11, marginTop: 3 },
  parties: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  party: {
    minHeight: 220,
    paddingHorizontal: 32,
    paddingVertical: 28,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  avatarText: { fontSize: 16, fontWeight: 500 },
  partyName: { fontSize: 17, fontWeight: 600, marginTop: 14 },
  partyLine: { fontSize: 11, color: SOFT, marginTop: 4 },
  items: { flexGrow: 1, paddingHorizontal: 32, paddingVertical: 24 },
  tableRow: { flexDirection: "row", alignItems: "flex-start" },
  colDesc: { flexGrow: 1, flexShrink: 1 },
  colQty: { width: 60, textAlign: "right" },
  colPrice: { width: 90, textAlign: "right" },
  colAmount: { width: 100, textAlign: "right" },
  itemRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingVertical: 12,
    fontSize: 11,
  },
  bottomGrid: { flexDirection: "row", marginTop: 16 },
  noteCol: { width: "50%", paddingRight: 24 },
  totalsCol: { width: "50%" },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingVertical: 9,
    fontSize: 11,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: LINE,
    minHeight: 140,
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 18,
  },
  footerCols: { flexDirection: "row" },
  footerCol: { width: "50%" },
  tokenDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  instRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});

export default function InvoicePdf({
  invoiceData,
}: {
  invoiceData: InvoiceData;
}) {
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

  const items = details.items.filter((i) => i.name || i.price > 0);

  const renderParty = (
    label: string,
    p: typeof sender
  ) => (
    <View style={styles.party}>
      <Text style={styles.micro}>{label}</Text>
      {p.logo ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          src={p.logo}
          style={{ ...styles.avatar, backgroundColor: undefined }}
        />
      ) : p.companyName ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {p.companyName.charAt(0).toUpperCase()}
          </Text>
        </View>
      ) : null}
      {p.companyName ? (
        <Text style={styles.partyName}>{p.companyName}</Text>
      ) : null}
      <View style={{ marginTop: 6 }}>
        {p.email ? <Text style={styles.partyLine}>{p.email}</Text> : null}
        {partyAddress(p).map((line, i) => (
          <Text key={i} style={styles.partyLine}>
            {line}
          </Text>
        ))}
        {p.taxId ? (
          <Text style={styles.partyLine}>Tax ID: {p.taxId}</Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <Document
      title={`Invoice ${terms.invoiceNumber || "000001"}`}
      author={sender.companyName || undefined}
    >
      <Page size={[612, 866]} style={styles.page}>
        {/* header: invoice no / dates */}
        <View style={styles.header}>
          <View>
            <Text style={styles.micro}>Invoice no</Text>
            <Text style={styles.headerValue}>
              {terms.invoiceNumber || "000001"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 36 }}>
            <View>
              <Text style={styles.micro}>Issued</Text>
              <Text style={styles.headerValue}>
                {formatDateShort(terms.issueDate)}
              </Text>
            </View>
            <View>
              <Text style={styles.micro}>Due date</Text>
              <Text style={styles.headerValue}>
                {formatDateShort(terms.dueDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* from / to */}
        <View style={styles.parties}>
          <View
            style={{ width: "50%", borderRightWidth: 1, borderRightColor: LINE }}
          >
            {renderParty("From", sender)}
          </View>
          <View style={{ width: "50%" }}>{renderParty("To", client)}</View>
        </View>

        {/* items */}
        <View style={styles.items}>
          <View style={styles.tableRow}>
            <Text style={{ ...styles.micro, ...styles.colDesc }}>
              Description
            </Text>
            <Text style={{ ...styles.micro, ...styles.colQty }}>Qty</Text>
            <Text style={{ ...styles.micro, ...styles.colPrice }}>Price</Text>
            <Text style={{ ...styles.micro, ...styles.colAmount }}>
              Amount
            </Text>
          </View>

          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.colDesc}>{item.name || "—"}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>{fmtNum(item.price)}</Text>
              <Text style={styles.colAmount}>
                {fmtNum(item.qty * item.price)}
              </Text>
            </View>
          ))}

          <View style={styles.bottomGrid}>
            <View style={styles.noteCol}>
              {details.note ? (
                <>
                  <Text style={{ fontSize: 11, color: MUTED }}>Note</Text>
                  <Text style={{ fontSize: 11, color: SOFT, marginTop: 5 }}>
                    {details.note}
                  </Text>
                </>
              ) : null}
            </View>
            <View style={styles.totalsCol}>
              <View style={styles.totalsRow}>
                <Text style={{ color: MUTED }}>Subtotal</Text>
                <Text>{fmtMoney(subtotal)}</Text>
              </View>
              {details.discount > 0 ? (
                <View style={styles.totalsRow}>
                  <Text style={{ color: MUTED }}>Discount</Text>
                  <Text>-{fmtMoney(details.discount)}</Text>
                </View>
              ) : null}
              {details.tax > 0 ? (
                <View style={styles.totalsRow}>
                  <Text style={{ color: MUTED }}>Tax ({details.tax}%)</Text>
                  <Text>
                    {fmtMoney(
                      (Math.max(0, subtotal - details.discount) *
                        details.tax) /
                        100
                    )}
                  </Text>
                </View>
              ) : null}
              <View style={{ ...styles.totalsRow, borderBottomWidth: 0 }}>
                <Text style={{ color: MUTED }}>Total</Text>
                <Text style={{ fontSize: 15, fontWeight: 600 }}>
                  {fmtMoney(total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* payment footer */}
        <View style={styles.footer}>
          <View style={styles.footerCols}>
            <View style={styles.footerCol}>
              <Text style={styles.micro}>Payable in</Text>
              {asset ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 14,
                  }}
                >
                  <View
                    style={{ ...styles.tokenDot, backgroundColor: asset.color }}
                  >
                    <Text
                      style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 600 }}
                    >
                      {asset.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 11, fontWeight: 500 }}>
                      {asset.name}
                    </Text>
                    <Text style={{ fontSize: 9.5, color: MUTED, marginTop: 2 }}>
                      {asset.code}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.footerCol}>
              <Text style={{ ...styles.micro, marginBottom: 14 }}>
                Instructions
              </Text>
              {network ? (
                <View style={styles.instRow}>
                  <Text style={{ fontSize: 11, color: MUTED }}>Network</Text>
                  <Text style={{ fontSize: 11 }}>{network.name}</Text>
                </View>
              ) : null}
              {payment.walletAddress ? (
                <View style={styles.instRow}>
                  <Text style={{ fontSize: 11, color: MUTED }}>Wallet</Text>
                  <Text
                    style={{
                      fontSize: 9.5,
                      maxWidth: 170,
                      textAlign: "right",
                    }}
                  >
                    {chunk(payment.walletAddress)}
                  </Text>
                </View>
              ) : null}
              {payment.fiat && payment.bankName ? (
                <View style={styles.instRow}>
                  <Text style={{ fontSize: 11, color: MUTED }}>Bank</Text>
                  <Text
                    style={{ fontSize: 9.5, maxWidth: 170, textAlign: "right" }}
                  >
                    {[
                      payment.bankName,
                      payment.accountNumber,
                      payment.routingNumber,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Text style={{ fontSize: 9, color: MUTED, marginTop: "auto" }}>
            Prepared with the internal invoice tool
          </Text>
        </View>
      </Page>
    </Document>
  );
}
