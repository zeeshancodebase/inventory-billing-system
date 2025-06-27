import React, { useState, useEffect } from "react";
import "./NewSale.css";
import Header from "../../components/Header";
import { LiaCartPlusSolid } from "react-icons/lia";
import { FaTimes } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdRestartAlt, MdShoppingCartCheckout } from "react-icons/md";
import CurrencyInput from "react-currency-input-field";
import { useAuth } from "../../context/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAsync } from "../../features/products/productsSlice";
import { createSaleAsync, resetSaleState } from "../../features/sale/saleSlice";
import { resetCart } from "../../features/cart/cartSlice";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";

const NewSale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.products);
  const { loading: saleLoading } = useSelector((state) => state.sale);

  const { user, token } = useAuth();
  const {
    cart,
    handleAddToCart,
    handleQtyInputChange,
    changeQuantity,
    handleRemoveFromCart,
    calculateTotalItems,
    calculateCostPrice,
  } = useCart();

  // Fetch products using Redux (only once on component mount)
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  // Format time to HH:mm (24-hour format)
  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0 (midnight), make it 12
    minutes = minutes < 10 ? "0" + minutes : minutes; // Ensure two digits for minutes

    return `${hours}:${minutes} ${ampm}`;
  };

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setSale((prevSale) => ({
        ...prevSale,
        time: formatTime(new Date()), // Update time every minute
      }));
    }, 60000); // Update every minute (60000 ms)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const [amountReceived, setAmountReceived] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const totalCost = calculateCostPrice();

  const getInitialSale = (user) => ({
    date: new Date().toISOString().split("T")[0],
    time: formatTime(new Date()),
    salesMan: user.fullName,
    customerMobile: "9916151230",
    customerName: "Ahmed Pasha",
    customerAddress: "Faizpur, Bidar",
    totalItems: "",
    subTotal: "",
    discount: 0,
    grandTotal: 0,
    amountReceived: 0,
    costPrice: "",
  });
  // State to manage sale details
  const [sale, setSale] = useState(getInitialSale(user));
  const handleReset = () => {
    dispatch(resetSaleState());
    dispatch(resetCart());

    setSale(getInitialSale(user)); // Reset sale with fresh date & time
    setAmountReceived(0);
    setDiscount(0);
    setSubTotal(0);
    setGrandTotal(0);
    setPaymentMethod("Cash");
    setSearchQuery("");
  };

  //*-------------------------------------------------------
  //* Calculations with amount due, discount and grand total
  //*-------------------------------------------------------
  useEffect(() => {
    const newSubTotal = cart.reduce(
      (acc, item) => acc + item.sellingPrice * item.quantity,
      0
    );

    // Default state: discount is zero, GT = Subtotal
    let newDiscount = 0;
    let newGrandTotal = newSubTotal;

    // Only apply discount after amount received is entered
    if (amountReceived > 0 && amountReceived < newSubTotal) {
      newDiscount = newSubTotal - amountReceived;
      newGrandTotal = amountReceived; // GT is now the amount received
    }

    // setSubTotal(newSubTotal);
    // setDiscount(newDiscount);
    // setGrandTotal(newGrandTotal);
    setSubTotal(parseFloat(newSubTotal.toFixed(2)));
    setDiscount(parseFloat(newDiscount.toFixed(2)));
    setGrandTotal(parseFloat(newGrandTotal.toFixed(2)));
  }, [cart, discount, amountReceived]);

  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.prodId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.prodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //*-----------------------------
  // * Handling Checkout Submission
  //* -----------------------------

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty. Please add products before checkout.");
      return;
    }

    // if (!sale.customerName || !sale.customerMobile) {
    //   alert("Please enter customer name and mobile number.");
    //   return;
    // }

    // if (amountReceived < grandTotal) {
    //   const confirmProceed = window.confirm(
    //     `Amount received (${amountReceived}) is less than grand total (${grandTotal.toFixed(
    //       2
    //     )}). Proceed anyway?`
    //   );
    //   if (!confirmProceed) return;
    // }

    if (amountReceived < grandTotal) {
      const result = await Swal.fire({
        title: "Confirm Proceed?",
        text: `Amount received (${amountReceived}) is less than grand total (${grandTotal.toFixed(
          2
        )}). Proceed anyway?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;
    }

    // console.log("🛒 Current Cart:", cart);

    const checkoutData = {
      salesManId: user._id,
      customerMobile: sale.customerMobile,
      customerName: sale.customerName,
      customerAddress: sale.customerAddress,
      cart,
      totalItems: calculateTotalItems(),
      subTotal,
      discount,
      grandTotal,
      amountReceived,
      totalCost,
      profit: parseFloat((grandTotal - totalCost).toFixed(2)),
      paymentMethod,
    };

    try {
      // console.log("Sale Data to backend:", checkoutData);
      const resultAction = await dispatch(
        createSaleAsync({ saleData: checkoutData, token })
      );

      if (createSaleAsync.fulfilled.match(resultAction)) {
        const newSale = resultAction.payload;
        toast.success("Sale successful!");
        handleReset();
        navigate(`/invoice/${newSale.invoiceId}`);
      } else {
        toast.error(resultAction.payload || "Checkout failed");
      }
    } catch (err) {
      // console.error("Error during checkout:", err);
      toast.error("Unexpected error. Try again.", err);
    }
  };

  return (
    <>
      <Header />
      <div className="sale-content">
        {/* Product Selection */}
        <div className="products-section">
          <div className="sale-header">
            <h2 style={{ margin: "0" }}>Create Sale</h2>
            <div className="sale-meta-data">
              <label>Sales man</label>
              <input
                style={{
                  backgroundColor: "rgb(237 237 237)",
                  cursor: "not-allowed",
                }}
                type="text"
                placeholder="Enter salesMan Name"
                value={sale.salesMan}
                disabled
              />

              <label>Time:</label>
              <input type="text" value={sale.time} readOnly />
            </div>
          </div>
          <h3>Select Products: </h3>
          <div className="product-selection">
            <input
              type="text"
              placeholder="Search Product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="product-list-table">
              <table>
                <thead>
                  <tr>
                    <th>Prod Id</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock(m)</th>
                    <th>Add to Cart</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr style={{ height: "70px" }}>
                      <td colSpan={6}>No products found</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const cartItem = cart.find(
                        (item) => item.prodId === product.prodId
                      );

                      return (
                        <tr key={product._id}>
                          <td>{product.prodId}</td>
                          <td>{product.prodName}</td>
                          <td>{product.category}</td>
                          <td>
                            ₹{product.sellingPrice}{" "}
                            {product.prodType === "box"
                              ? "/Box"
                              : product.prodType === "roll"
                              ? "/mtr"
                              : ""}
                          </td>
                          {/* <td>
                            {product.prodType === "roll"
                              ? `${product.totalLength || "-"} m`
                              : `${product.quantity || "-"} Bx`}
                          </td> */}
                          <td>
                            {product.prodType === "roll"
                              ? (typeof product.totalLength === "number"
                                  ? Number(product.totalLength.toFixed(2))
                                  : "0") + " m"
                              : (product.quantity || "0") + " Bx"}
                          </td>

                          <td>
                            {cartItem ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    changeQuantity(product.prodId, -1)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0.1"
                                  step="0.1"
                                  value={
                                    cart.find(
                                      (item) => item.prodId === product.prodId
                                    )?.quantity || 1
                                  }
                                  onChange={(e) =>
                                    handleQtyInputChange(
                                      product.prodId,
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  style={{
                                    width: "40px",
                                    textAlign: "center",
                                    margin: "0",
                                  }}
                                />
                                <button
                                  onClick={() =>
                                    changeQuantity(product.prodId, 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            ) : product.isOutOfStock ? (
                              <div
                                style={{
                                  backgroundColor: "#ff4d4f",
                                  color: "white",
                                  padding: "6px 10px",
                                  textAlign: "center",
                                  borderRadius: "5px",
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                }}
                              >
                                Out of Stock
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(product, 1)}
                                title="Add to Cart"
                              >
                                <LiaCartPlusSolid size={30} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>{" "}
        </div>

        {/* Cart Display */}
        <div className="cart-section">
          <div className="customer-data-section">
            <h3>Sold to:</h3>
            <div className="customer-data-form">
              <div className="customer-input-group">
                <label>Mobile No.:</label>
                <input
                  type="text"
                  placeholder="Enter Customer Mobile no."
                  value={sale.customerMobile} // Bind to customerMobile
                  onChange={(e) => {
                    const value = e.target.value;

                    // Only allow numbers and ensure it does not exceed 10 digits
                    if (/^\d{0,10}$/.test(value)) {
                      setSale({ ...sale, customerMobile: value });
                    }
                  }}
                  maxLength={10} // Limit the input length to 10
                />
                <label>Name: </label>
                <input
                  type="text"
                  placeholder="Enter Customer Name"
                  value={sale.customerName} // Bind to customerName
                  onChange={(e) =>
                    setSale({ ...sale, customerName: e.target.value })
                  }
                />
              </div>
              <label>Customer Address: </label>
              <input
                type="textarea"
                rows="4"
                placeholder="Enter Customer Address"
                value={sale.customerAddress} // Bind to customerAddress
                onChange={(e) =>
                  setSale({ ...sale, customerAddress: e.target.value })
                }
              />
            </div>
          </div>
          <div className="cart-summary">
            <h3>
              Cart <IoCartOutline size={25} />
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Prod Id</th>
                  <th>Products</th>
                  {/* <th>Category</th> */}
                  <th>Price</th>
                  <th>Qty (m/bx)</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr style={{ height: "70px" }}>
                    <td colSpan={6}>The Cart is empty</td>
                  </tr>
                ) : (
                  cart.map((item) => (
                    <tr key={item.prodId}>
                      <td>{item.prodId}</td>
                      <td>
                        {item.prodName && item.category
                          ? `${item.prodName} - ${item.category}`
                          : item.prodName || item.category}
                      </td>
                      {/* <td>{item.category}</td> */}
                      <td>
                        ₹{item.sellingPrice}{" "}
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
                      <td>₹{(item.sellingPrice * item.quantity).toFixed(2)}</td>
                      <td>
                        <div
                          className="remove-btn"
                          onClick={() => handleRemoveFromCart(item.prodId)}
                        >
                          <FaTimes size={20} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h3>Order Summary:</h3>
          <div className="order-summary">
            <div className="order-summary-section-1">
              <table className="summary-table">
                <tbody>
                  <tr>
                    <td>Total Items</td>
                    <td>{calculateTotalItems()}</td>
                  </tr>
                  <tr>
                    <td>Sub Total</td>
                    <td style={{ fontSize: "16px", fontWeight: "bold" }}>
                      ₹{subTotal.toFixed(2)}
                    </td>
                  </tr>

                  <tr>
                    <td>Discount</td>
                    <td>₹{discount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Grand Total</td>
                    <td
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      ₹ {grandTotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="order-summary-section-2">
              <table className="summary-table">
                <tbody>
                  <tr>
                    <td style={{ textAlign: "right" }}>Amount Received:</td>
                    <td>
                      <CurrencyInput
                        prefix="₹"
                        value={amountReceived}
                        onValueChange={(value) => {
                          setAmountReceived(parseFloat(value) || 0);
                        }}
                        placeholder="Amount Received"
                        style={{
                          fontSize: "20px",
                        }}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "right" }}>Payment Method:</td>
                    <td>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Complete Sale Button */}
          <div className="button-area">
            <button type="submit" className="reset-btn" onClick={handleReset}>
              <MdRestartAlt size={25} style={{ marginRight: "6px" }} />
              Reset
            </button>
            <button
              type="submit"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={cart.length === 0 || saleLoading}
              style={{ opacity: cart.length === 0 || saleLoading ? 0.5 : 1 }}
            >
              {saleLoading ? (
                <>
                  <ClipLoader color="#fff" size={20} />
                  &nbsp;CheckingOut...
                </>
              ) : (
                <>
                  Checkout
                  <MdShoppingCartCheckout
                    size={25}
                    style={{ marginLeft: "6px" }}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSale;
