import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../assets/Rehmat-Textile-Logo.jpg";
import NotoSansRegular from "../../assets/fonts/NotoSans-Regular.ttf";
import discountIcon from "../../assets/img/discount-icon.PNG";
import TimesNewRoman from "../../assets/fonts/Times New Roman Regular.ttf";
import RobotoItalic from "../../assets/fonts/Roboto-Italic.ttf";

Font.register({
  family: "Noto Sans",
  src: NotoSansRegular,
});

Font.register({
  family: "RobotoItalic",
  src: RobotoItalic,
});

Font.register({
  family: "TimesNewRoman",
  src: TimesNewRoman,
});

const InvoicePDF = ({ invoiceData }) => {
  if (!invoiceData) return null;

  const {
    invoiceId,
    salesManId,
    createdAt,
    paymentMethod,
    customerName,
    customerMobile,
    cart,
    subTotal,
    discount,
    grandTotal,
    amountReceived,
  } = invoiceData;

  const dateObj = new Date(createdAt);
  const formattedDate = dateObj.toLocaleDateString("en-IN");
  const formattedTime = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formatCurrency = (amount) =>
    amount % 1 === 0 ? `${amount}` : `${amount.toFixed(1)}`;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.meta}>
          {/* Header */}
          <View style={styles.header}>
            <Image src={logo} style={styles.logo} />
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>Rehmat Textiles</Text>
              <Text style={{ fontSize: "13.5px" }}>
                Azam Gunj, Jawahar Bazar, Kapadline, Bidar - 585401
              </Text>
              <Text style={{ fontSize: "13.5px" }}>
                Email: contact@rehmattextile.com | Phone: 8123221210
              </Text>
            </View>
          </View>

          {/* Invoice Info */}
          <View style={styles.section}>
            <View style={styles.twoColumnRow}>
              <Text style={{ fontSize: "12px" }}>Invoice #: {invoiceId}</Text>
              <Text style={{ fontSize: "12px" }}>
                Cashier: {salesManId.fullName || "N/A"}
              </Text>
            </View>
            <View style={styles.twoColumnRow}>
              <Text style={{ fontSize: "12px" }}>Date: {formattedDate}</Text>
              <Text style={{ fontSize: "12px" }}>Time: {formattedTime}</Text>
            </View>
           

            {/* Customer Info */}

            <View style={styles.twoColumnRow}>
              <Text style={{ fontSize: "14px" }}>
                Customer:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {customerName || "N/A"}
                </Text>
              </Text>
              <Text style={{ fontSize: "14px" }}>
                Mobile:
                <Text style={{ fontWeight: "bold" }}>
                  {" "}
                  {customerMobile || "N/A"}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Product Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>SKU</Text>
            <Text style={[styles.tableCellHeader, { flex: 3 }]}>Product</Text>
            <Text style={[styles.tableCellHeader, { flex: 1.2 }]}>Price</Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Qty</Text>
            <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>Total</Text>
          </View>
          {cart.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.prodId}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                {item.prodName} - {item.category}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>
                <Text style={styles.rupIcon}>₹</Text>
                {item.sellingPrice}
                {item.prodType === "box"
                  ? "/Box"
                  : item.prodType === "roll"
                  ? "/mtr"
                  : ""}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {item.quantity}
                {item.prodType === "roll" ? "m" : "Bx"}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>
                {formatCurrency(item.totalPrice)}
              </Text>
            </View>
          ))}
        </View>
 {invoiceData.status === "cancelled" && (
              <View style={styles.cancelledStamp}>
                <Text style={styles.cancelledText}>CANCELLED</Text>
              </View>
            )}
        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.twoColumnRow}>
            <View>
              <Text style={styles.congratsMsg}>
                {" "}
                <Text style={{ fontWeight: "bold", fontSize: "14" }}>
                  <Image src={discountIcon} style={styles.icon} />{" "}
                  Congratulations!
                </Text>{" "}
                You've saved{" "}
                <Text style={{ fontWeight: "bold", fontSize: "14" }}>
                  <Text style={styles.rupIcon}>₹</Text>
                  {formatCurrency(discount)}
                </Text>{" "}
                on this order.
              </Text>
              <Text style={styles.termsHeader}>Terms & Conditions:</Text>
              <Text style={{ fontSize: "14px", marginBottom: "5px" }}>
                - All sales are final.
              </Text>
              <Text style={{ fontSize: "14px", marginBottom: "5px" }}>
                - Returns accepted within 3 days.
              </Text>
              <Text style={{ fontSize: "14px", marginBottom: "5px" }}>
                - Only damaged goods will be exchanged.
              </Text>
            </View>

            <View style={{ marginRight: "10px" }}>
              <View style={styles.twoColumnRow}>
                <Text>Subtotal:</Text>
                <Text>
                  <Text style={styles.rupIcon}>₹</Text>
                  {formatCurrency(subTotal)}
                </Text>
              </View>
              <View style={styles.twoColumnRow}>
                <Text>Discount:</Text>
                <Text>
                  <Text style={styles.rupIcon}>₹</Text>
                  {formatCurrency(discount)}
                </Text>
              </View>
              <View style={[styles.twoColumnRow, styles.grandTotal]}>
                <Text>Grand Total:</Text>
                <Text>
                  <Text style={styles.rupIcon}>₹</Text>
                  {formatCurrency(grandTotal)}
                </Text>
              </View>
              <View style={styles.twoColumnRow}>
                <Text>Payment Mode:</Text>
                <Text>{paymentMethod}</Text>
              </View>
              <View style={styles.twoColumnRow}>
                <Text style={{ paddingTop: "5px" }}>Amount Paid:</Text>
                <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
                  <Text style={styles.rupIcon}>₹</Text>
                  {Number(amountReceived).toLocaleString("en-IN")}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Footer Message */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>
            Thank you for shopping with us. Have a fantastic day ahead!
          </Text>
        </View>
        <Text style={styles.softwareBy}>
          ------- Software by CodeByZeeshan.com (+91 7829589843) -------
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

const styles = StyleSheet.create({
  page: {
    padding: 30,
    color: "#4f4f4f",
  },
  rupIcon: {
    fontFamily: "Noto Sans",
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  meta: {
    borderBottom: "2px solid #666",
  },
  logo: {
    borderRadius: 5,
    width: 60,
    height: 60,
    marginTop: 4,
    marginRight: 8,
  },
  storeInfo: {
    flexDirection: "column",
  },
  storeName: {
    fontFamily: "TimesNewRoman",
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: 2,
  },
  section: {
    marginBottom: 10,
  },
  twoColumnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  tableContainer: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    color: "#333",
    padding: 8,
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    color: "#4f4f4f",
    fontSize: 12,
  },
  tableCellHeader: {
    flex: 1,
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },

  congratsMsg: {
    color: "#155724",
  },
  icon: {
    width: 14,
    height: 14,
    marginRight: 4,
    color: "#155724",
  },

  summarySection: {
    marginTop: 10,
    paddingTop: 6,
    fontSize: 12,
  },
  grandTotal: {
    fontWeight: "bold",
    fontSize: 11,
  },
  footer: {
    marginTop: 20,
    borderTopWidth: "1px",
    borderTopColor: "#ddd",
    borderBottomWidth: "1px",
    borderBottomColor: "#ddd",
    padding: 10,
    fontSize: 14,
  },
  thankYou: {
    textAlign: "center",
    marginBottom: 5,
  },
  termsHeader: {
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 4,
  },
  softwareBy: {
    marginTop: 10,
    textAlign: "center",
    fontFamily: "RobotoItalic",
    fontSize: 10,
  },
  cancelledStamp: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-20deg)",
    border: "4px solid rgba(220, 53, 69, 0.5)",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    zIndex: 999,
  },

  cancelledText: {
    fontSize: 40,
    color: "rgba(220, 53, 69, 0.5)",
    fontWeight: "bold",
    letterSpacing: 4,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
