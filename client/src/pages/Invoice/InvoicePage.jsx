// NewSale/InvoicePage.jsx
import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaDownload,
  FaPrint,
  FaShareAlt,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import "./InvoicePage.css";
import Logo from "../../assets/Rehmat-Textile-Logo.jpg";
import { LuTag } from "react-icons/lu";
import { MdDashboard } from "react-icons/md";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";
import {
  fetchInvoiceById,
  clearInvoice,
} from "../../features/sale/invoiceSlice";
import { useDeviceSize } from "../../context/DeviceSizeContext";
import InvoicePDF from "./InvoicePDF";
import { pdf } from "@react-pdf/renderer";
import { useAuth } from "../../context/auth";

const InvoicePage = () => {
  const { isMobile } = useDeviceSize();
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const printRef = useRef();
  const { invoiceId } = useParams();
  const { invoiceData, loading, error } = useSelector((state) => state.invoice);
  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoiceById(invoiceId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearInvoice());
    };
  }, [dispatch, invoiceId]);

  if (loading) return <div>Loading invoice...</div>;

  if (error)
    return (
      <div className="invoice-page">
        <h2>{error}</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );

  if (!invoiceData) return null;

  console.log("Sale data from backend:", invoiceData);

  const {
    invoiceId: invId,
    salesManId,
    createdAt,
    paymentMethod,
    customerName,
    customerMobile,
    cart = [],
    subTotal = 0,
    discount = 0,
    grandTotal = 0,
    amountReceived = 0,
  } = invoiceData;

  const dateObj = new Date(createdAt);
  const formattedDate = dateObj.toLocaleDateString("en-IN");
  const formattedTime = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  function formatCurrency(amount) {
    return amount % 1 === 0 ? `₹${amount}` : `₹${amount.toFixed(1)}`;
  }

  const handlePrint = () => {
    const content = document.getElementById("invoice");
    const printWindow = window.open("", "", "width=350,height=600");

    // Check if device is mobile (assumed you have isMobile() available)

    // Thermal printer specific CSS for mobile
    const thermalStyle = `
  body {
    font-family: 'Arial', sans-serif;
    font-size: 10px;
    color: #000;
    margin: 0;
    padding: 0;
  }

  .invoice-container {
    width: 260px;
    margin: 0 auto;
    padding: 10px 5px;
  }

  .store-logo {
    text-align: center;
    margin-bottom: 5px;
  }

  .store-logo img {
    max-width: 80px;
    height: auto;
  }

  .store-info {
    text-align: center;
    font-size: 10px;
    line-height: 1.4;
    margin-bottom: 10px;
  }

  .invoice-details,
  .customer-info {
    font-size: 10px;
    margin-bottom: 8px;
  }

  .invoice-details div,
  .customer-info p {
    margin: 2px 0;
  }

  .product-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
  }

  .product-table th,
  .product-table td {
    border-bottom: 1px dashed #000;
    padding: 3px 2px;
    text-align: left;
    word-break: break-word;
  }

  .invoice-summary {
    font-size: 10px;
    margin-top: 10px;
  }

  .summary-table table {
    width: 100%;
    font-size: 10px;
  }

  .summary-table td {
    padding: 3px 2px;
  }

  .invoice-footer {
    margin-top: 10px;
    font-size: 9px;
  }

  .invoice-footer ul {
    padding-left: 14px;
    margin: 4px 0;
  }

  .thank-you-message {
    text-align: center;
    font-size: 10px;
    margin-top: 10px;
    border-top: 1px dashed #000;
    padding-top: 5px;
  }

  strong {
    font-weight: bold;
  }
`;

    // For desktop - copy existing stylesheet content
    const desktopStyle = [...document.styleSheets]
      .map((sheet) => {
        try {
          return [...sheet.cssRules].map((rule) => rule.cssText).join("");
        } catch (e) {
          return ""; // Skip CORS-protected stylesheets
        }
      })
      .join("");

    // Apply thermalStyle if on mobile, otherwise use desktop full CSS
    const styleToUse = isMobile ? thermalStyle : desktopStyle;

    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice Print</title>
        <style>${styleToUse}</style>
      </head>
      <body>${content.outerHTML}</body>
      <p>------- Software by CodeByZeeshan.com (+91 7829589843) -------</p>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();

    // Wait to ensure layout is applied before printing
    printWindow.onload = () => {
      printWindow.print();
      // printWindow.close();
    };
  };

  const handleDownloadPDF = () => {
    pdf(<InvoicePDF invoiceData={invoiceData} />)
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoiceData.invoiceId}.pdf`;
        a.click();
        URL.revokeObjectURL(url); // Clean up memory
      });
  };

  const handleShare = () => {
    const domain = window.location.origin;
    const shareUrl = `${domain}/invoice/c/${invoiceId}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Invoice",
          text: "View your invoice from Rehmat Textile.",
          url: shareUrl,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => {
          console.error("Error sharing:", error);
          alert("Sharing failed. You can still copy the link.");
          navigator.clipboard.writeText(window.location.href);
        });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } else {
      // Final fallback
      const textarea = document.createElement("textarea");
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Link copied to clipboard (fallback)!");
    }
  };

  return (
    <div className="invoice-wrapper">
      <div className="invoice-header-btns">
        <button className="back-btn" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back
        </button>
        <div className="action-buttons">
          <button className="print-btn download-btn " onClick={handlePrint}>
            <FaPrint /> Print
          </button>
          <button className="download-btn" onClick={handleDownloadPDF}>
            <FaDownload /> Download
          </button>
          <button className="share-btn" onClick={handleShare}>
            <FaShareAlt /> Share
          </button>
        </div>
      </div>

      <div ref={printRef} className="invoice-container" id="invoice">
        <header className="invoice-header">
          <section className="store-details">
            <div className="store-logo">
              <img src={Logo} alt="Store Logo" />
            </div>
            <div className="store-info">
              <h1>Rehmat Textile</h1>
              <p>Azam Gunj, Jawahar Bazar, Kapadline, Bidar - 585401</p>
              <p>Email: contact@rehmattextile.com | Phone: 8123221210</p>
            </div>
          </section>

          <section className="invoice-details">
            <div>
              <strong>Invoice #: </strong>
              {invId}
            </div>
            <div>
              <strong>Date: </strong>
              {formattedDate}
            </div>
            <div>
              <strong>Cashier name: </strong>
              {salesManId.fullName || "N/A"}
            </div>

            <div>
              <strong>Time: </strong>
              {formattedTime}
            </div>
          </section>

          <section className="customer-info">
            <p>
              <strong>Customer Name:</strong> {customerName || "N/A"}
            </p>
            <p>
              <strong>Mobile no:</strong> {customerMobile || "N/A"}
            </p>
          </section>
        </header>
        <section className="product-table">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.prodId}>
                  <td>{item.prodId}</td>
                  <td>
                    {item.prodName && item.category
                      ? `${item.prodName} - ${item.category}`
                      : item.prodName || item.category}
                  </td>
                  <td>
                    ₹{item.sellingPrice}
                    {item.prodType === "box"
                      ? "/Box"
                      : item.prodType === "roll"
                      ? "/mtr"
                      : ""}
                  </td>
                  <td>
                    {item.quantity}
                    {item.prodType === "roll" ? "m" : "Bx"}
                  </td>
                  <td>{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="invoice-summary">
          {/* Optional: Message/Comment Section */}
          {/* <section className="invoice-comment">
          <h4>Message to Customer:</h4>
          
          <p>Thank you for your purchase! We hope to serve you again soon.</p>
        </section> */}

          <footer className="invoice-footer">
            <p className="congrats-message">
              <span className="success-icon">
                <TbRosetteDiscountCheck size={28} />
              </span>
              <strong>Congratulations!</strong> You've saved{" "}
              <strong>{formatCurrency(discount)}</strong> on this order.
            </p>
            <strong>Terms & Conditions:</strong>
            <ul>
              <li>All sales are final.</li>
              <li>Returns accepted within 3 days.</li>
              <li>Only Damaged goods will be exchanged.</li>
            </ul>
          </footer>
          <section className="summary-table">
            <table>
              <tbody>
                <tr>
                  <td style={{ textAlign: "right", paddingRight: "10px" }}>
                    Subtotal:
                  </td>
                  <td>{formatCurrency(subTotal)}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right", paddingRight: "10px" }}>
                    <RiDiscountPercentLine size={18} /> Discount:
                  </td>
                  <td>{formatCurrency(discount)}</td>
                </tr>
                <tr className="grand-total">
                  <td style={{ textAlign: "right", paddingRight: "10px" }}>
                    <strong>Grand Total:</strong>
                  </td>
                  <td>
                    <strong>{formatCurrency(grandTotal)}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right", paddingRight: "10px" }}>
                    Payment Mode:
                  </td>
                  <td>{paymentMethod}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right", paddingRight: "10px" }}>
                    Amount Paid:
                  </td>
                  <td style={{ fontSize: "20px", fontWeight: "bold" }}>
                    ₹{Number(amountReceived).toLocaleString("en-IN")}
                  </td>
                </tr>

                {/* Show Amount Paid and Amount Due only if there is a due amount */}
                {/* {grandTotal - amountReceived > 0 && (
                  <>
                    <tr>
                      <td>Amount Paid:</td>
                      <td>₹{amountReceived.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Amount Due:</td>
                      <td style={{ color: "red" }}>
                        ₹{(grandTotal - amountReceived).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <strong>Payment Method: </strong>
                      </td>
                      <td>{paymentMethod}</td>
                    </tr>
                  </>
                )} */}
              </tbody>
            </table>
          </section>
        </div>
        <footer className="thank-you-message">
          <p style={{ margin: "10px" }}>
            Thank you for shopping with us. Have a fantastic day ahead !!!
          </p>
        </footer>
        <br />
        {!user && (
          <p style={{ textAlign: "center" }}>
            ------- Software by CodeByZeeshan.com (+91 7829589843) -------
          </p>
        )}
      </div>
      <div className="invoice-footer-btns">
        <button onClick={() => navigate("/new-sale")}>
          Make new sale <LuTag />
        </button>{" "}
        {/* Show Cancel/Return only if user is admin and sale is not returned/canceled */}
        {user.isAdmin &&
          invoiceData.status !== "cancelled" &&
          !invoiceData.isReturn && (
            <>
              <button
                style={{ backgroundColor: "#f39c12" }}
                // onClick={() => handleReturnSale(sale.invoiceId)}
                disabled
              >
                🔄 Return
              </button>
              <button
                style={{ backgroundColor: "#c0392b" }}
                // onClick={() => handleCancelSale(sale.invoiceId)}
              >
                <FaTimes size={20} /> Cancel
              </button>
            </>
          )}
        <button onClick={() => navigate("/")}>
          <MdDashboard />
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
