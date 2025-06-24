// This utility function generates a unique invoice number.

// Function to generate invoice ID
  const generateInvoiceId = () => {
    // Get today's date
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2); // Get last two digits of the year (e.g., "25" for 2025)
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Get month (e.g., "04" for April)
    const day = String(today.getDate()).padStart(2, "0"); // Get day (e.g., "29")

    const datePart = `${year}${month}${day}`; // Combine year, month, day

    // Get the last invoice number for today
    let lastInvoiceNumber =
      localStorage.getItem(`lastInvoiceNumber_${datePart}`) || 0;
    lastInvoiceNumber = parseInt(lastInvoiceNumber) + 1; // Increment the number

    
    // Format the sequential number as a 3-digit string (e.g., "001", "002")
    const formattedNumber = String(lastInvoiceNumber).padStart(3, "0");

    // Return the full invoice ID
    return `RT${datePart}${formattedNumber}`;
  };
  
  module.exports = { generateInvoiceId };