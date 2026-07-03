import { Font, StyleSheet } from "@react-pdf/renderer";

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

export const INK = "#000000";
export const SOFT = "#494949";
export const MUTED = "#999999";
export const LINE = "#ECECEC";

export const styles = StyleSheet.create({
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
