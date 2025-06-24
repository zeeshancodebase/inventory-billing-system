// services/productAPI.js
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_SERVER_URL;

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/getAllProducts`); // Your API endpoint here
    return response.data; // Returning the products data
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;  // To handle error in slice
  }
};


export const deleteProduct = async (id) => {
  const response = await axios.delete(`${BASE_URL}/api/deleteProduct/${id}`);
  return response.data;
};

export const updateProduct = async (id, updatedData) => {
  const response = await axios.put(`${BASE_URL}/api/updateProduct/${id}`, updatedData);
  return response.data;
};
