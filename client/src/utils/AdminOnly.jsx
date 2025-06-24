import React from "react";

const AdminOnly = ({ isAdmin, children }) => {
  return isAdmin ? <>{children}</> : null;
};

export default AdminOnly;
