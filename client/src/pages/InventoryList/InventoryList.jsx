// pages/InventoryList/InventoryList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InventoryList.css";

const InventoryList = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getAllProducts");
        setProducts(res.data.products || []);
        // console.log("Fetched products:", res.data.products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const totalValue = products.reduce(
    (acc, item) => acc + (item.costPrice || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="inventory-page">
      <h2>📦 Current Inventory</h2>
      <div className="inventory-table-cantainer">
        <table>
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>Product Id</th>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Inventory Value</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              const isLowStock =
                item.prodType === "box"
                  ? item.quantity <= item.minimumStock
                  : item.prodType === "roll"
                  ? item.totalLength <= item.minimumStock
                  : false;

              // Calculate inventory value for each item
              const value = (item.quantity || 0) * (item.costPrice || 0);

              return (
                <tr
                  key={index}
                  style={{ backgroundColor: isLowStock ? "#fff3cd" : "white" }}
                >
                  <td>{item.prodId || "-"}</td>
                  <td>{item.prodName || "-"}</td>
                  <td>{item.category || "-"}</td>
                  {/* <td>
                    {item.quantity || "-"}{" "}
                    {isLowStock && (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        ⚠️ Low
                      </span>
                    )}
                  </td> */}
                  <td>
                    {item.prodType === "roll"
                      ? `${
                          Number(item.totalLength) % 1 === 0
                            ? Number(item.totalLength)
                            : Number(item.totalLength).toFixed(2)
                        } m`
                      : `${item.quantity || "-"} Bx`}

                    {isLowStock && (
                      <span
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          marginLeft: "5px",
                        }}
                      >
                        ⚠️ Low
                      </span>
                    )}
                  </td>

                  <td>₹{item.costPrice || "-"}</td>
                  <td>₹{item.sellingPrice || "-"}</td>
                  <td>₹{value}</td>
                </tr>
              );
            })}{" "}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    borderBottom: "1px solid #ccc",
                    textAlign: "center",
                  }}
                >
                  There is no Inventory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h3
        style={{
          marginTop: "20px",
          width: "50%",
          padding: "12px",
          background: "linear-gradient(to right, #f0f0f0, white)",
        }}
      >
        📊 Total Inventory Value: ₹{totalValue}
      </h3>
    </div>
  );
};

export default InventoryList;
