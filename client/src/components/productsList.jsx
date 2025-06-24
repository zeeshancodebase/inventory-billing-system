import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";
import { fetchProductsAsync } from "../features/products/productsSlice";
import { LiaCartPlusSolid } from "react-icons/lia"; // Assuming you are using react-icons for the Cart icon
import { isStockAvailable } from "../utils/saleRelatedUtils";

const ProductsList = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart.cartItems);

  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.prodId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.prodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        quantity,
      })
    );
  };

  const handleQtyInputChange = (prodId, newQty) => {
    const item = cart.find((item) => item.prodId === prodId);
    if (!item) return;

    if (!isStockAvailable(prodId, newQty)) {
      alert("Utna stock available nahi hai.");
      return;
    }

    if (item.prodType === "rolls") {
      // Allow decimal values for rolls
      if (newQty <= 0) {
        alert("Quantity must be greater than 0.");
        return;
      }
      dispatch(updateCartQuantity({ prodId, quantity: newQty }));
    } else if (item.prodType === "boxes") {
      // Only allow whole numbers for boxes
      const newQuantity = Math.floor(newQty); // Enforce whole number for boxes
      if (newQuantity <= 0) {
        alert("Quantity must be greater than 0.");
        return;
      }
      dispatch(updateCartQuantity({ prodId, quantity: newQuantity }));
    }
  };

  const changeQuantity = (prodId, change) => {
    const item = cart.find((item) => item.prodId === prodId);
    if (!item) return;

    const newQty = item.quantity + change;

    if (!isStockAvailable(prodId, newQty)) {
      alert("utna stock available nahi hai.");
      return;
    }

    if (newQty <= 0) {
      dispatch(removeFromCart(prodId));
    } else {
      dispatch(updateCartQuantity({ prodId, quantity: newQty }));
    }
  };
  const handleRemoveFromCart = (prodId) => {
    dispatch(removeFromCart(prodId));
  };

  return (
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
                  <tr key={product._id || product.prodId}>
                    <td>{product.prodId}</td>
                    <td>{product.prodName}</td>
                    <td>{product.category}</td>
                    <td>
                      ₹{product.sellingPrice}{" "}
                      {product.prodType === "boxes"
                        ? "/Box"
                        : product.prodType === "rolls"
                        ? "/mtr"
                        : ""}
                    </td>
                    <td>
                      {product.prodType === "rolls"
                        ? `${product.totalLength || "-"} m`
                        : `${product.quantity || "-"} Bx`}
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
                            onClick={() => changeQuantity(product.prodId, -1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={cartItem?.quantity || 1}
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
                            onClick={() => changeQuantity(product.prodId, 1)}
                          >
                            +
                          </button>
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
    </div>
  );
};

export default ProductsList;
