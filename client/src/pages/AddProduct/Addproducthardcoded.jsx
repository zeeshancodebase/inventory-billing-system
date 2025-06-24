// pages/AddProduct/AddProduct.jsx
import React, { useState } from "react";
import { GiRolledCloth } from "react-icons/gi";
import "./AddProduct.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AddProduct = () => {
  const [product, setProduct] = useState({
    prodType: "",
    prodName: "",
    category: "",
    sku: "",
    quantity: "",
    minimumStock: "",
    costPrice: "",
    sellingPrice: "",
    lengthPerRoll: "",
    type: "",
    color: "",
  });

  // const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset lengthPerRoll if prodType is switched to 'boxes'
    if (name === "prodType") {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
        lengthPerRoll: value === "boxes" ? "" : prev.lengthPerRoll, // Clear only if 'boxes'
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // const handleImageChange = (e) => {
  //   setImage(e.target.files[0]);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const isValid = Object.values(product).every((val) => val.trim() !== "");
    // if (!isValid || !image) {
    //   alert("Please fill out all fields and upload an image.");
    //   return;
    // }

    try {
      const formData = new FormData();
      for (const key in product) {
        formData.append(key, product[key]);
      }
      // formData.append("image", image);

      const response = await fetch("http://localhost:5000/api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const resData = await response.json();

      if (response.ok) {
        setSuccess(true);

        toast.success(resData.message);

         // Show SweetAlert with product ID
         Swal.fire({
          title: "Product Added Successfully!",
          text: `Product ID: ${resData.product.prodId}`, // Display the product ID
          icon: "success",
          confirmButtonText: "OK",
        });

        // Reset form
        setProduct({
          prodType: "",
          prodName: "",
          category: "",
          sku: "",
          quantity: "",
          minimumStock: "",
          costPrice: "",
          sellingPrice: "",
          lengthPerRoll: "",
          type: "",
          color: "",
        });
        // setImage(null);
      } else {
        toast.error(resData.message);
        // throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="add-product-title">
        ➕ Add New Product <GiRolledCloth />
      </h2>

      <form onSubmit={handleSubmit} className="add-product-form">
        {/* Product Details */}
        <div className="addProd-form-group">
          <div className="addProd-input-group">
            <label>Product Type *</label>
            <select
              name="prodType"
              value={product.prodType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Product Type
              </option>
              <option value="rolls">Roll</option>
              <option value="boxes">Box</option>
            </select>
          </div>
          <div className="addProd-input-group">
            <label>Category *</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Shirt">Shirt</option>
              <option value="Pant">Pant</option>
              <option value="Kurta">Kurta</option>
              <option value="Pyjama">Pyjama</option>
              <option value="Shirt&Pant">Shirt & Pant</option>
              <option value="Suit">Suit</option>
            </select>
          </div>
        </div>

        <div className="addProd-form-group">
          <div className="addProd-input-group">
            <label>
              Cost Price (₹) *
              <span
                style={{
                  fontSize: "1em",
                  marginLeft: "4px",
                  color: "#555",
                }}
              >
                {product.prodType === "boxes"
                  ? "/Box"
                  : product.prodType === "rolls"
                  ? "/Roll"
                  : ""}
              </span>
            </label>
            <input
              type="number"
              name="costPrice"
              value={product.costPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="addProd-input-group">
            <label>Selling Price (₹) *</label>
            <input
              type="number"
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="addProd-form-group">
          {product.prodType === "rolls" && (
            <div className="addProd-input-group">
              <label>Length per Roll * (meters/roll)</label>
              <input
                type="text"
                name="lengthPerRoll"
                value={product.lengthPerRoll}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="addProd-input-group">
            <label>
              {" "}
              Quantity *{" "}
              {product.prodType === "rolls"
                ? "(No. of Rolls)"
                : product.prodType === "boxes"
                ? "(No. of Boxes)"
                : ""}
            </label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="addProd-input-group">
            <label>
              Min. Stock alert{" "}
              {product.prodType === "rolls"
                ? "(Meters)"
                : product.prodType === "boxes"
                ? "(Boxes)"
                : ""}
            </label>
            <input
              type="number"
              name="minimumStock"
              value={product.minimumStock}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="addProd-form-group">
          <div className="addProd-input-group">
            <label>Product Name </label>
            <input
              type="text"
              name="prodName"
              value={product.prodName}
              onChange={handleChange}
            />
          </div>
          <div className="addProd-input-group">
            <label>Fabric Type</label>
            <input
              type="text"
              name="type"
              value={product.type}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="addProd-form-group">
          <div className="addProd-input-group">
            <label>Color</label>
            <input
              type="text"
              name="color"
              value={product.color}
              onChange={handleChange}
            />
          </div>
          <div className="addProd-input-group">
            <label>Product Image</label>
            <input
              type="file"
              accept="image/*"
              // onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="addProd-form-group">
          <div className="addProd-input-group">
            <label>SKU / Code</label>
            <input
              type="text"
              name="sku"
              value={product.sku}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="addProduct-btn">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
