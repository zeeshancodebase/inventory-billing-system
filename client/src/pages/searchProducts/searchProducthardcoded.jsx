// pages/SearchProduct.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./searchProduct.css";
import { FaEdit } from "react-icons/fa";
import {
  MdDelete,
  MdImageSearch,
  MdOutlineImageNotSupported,
} from "react-icons/md";
import { GiRolledCloth } from "react-icons/gi";
import { BsBoxSeam } from "react-icons/bs";
import RehmatLogo from "../../assets/Rehmat-Textile-Logo.jpg";
import Swal from "sweetalert2";
import FullPageSpinner from "../../components/FullPageSpinner";

const SearchProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterType, setFilterType] = useState("rolls"); // "rolls", "boxes", or null
  const [loading, setLoading] = useState(true);

  const handleFilter = (type) => {
    setFilterType(type === filterType ? null : type); // toggle logic
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/getAllProducts");
        setProducts(res.data.products || []);
        // console.log("Fetched products:", res.data.products);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    console.log("Image URL:", imageUrl);

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* <img src={imageUrl} alt="Product" /> */}
          <img src={RehmatLogo} alt="Product" />
          <button onClick={onClose} className="close-modal">
            Close
          </button>
        </div>
      </div>
    );
  };

  // const filteredProducts = products.filter(
  //   (product) =>
  //     product.prodId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     product.prodName?.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.prodId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.prodName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType ? product.prodType === filterType : true;

    return matchesSearch && matchesType;
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/deleteProduct/${id}`);
        setProducts(products.filter((product) => product._id !== id));

        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete product:", error);
        Swal.fire(
          "Error!",
          "There was an issue deleting the product.",
          "error"
        );
      }
    }
  };

  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditChange = (e) => {
    setEditingProduct({
      ...editingProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/updateProduct/${editingProduct._id}`,
        editingProduct
      );
      setProducts(
        products.map((p) =>
          p._id === editingProduct._id ? res.data.product : p
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  return (
    <div className="productsPage">
      <div className="productsPageHeader">
        <h2 className="page-title">
          <GiRolledCloth /> All Products
        </h2>

        <div className="search-bar">
          <button
            className={filterType === "rolls" ? "active" : ""}
            onClick={() => handleFilter("rolls")}
          >
            <GiRolledCloth />
            Rolls
          </button>
          <input
            type="text"
            placeholder="Search by Product Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className={filterType === "boxes" ? "active" : ""}
            onClick={() => handleFilter("boxes")}
          >
            <BsBoxSeam />
            Boxes
          </button>
        </div>
      </div>
     

      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Colour</th>
              <th>Price (₹)</th>
              {filterType !== "boxes" && <th>Length (mtr)</th>}
              <th>
                {filterType === "boxes"
                  ? "Boxes"
                  : filterType === "rolls"
                  ? "Rolls"
                  : "Rolls/Boxes"}
              </th>
              <th>Min. stock alert</th>
              <th>Image</th>
              <th>SKU</th>
              <th>Action</th>
            </tr>
          </thead>
           {/* Show the spinner while loading */}
      {loading ? (
        <FullPageSpinner />
      ) : (
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-results">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.prodId}</td>
                  <td>{product.prodName || "-"}</td>
                  <td>{product.category || "-"}</td>
                  <td>{product.type || "-"}</td>
                  <td>{product.color || "-"}</td>
                  <td>
                    ₹{product.sellingPrice}
                    <span
                      style={{
                        fontSize: "0.8em",
                        marginLeft: "4px",
                        color: "#555",
                      }}
                    >
                      {product.prodType === "boxes"
                        ? "/box"
                        : product.prodType === "rolls"
                        ? "/mtr"
                        : ""}
                    </span>
                  </td>
                  {filterType !== "boxes" && <td>{product.totalLength}</td>}
                  <td>{product.quantity}</td>
                  <td>{product.minimumStock}</td>
                  <td>
                    {product.image ? (
                      <MdImageSearch
                        size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSelectedImage(`/assets/${product.image}`)
                        }
                      />
                    ) : (
                      <MdOutlineImageNotSupported
                        size={20}
                        color="gray"
                        style={{ cursor: "not-allowed" }}
                      />
                    )}
                  </td>
                  <td>{product.sku || "-"}</td>
                  {/* Assuming 'Length' and 'Units/Rolls' are the same for simplicity */}
                  <td>
                    <button className="edit-button">
                      {" "}
                      <FaEdit
                        size={20}
                        onClick={() => setEditingProduct(product)}
                      />
                    </button>
                    <button className="delete-button">
                      <MdDelete
                        size={20}
                        onClick={() => handleDelete(product._id)}
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
           )}
        </table>
        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
     
    </div>
  );
};

export default SearchProduct;
