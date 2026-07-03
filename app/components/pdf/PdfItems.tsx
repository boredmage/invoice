import { Text, View } from "@react-pdf/renderer";
import {
  type InvoiceDetails,
  calculateSubtotal,
  calculateTotal,
} from "../../lib/types";
import { fmtNum } from "../../lib/format";
import { MUTED, styles } from "./theme";

/* items table, note and totals in the PDF */
export function PdfItems({
  details,
  fmtMoney,
}: {
  details: InvoiceDetails;
  fmtMoney: (n: number) => string;
}) {
  const subtotal = calculateSubtotal(details.items);
  const total = calculateTotal(details.items, details.discount, details.tax);
  const items = details.items.filter((i) => i.name || i.price > 0);

  return (
    <View style={styles.items}>
      <View style={styles.tableRow}>
        <Text style={{ ...styles.micro, ...styles.colDesc }}>Description</Text>
        <Text style={{ ...styles.micro, ...styles.colQty }}>Qty</Text>
        <Text style={{ ...styles.micro, ...styles.colPrice }}>Price</Text>
        <Text style={{ ...styles.micro, ...styles.colAmount }}>Amount</Text>
      </View>

      {items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={styles.colDesc}>{item.name || "—"}</Text>
          <Text style={styles.colQty}>{item.qty}</Text>
          <Text style={styles.colPrice}>{fmtNum(item.price)}</Text>
          <Text style={styles.colAmount}>{fmtNum(item.qty * item.price)}</Text>
        </View>
      ))}

      <View style={styles.bottomGrid}>
        <View style={styles.noteCol}>
          {details.note ? (
            <>
              <Text style={{ fontSize: 11, color: MUTED }}>Note</Text>
              <Text style={{ fontSize: 11, color: "#494949", marginTop: 5 }}>
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
                  (Math.max(0, subtotal - details.discount) * details.tax) /
                    100,
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
  );
}
