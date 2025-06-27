// NewSale/InvoicePage.jsx
import React, { useEffect } from "react";
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
import { MdDashboard, MdOutlineEmail } from "react-icons/md";
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
import MobileInvoiceLayout from "./MobileInvoice/MobileInvoiceLayout";
import { IoLocationOutline } from "react-icons/io5";
import { FiPhoneCall } from "react-icons/fi";
import { formatDate, formatTime } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { useInvoice } from "../../hooks/useInvoice";

import Swal from "sweetalert2";
import axios from "axios";
import Spinner from "../../components/Spinner";

const InvoicePage = () => {
  const { isMobile } = useDeviceSize();
  const { user, token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoiceId } = useParams();
  const { invoiceData, loading, error } = useSelector((state) => state.invoice);
  const {
  handlePrint,
  handleDownloadPDF,
  handleShare,
  handleCancelSale,
} = useInvoice({ isMobile, token, invoiceData, navigate });



  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoiceById(invoiceId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearInvoice());
    };
  }, [dispatch, invoiceId]);

  if (loading) return <div><Spinner/></div>;

  if (error)
    return (
      <div className="invoice-page">
        <h2>{error}</h2>
        <button onClick={() => navigate("/new-sale")}>Go Back</button>
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

  
  

  return (
    <>
      <div style={{ display: "none" }}>
        <div id="mobile-invoice-print-wrapper">
          <MobileInvoiceLayout invoiceData={invoiceData} />
        </div>
      </div>

      <div className="invoice-wrapper">
        <div className="invoice-header-btns">
          <button className="back-btn" onClick={() => navigate("/new-sale")}>
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

        <div className="invoice-container" id="invoice">
          {invoiceData.status === "cancelled" && (
            <div className="cancelled-stamp">CANCELLED</div>
          )}

          <header className="invoice-header">
            <section className="store-details">
              <div className="store-logo">
                <img src={Logo} alt="Store Logo" />
              </div>
              <div className="store-info">
                <h1>Rehmat Textile</h1>
                <p>
                  {" "}
                  <IoLocationOutline size={20} />
                  Azam Gunj, Jawahar Bazar, Kapadline, Bidar - 585401
                </p>
                <p>
                  <MdOutlineEmail size={18} /> contact@rehmattextile.com |{" "}
                  <FiPhoneCall size={16} /> 8123221210
                </p>
              </div>
            </section>

            <section className="invoice-details">
              <div>
                <strong>Invoice #: </strong>
                {invId}
              </div>
              <div>
                <strong>Date: </strong>
                {formatDate(createdAt)}
              </div>
              <div>
                <strong>Cashier name: </strong>
                {salesManId.fullName || "N/A"}
              </div>

              <div>
                <strong>Time: </strong>
                {formatTime(createdAt)}
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
        {isLoggedIn && (
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
                    onClick={() => handleCancelSale(invoiceData.invoiceId)}
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
        )}
      </div>
    </>
  );
};

export default InvoicePage;
