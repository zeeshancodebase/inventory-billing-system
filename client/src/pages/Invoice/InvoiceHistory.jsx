// pages/Invoice/InvoiceHistory.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineReceiptLong } from "react-icons/md";
import { formatDate } from "../../utils/formatDate";
import { useDeviceSize } from "../../context/DeviceSizeContext";
import styles from "./InvoiceHistory.module.css";
import AdminOnly from "../../utils/AdminOnly";
import { useAuth } from "../../context/auth";

const InvoiceHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useDeviceSize();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getAllSales"
        );
        setSales(response.data);
        console.log("Fetched sales:", response.data);
      } catch (error) {
        console.error("Failed to fetch sales:", error);
      }
    };

    fetchSales();
  }, []);

  const handleViewClick = (id) => {
    // Navigate to the invoice details page
    navigate(`/invoice/${id}`);
  };

  return (
    <div style={{ padding: "32px" }} className="sales-history-page">
      {!isMobile ? (
        <>
          <h2 className="sales-history-title">🧾 Sales History</h2>

          <table
            width="100%"
            border="1"
            cellPadding="8"
            style={{
              borderCollapse: "collapse",
              marginTop: "20px",
              backgroundColor: "white",
            }}
            className="sales-history-table"
          >
            <thead style={{ backgroundColor: "#f0f0f0" }}>
              <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Sales Man</th>
                {/* <th>Customer Name</th> */}
                <th>Mobile No.</th>
                <th>Total (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.invoiceId}>
                  <td>{sale.invoiceId}</td>
                  <td>{formatDate(sale.createdAt)}</td>
                  <td>{sale.salesManId?.fullName}</td>
                  {/* <td>{sale.customerName || "-"}</td> */}
                  <td>{sale.customerMobile || "-"}</td>
                  <td>₹{sale.grandTotal}</td>
                  <td>
                    <span
                      className="sales-statis-badge"
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        color: "white",
                        backgroundColor:
                          sale.status === "completed"
                            ? "#28a745"
                            : sale.status === "pending"
                            ? "#ffc107"
                            : "#6c757d",
                      }}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <button
                      style={{
                        padding: "6px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "#2e3a59",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleViewClick(sale.invoiceId)}
                    >
                      <MdOutlineReceiptLong /> View
                    </button>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className={styles.cards}>
            {sales.map((sale) => (
              <div key={sale.invoiceId} className={styles.card}>
                <div className={styles.cardRow}>
                  <strong>Invoice:</strong> {sale.invoiceId}
                </div>
                <div className={styles.cardRow}>
                  <strong>Date:</strong> {formatDate(sale.createdAt)}
                </div>
                <div className={styles.cardRow}>
                  <strong>Customer:</strong> {sale.customerName || "-"}
                </div>
                <div className={styles.cardRow}>
                  <strong>Mobile:</strong> {sale.customerMobile || "-"}
                </div>
                <div className={styles.cardRow}>
                  <strong>Salesman:</strong> {sale.salesManId?.fullName || "-"}
                </div>
                <div className={styles.cardRow}>
                  <strong>Total (₹):</strong> ₹{sale.grandTotal}
                </div>
                <div className={styles.cardRow}>
                  <strong>Payment:</strong> {sale.paymentMethod}
                </div>
                <div className={styles.cardRow}>
                  <strong>Status:</strong>
                  <span
                    className={`${styles.status} ${
                      sale.status === "completed"
                        ? styles.completed
                        : sale.status === "pending"
                        ? styles.pending
                        : styles.other
                    }`}
                    style={{ marginLeft: 8 }}
                  >
                    {sale.status}
                  </span>
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={`${styles.btn} ${styles.viewBtn}`}
                    onClick={() => handleViewClick(sale.invoiceId)}
                  >
                    <MdOutlineReceiptLong /> View
                  </button>

                  <AdminOnly isAdmin={user.isAdmin}>
                    {sale.status !== "cancelled" && !sale.isReturn && (
                      <>
                        <button
                          className={`${styles.btn} ${styles.cancelBtn}`}
                          // onClick={() => handleCancelSale(sale.invoiceId)}
                        >
                          ❌ Cancel
                        </button>

                        <button
                          className={`${styles.btn} ${styles.returnBtn}`}
                          // onClick={() => handleReturnSale(sale.invoiceId)}
                        >
                          🔄 Return
                        </button>
                      </>
                    )}
                  </AdminOnly>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceHistory;
