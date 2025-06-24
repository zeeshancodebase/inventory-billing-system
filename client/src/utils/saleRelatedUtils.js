// /utils/saleRelatedUtils.js


export const isStockAvailable = (products, prodId, requestedQty) => {
  const product = products.find((p) => p.prodId === prodId);
  if (!product) return false;

  // Check based on product type
  if (product.prodType === "box") {
    return requestedQty <= product.quantity; // Check for boxes
  } else if (product.prodType === "roll") {
    return requestedQty <= product.totalLength; // Check for rolls
  }
  return true;
};