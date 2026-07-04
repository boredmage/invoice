import { Document, Page, Text, View } from "@react-pdf/renderer";
import { type InvoiceData, formatDateShort } from "../lib/types";
import { currencyByCode } from "../lib/data";
import { makeMoneyFormatter } from "../lib/format";
import { styles } from "./pdf/theme";
import { PdfParty } from "./pdf/PdfParty";
import { PdfItems } from "./pdf/PdfItems";
import { PdfFooter } from "./pdf/PdfFooter";

/* 612x866pt page mirroring the on-screen invoice card one-to-one */
export default function InvoicePdf({
  invoiceData,
}: {
  invoiceData: InvoiceData;
}) {
  const { sender, client, details, payment, terms } = invoiceData;
  const currency = currencyByCode(details.currency);
  // the embedded latin-subset font lacks some currency glyphs — fall back
  const fmtMoney = makeMoneyFormatter(currency.pdfSymbol ?? currency.symbol);

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
            style={{
              width: "50%",
              borderRightWidth: 1,
              borderRightColor: "#ECECEC",
            }}
          >
            <PdfParty label="From" party={sender} />
          </View>
          <View style={{ width: "50%" }}>
            <PdfParty label="To" party={client} />
          </View>
        </View>

        <PdfItems details={details} fmtMoney={fmtMoney} />
        <PdfFooter payment={payment} currency={currency} />
      </Page>
    </Document>
  );
}
