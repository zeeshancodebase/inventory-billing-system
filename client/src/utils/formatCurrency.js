
 export const formatCurrency = (amount) =>{
    return amount % 1 === 0 ? `₹${amount}` : `₹${amount.toFixed(1)}`;
  }