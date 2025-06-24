// pages/AddProduct/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductAsync,
  updateProductAsync,
  clearSelectedProduct,
} from "../../features/products/productsSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { GiRolledCloth } from "react-icons/gi";
import { AiOutlineEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory
import "./AddProduct.css";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate for navigation

  // Get the selected product from the Redux store
  const { selectedProduct, loading } = useSelector((state) => state.products);

  const { prodId } = useParams();
  const isEditing = Boolean(prodId);

  // Set up state for the form fields
  const [product, setProductState] = useState({
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

  // Flag to prevent invalid access toast after form submission
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isEditing && !selectedProduct && !submitted) {
      toast.error("Invalid access. Please select the product to edit.");
      navigate("/products");
    }
  }, [isEditing, selectedProduct, navigate, submitted]);

  // If we are editing a product, pre-fill the form with selected product's data
  useEffect(() => {
    if (isEditing) {
      if (selectedProduct) {
        setProductState({
          ...selectedProduct,
          // handle specific cases for lengthPerRoll when switching types
        });
      }
    } else {
      // If no selectedProduct, reset form state for adding a new product
      dispatch(clearSelectedProduct());
      setProductState({
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
    }
  }, [isEditing, prodId, selectedProduct, dispatch]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submission (add or edit a product)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // If editing, update the existing product
        await dispatch(updateProductAsync(product));
        Swal.fire({
          title: "Product Updated Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Redirect user back to the products list (or other page)
        navigate("/products");
      } else {
        // If adding, add a new product
        await dispatch(addProductAsync(product));
        Swal.fire({
          title: "Product Added Successfully!",
          icon: "success",
          showCancelButton: true,
          cancelButtonText: "View Products",
          confirmButtonText: "Add Another Product",
        }).then((result) => {
          if (result.isConfirmed) {
            // User clicked "Add Another Product"
            // No extra logic needed for resetting state here
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // User clicked "View Products"
            navigate("/products"); // Navigate to products
          }
        });
      }

      // Reset form and navigate
      setProductState({
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

      // Clear selected product from Redux store
      dispatch(clearSelectedProduct());

      // Mark as submitted to prevent invalid access toast
      setSubmitted(true);
    } catch (error) {
      toast.error("There was an issue processing your request.");
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="add-product-title">
        {isEditing ? (
          <>
            <AiOutlineEdit size={30} /> Edit Product
          </>
        ) : (
          <>
            "➕ Add New Product <GiRolledCloth />"
          </>
        )}
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
              <option value="roll">Roll</option>
              <option value="box">Box</option>
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
                {product.prodType === "box"
                  ? "per Box"
                  : product.prodType === "roll"
                  ? "per mtr"
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
            <label>Selling Price (₹) * 
              <span
                style={{
                  fontSize: "1em",
                  marginLeft: "4px",
                  color: "#555",
                }}
              >
                {product.prodType === "box"
                  ? "per Box"
                  : product.prodType === "roll"
                  ? "per mtr"
                  : ""}
              </span></label>
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
          {product.prodType === "roll" && (
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
              {product.prodType === "roll"
                ? "(No. of Rolls)"
                : product.prodType === "box"
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
              {product.prodType === "roll"
                ? "(Meters)"
                : product.prodType === "box"
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
            {/* {isEditing ? "Update Product" : "Save Product"} */}
             {loading ? (
              <>
                <ClipLoader color="#fff" loading={loading} size={20} />
              </>
            ) : isEditing ? (
              "Update Product"
            ) : (
              "Save Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
