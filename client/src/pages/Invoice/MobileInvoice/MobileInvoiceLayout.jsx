
import Logo from "../../../assets/inv-Rehmat-Textile-Logo.png";
import "./ThermalStyle.css"; // <-- Custom thermal CSS here
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import { formatDate, formatTime } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";

const MobileInvoiceLayout = ({ invoiceData }) => {
  if (!invoiceData) {
    return <p>Loading invoice data...</p>; // or return null;
  }
  const {
    invoiceId,
    createdAt,
    salesManId,
    customerName,
    customerMobile,
    cart = [],
    subTotal,
    discount,
    grandTotal,
    amountReceived,
    paymentMethod,
  } = invoiceData;



  return (
    <div className="t-invoice-container">
      {invoiceData.status === "cancelled" && (
        <div className="t-cancelled-stamp">CANCELLED</div>
      )}
      <div className="t-inv-header">
        <div className="t-store-info">
          <div className="t-store-logo">
            <img src={Logo} alt="Store Logo" />
            <h1>Rehmat Textile</h1>
          </div>
          <p>
            {" "}
            <IoLocationOutline size={16} />
            Azam Gunj, Jawahar Bazar, Kapadline, <br />
            Bidar - 585401
          </p>
          <p>
            {" "}
            <MdOutlineEmail size={18} />
            contact@rehmattextile.com <br /> <FiPhoneCall size={16} />{" "}
            8123221210{" "}
          </p>
        </div>
      </div>

      <div className="t-invoice-detailss">
        <div>
          <div>
            <strong>Invoice #: </strong>
            {invoiceId}
          </div>
          <div>
            <strong>Cashier: </strong>
            {salesManId?.fullName || "N/A"}
          </div>
        </div>
        <div>
          <div>
            <strong>Date: </strong>
            {formatDate(createdAt)}
          </div>
          <div>
            <strong>Time: </strong>
            {formatTime(createdAt)}
          </div>
        </div>
      </div>
      <div className="t-customer-info">
        <p>
          <strong>Customer Name:</strong> {customerName || "N/A"}
        </p>
        <p>
          <strong>Mobile:</strong> {customerMobile || "N/A"}
        </p>
      </div>

      <div className="t-product-table">
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
                  {item.prodName} <br /> {item.category}
                </td>
                <td>₹{item.sellingPrice}</td>
                <td>{item.quantity}</td>
                <td>₹{item.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="t-invoice-summary">
        <div className="t-tandc">
          <p className="t-congrats-msg">
            <span className="t-success-icon">
              <TbRosetteDiscountCheck size={20} />
            </span>
            <strong>Congratulations!</strong> <br />
            You've saved <br />
            <strong style={{ fontSize: "18px" }}>
              {formatCurrency(discount)}
            </strong>{" "}
            <br /> on this order.
          </p>
          <strong>Terms & Conditions:</strong>
          <ul>
            <li>All sales are final.</li>
            <li>Returns accepted within 3 days.</li>
            <li>Only Damaged goods will be exchanged.</li>
          </ul>
        </div>
        <div className="t-summary-table">
          <table>
            <tbody>
              <tr>
                <td>Subtotal:</td>
                <td>₹{subTotal}</td>
              </tr>
              <tr>
                <td>Discount:</td>
                <td>₹{discount}</td>
              </tr>
              <tr>
                <td>
                  <strong>Grand Total:</strong>
                </td>
                <td>
                  <strong>₹{grandTotal}</strong>
                </td>
              </tr>
              <tr>
                <td>Payment:</td>
                <td>{paymentMethod}</td>
              </tr>
              <tr>
                <td>You Paid:</td>
                <td>
                  <strong style={{ fontSize: "18px" }}>
                    ₹{amountReceived}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="t-thank-you-message">
        <p>
          Thank you for shopping with us. <br /> Have a fantastic day ahead !!!
        </p>
      </div>

      <p className="t-footer-note">
        --------- Software by CodeByZeeshan.com <br />
        (+91 7829589843) ---------
      </p>
    </div>
  );
};

export default MobileInvoiceLayout;
