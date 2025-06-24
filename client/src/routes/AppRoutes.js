import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/LoginandLogout/Login';
import Logout from '../pages/LoginandLogout/logout';
import ResetPassword from '../pages/LoginandLogout/resetPassword';
import { Welcome } from '../pages/Welcome/Welcome';
import AdminHomePage from '../pages/home/adminHome/AdminHomePage';
import StaffHomePage from '../pages/home/staffHome/StaffHomePage';
import AddProduct from '../pages/AddProduct/AddProduct';
import NewPurchase from '../pages/NewPurchase';
import NewSale from '../pages/NewSale/NewSale';
import SalesReport from '../pages/SalesReport';
import InventoryList from '../pages/InventoryList/InventoryList';
import ManageStaff from '../pages/ManageStaff/ManageStaff';
import InvoiceHistory from '../pages/Invoice/InvoiceHistory';
import SettingsBackup from '../pages/SettingsBackup';
import Charts from '../pages/Charts';
import CheckStock from '../pages/CheckStock';
import ViewSales from '../pages/ViewSales';
import SearchProduct from '../pages/searchProducts/SearchProduct';
import InvoicePage from '../pages/Invoice/InvoicePage';
import Invoice from '../pages/Invoice/invoice';
import Reports from '../pages/reports/reports';
import Unauthorized from '../pages/Error/Unauthorized';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import RoleBasedRoute from './RoleBasedRoute';

const AppRoutes = () => (
  <Routes>

    {/* Public */}
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/resetPassword" element={<PublicRoute><ResetPassword /></PublicRoute>} />

    {/* Accessible after login */}
    <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
    <Route path="/welcome" element={<PrivateRoute><Welcome /></PrivateRoute>} />

    {/* Role: Admin */}
    <Route path="/Admin/Dashboard" element={<RoleBasedRoute allowedRoles={["admin"]}><AdminHomePage /></RoleBasedRoute>} />
    <Route path="/add-product" element={<RoleBasedRoute allowedRoles={["admin"]}><AddProduct /></RoleBasedRoute>} />
    <Route path="/new-purchase" element={<RoleBasedRoute allowedRoles={["admin"]}><NewPurchase /></RoleBasedRoute>} />
    <Route path="/new-sale" element={<RoleBasedRoute allowedRoles={["admin", "staff"]}><NewSale /></RoleBasedRoute>} />
    <Route path="/sales-report" element={<RoleBasedRoute allowedRoles={["admin"]}><SalesReport /></RoleBasedRoute>} />
    <Route path="/reports" element={<RoleBasedRoute allowedRoles={["admin"]}><Reports /></RoleBasedRoute>} />
    <Route path="/inventory" element={<RoleBasedRoute allowedRoles={["admin"]}><InventoryList /></RoleBasedRoute>} />
    <Route path="/manage-staff" element={<RoleBasedRoute allowedRoles={["admin"]}><ManageStaff /></RoleBasedRoute>} />
    <Route path="/invoice-history" element={<RoleBasedRoute allowedRoles={["admin"]}><InvoiceHistory /></RoleBasedRoute>} />
    <Route path="/settings-backup" element={<RoleBasedRoute allowedRoles={["admin"]}><SettingsBackup /></RoleBasedRoute>} />
    <Route path="/charts" element={<RoleBasedRoute allowedRoles={["admin"]}><Charts /></RoleBasedRoute>} />
    <Route path="/products" element={<RoleBasedRoute allowedRoles={["admin", "staff"]}><SearchProduct /></RoleBasedRoute>} />
    <Route path="/check-stock" element={<RoleBasedRoute allowedRoles={["admin", "staff"]}><CheckStock /></RoleBasedRoute>} />
    <Route path="/view-sales" element={<RoleBasedRoute allowedRoles={["admin", "staff"]}><ViewSales /></RoleBasedRoute>} />
    <Route path="/new-sale/invoice" element={<PrivateRoute><InvoicePage /></PrivateRoute>} />
    <Route path="/invoice-history/invoice/:id" element={<PrivateRoute><Invoice /></PrivateRoute>} />

    {/* Role: Staff */}
    <Route path="/Staff/Dashboard" element={<RoleBasedRoute allowedRoles={["staff"]}><StaffHomePage /></RoleBasedRoute>} />
    <Route path="/staff/create-sale" element={<RoleBasedRoute allowedRoles={["staff"]}><NewSale /></RoleBasedRoute>} />
    <Route path="/staff/check-stock" element={<RoleBasedRoute allowedRoles={["staff"]}><CheckStock /></RoleBasedRoute>} />
    <Route path="/staff/todays-sales" element={<RoleBasedRoute allowedRoles={["staff"]}><ViewSales /></RoleBasedRoute>} />
    <Route path="/staff/search-product" element={<RoleBasedRoute allowedRoles={["staff"]}><SearchProduct /></RoleBasedRoute>} />

    {/* Fallback */}
    <Route path="/unauthorized" element={<Unauthorized />} />
  </Routes>
);

export default AppRoutes;
