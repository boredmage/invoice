import { Image, Text, View } from "@react-pdf/renderer";
import type { CompanyInfo } from "../../lib/types";
import { partyAddressLines } from "../../lib/format";
import { styles } from "./theme";

/* From / To block in the PDF */
export function PdfParty({
  label,
  party,
}: {
  label: string;
  party: CompanyInfo;
}) {
  return (
    <View style={styles.party}>
      <Text style={styles.micro}>{label}</Text>
      {party.logo ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          src={party.logo}
          style={{ ...styles.avatar, backgroundColor: undefined }}
        />
      ) : party.companyName ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {party.companyName.charAt(0).toUpperCase()}
          </Text>
        </View>
      ) : null}
      {party.companyName ? (
        <Text style={styles.partyName}>{party.companyName}</Text>
      ) : null}
      <View style={{ marginTop: 6 }}>
        {party.email ? (
          <Text style={styles.partyLine}>{party.email}</Text>
        ) : null}
        {partyAddressLines(party).map((line, i) => (
          <Text key={i} style={styles.partyLine}>
            {line}
          </Text>
        ))}
        {party.taxId ? (
          <Text style={styles.partyLine}>Tax ID: {party.taxId}</Text>
        ) : null}
      </View>
    </View>
  );
}
