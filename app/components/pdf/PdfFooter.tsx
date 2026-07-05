import { Text, View } from "@react-pdf/renderer";
import type { PaymentMethod } from "../../lib/types";
import { type Currency, assetByCode, networkByCode } from "../../lib/data";
import { chunkString } from "../../lib/format";
import { MUTED, styles } from "./theme";

function InstRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <View style={styles.instRow}>
      <Text style={{ fontSize: 11, color: MUTED }}>{label}</Text>
      <Text
        style={
          mono
            ? { fontSize: 9.5, maxWidth: 170, textAlign: "right" }
            : { fontSize: 11 }
        }
      >
        {mono ? chunkString(value) : value}
      </Text>
    </View>
  );
}

/* payment footer: crypto block plus an extra fiat block when enabled */
export function PdfFooter({
  payment,
  currency,
}: {
  payment: PaymentMethod;
  currency: Currency;
}) {
  const cryptoOn = payment.crypto !== false;
  const asset = payment.asset ? assetByCode(payment.asset) : undefined;
  const network = payment.network ? networkByCode(payment.network) : undefined;
  const hasFiat =
    payment.fiat &&
    !!(payment.bankName || payment.accountNumber || payment.routingNumber);

  return (
    <View style={styles.footer}>
      {cryptoOn ? (
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
            <InstRow label="Network" value={network?.name ?? ""} />
            <InstRow label="Wallet" value={payment.walletAddress} mono />
          </View>
        </View>
      ) : null}

      {/* fiat: its own block, bordered off from the crypto block above it */}
      {hasFiat ? (
        <View
          style={
            cryptoOn
              ? {
                  ...styles.footerCols,
                  borderTopWidth: 1,
                  borderTopColor: "#ECECEC",
                  marginTop: 18,
                  paddingTop: 18,
                }
              : styles.footerCols
          }
        >
          <View style={styles.footerCol}>
            <Text style={styles.micro}>Payable in</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 14,
              }}
            >
              <View style={{ ...styles.tokenDot, backgroundColor: "#F0F0F0" }}>
                <Text style={{ fontSize: 12, fontWeight: 600 }}>
                  {(currency.pdfSymbol ?? currency.symbol).trim().charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 11, fontWeight: 500 }}>
                  {currency.name}
                </Text>
                <Text style={{ fontSize: 9.5, color: MUTED, marginTop: 2 }}>
                  {currency.code}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footerCol}>
            <Text style={{ ...styles.micro, marginBottom: 14 }}>
              Instructions
            </Text>
            <InstRow label="Bank" value={payment.bankName} />
            <InstRow label="Account" value={payment.accountNumber} mono />
            <InstRow
              label="Routing / IBAN"
              value={payment.routingNumber}
              mono
            />
          </View>
        </View>
      ) : null}

      <Text style={{ fontSize: 9, color: MUTED, marginTop: "auto" }}>
        Prepared with the internal invoice tool
      </Text>
    </View>
  );
}
