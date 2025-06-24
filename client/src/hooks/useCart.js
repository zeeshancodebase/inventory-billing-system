// /hooks/useCart.js

import { useDispatch, useSelector } from "react-redux";
import { isStockAvailable } from "../utils/saleRelatedUtils";
import {
    addToCart,
    removeFromCart,
    updateCartQuantity,
} from "../features/cart/cartSlice";



export const useCart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cartItems);
    const products = useSelector((state) => state.products.products);

    const calculateTotalPrice = (price, qty) => {
        return parseFloat((price * qty).toFixed(2));
    };

    const handleAddToCart = (product, quantity = 1) => {
        if (!product || quantity <= 0) {
            alert("Invalid product or quantity");
            return;
        }

        dispatch(
            addToCart({
                prodId: product.prodId,
                prodName: product.prodName,
                sellingPrice: product.sellingPrice,
                prodType: product.prodType,
                category: product.category,
                costPrice: product.costPrice,
                totalPrice: calculateTotalPrice(product.sellingPrice, quantity),
                quantity,
            })
        );
    };

    const handleQtyInputChange = (prodId, newQty) => {
        const item = cart.find((item) => item.prodId === prodId);
        if (!item) return;

        if (!isStockAvailable(products, prodId, newQty)) {
            alert("Utna stock available nahi hai.");
            return;
        }

        if (item.prodType === "roll") {
            // Allow decimal values for rolls
            if (newQty <= 0) {
                alert("Quantity must be greater than 0.");
                return;
            }
            dispatch(updateCartQuantity({ prodId, quantity: newQty, totalPrice: calculateTotalPrice(item.sellingPrice, newQty), }));
        } else if (item.prodType === "box") {
            // Only allow whole numbers for boxes
            const newQuantity = Math.floor(newQty); // Enforce whole number for boxes
            if (newQuantity <= 0) {
                alert("Quantity must be greater than 0.");
                return;
            }
            dispatch(updateCartQuantity({
                prodId, quantity: newQuantity,
                totalPrice: calculateTotalPrice(item.sellingPrice, newQuantity),
            }));
        }
    };

    const changeQuantity = (prodId, change) => {
        const item = cart.find((item) => item.prodId === prodId);
        if (!item) return;

        const newQty = item.quantity + change;

        if (!isStockAvailable(products, prodId, newQty)) {
            alert("utna stock available nahi hai.");
            return;
        }

        if (newQty <= 0) {
            dispatch(removeFromCart(prodId));
        } else {
            dispatch(updateCartQuantity({
                prodId, quantity: newQty,
                totalPrice: calculateTotalPrice(item.sellingPrice, newQty),
            }));
        }
    };

    const handleRemoveFromCart = (prodId) => {
        dispatch(removeFromCart(prodId));
    };


    const calculateTotalItems = () => {
        return cart.reduce((acc, item) => {
            // If the item is a roll, treat it as 1 item regardless of the quantity (meters)
            if (item.prodType === "roll") {
                return acc + 1;
            }
            // If it's a box, use the quantity of boxes as total items
            return acc + item.quantity;
        }, 0);
    };

    // Calculate total cost price
    const calculateCostPrice = () => {
        return cart.reduce((acc, item) => acc + parseFloat((item.costPrice * item.quantity).toFixed(2)), 0);

    };



    return {
        cart,
        products,
        handleAddToCart,
        handleQtyInputChange,
        changeQuantity,
        handleRemoveFromCart,
        calculateTotalItems,
        calculateCostPrice
    };
};

