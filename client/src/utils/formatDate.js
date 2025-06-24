// src/utils/formatDate.js
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  // Format: DD-MM-YYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// Optional: For full date and time
export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  });
};
