// // src/hooks/useCheckoutSale.js
// import { useDispatch } from "react-redux";
// import { createSaleAsync, resetSaleState } from "../features/sale/saleSlice";
// import { resetCart } from "../features/cart/cartSlice";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// export const useCheckout = ({ user, token, cart, subTotal, discount, grandTotal, amountReceived, totalCost, paymentMethod, calculateTotalItems, resetSaleStateLocal }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

// //*-----------------------------
//   // * Handling Checkout Submission
//   //* -----------------------------

//   const handleSubmit = async () => {
//     if (cart.length === 0) {
//       alert("Cart is empty. Please add products before checkout.");
//       return;
//     }

//     // if (!sale.customerName || !sale.customerMobile) {
//     //   alert("Please enter customer name and mobile number.");
//     //   return;
//     // }

//     if (amountReceived < grandTotal) {
//       const confirmProceed = window.confirm(
//         `Amount received (${amountReceived}) is less than grand total (${grandTotal.toFixed(
//           2
//         )}). Proceed anyway?`
//       );
//       if (!confirmProceed) return;
//     }

//     console.log("🛒 Current Cart:", cart);

//     const checkoutData = {
//       salesManId: user._id,
//       customerMobile: sale.customerMobile,
//       customerName: sale.customerName,
//       customerAddress: sale.customerAddress,
//       cart,
//       totalItems: calculateTotalItems(),
//       subTotal,
//       discount,
//       grandTotal,
//       amountReceived,
//       totalCost,
//       profit: parseFloat((grandTotal - totalCost).toFixed(2)),
//       paymentMethod,
//     };

//     try {
//       console.log("Sale Data to backend:", checkoutData);
//       const resultAction = await dispatch(
//         createSaleAsync({ saleData: checkoutData, token })
//       );

//       if (createSaleAsync.fulfilled.match(resultAction)) {
//         const newSale = resultAction.payload;
//         toast.success("Sale successful!");
//         handleReset();
//         navigate(`/invoice/${newSale.invoiceId}`);
//       } else {
//         toast.error(resultAction.payload || "Checkout failed");
//       }
//     } catch (err) {
//       console.error("Error during checkout:", err);
//       toast.error("Unexpected error. Try again.", err);
//     }
//   };


//   return { handleSubmit };
// };

