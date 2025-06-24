import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider to use Redux store
import { store } from './app/store';
import Login from './pages/LoginandLogout/Login';
import AdminHomePage from './pages/home/adminHome/AdminHomePage';
import StaffHomePage from './pages/home/staffHome/StaffHomePage';
import AddProduct from './pages/AddProduct/AddProduct';
import NewPurchase from './pages/NewPurchase';
import NewSale from './pages/NewSale/NewSale';
import SalesReport from './pages/SalesReport';
import InventoryList from './pages/InventoryList/InventoryList';
import ManageStaff from './pages/ManageStaff/ManageStaff';
import InvoiceHistory from './pages/Invoice/InvoiceHistory';
import SettingsBackup from './pages/SettingsBackup';
import Charts from './pages/Charts';
import CheckStock from './pages/CheckStock';
import ViewSales from './pages/ViewSales';
import SearchProduct from './pages/searchProducts/SearchProduct';
import Logout from './pages/LoginandLogout/logout';
import InvoicePage from './pages/Invoice/InvoicePage';
// import Invoice from './pages/Invoice/invoice';
import ResetPassword from './pages/LoginandLogout/resetPassword';
import { Welcome } from './pages/Welcome/Welcome';
import Reports from './pages/reports/reports';
import {Error} from './pages/Error/Error'
// import TempInvViewer from './pages/Invoice/TempInvViewer';



function App() {
  return (
    <div className="App">
      <Provider store={store}>

        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/Admin/Dashboard" element={<AdminHomePage />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:prodId" element={<AddProduct />} />
          <Route path="/new-purchase" element={<NewPurchase />} />
          <Route path="/new-sale" element={<NewSale />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/manage-staff" element={<ManageStaff />} />
          <Route path="/sales" element={<InvoiceHistory />} />
          <Route path="/settings-backup" element={<SettingsBackup />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/check-stock" element={<CheckStock />} />
          <Route path="/view-sales" element={<ViewSales />} />
          <Route path="/products" element={<SearchProduct />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/welcome" element={<Welcome />} />



          
          <Route path="/invoice/:invoiceId" element={<InvoicePage />} />
          <Route path="/invoice/c/:invoiceId" element={<InvoicePage />} />
            {/* <Route path="/inv" element={<TempInvViewer />} /> */}
          {/* <Route path="/new-sale/invoice" element={<InvoicePage />} />
          <Route path="/invoice-history/invoice/:id" element={<Invoice />} /> */}


          {/* Staff Routes */}
          <Route path="/Staff/Dashboard" element={<StaffHomePage />} />
          <Route path="/staff/create-sale" element={<NewSale />} />
          <Route path="/staff/check-stock" element={<CheckStock />} />
          <Route path="/staff/todays-sales" element={<ViewSales />} />
          <Route path="/staff/search-product" element={<SearchProduct />} />

          {/* Login Route */}




          {/* ✅ Catch-all for any invalid routes */}
          <Route path="*" element={<Error />} />

        </Routes>


      </Provider>
    </div>
  );
}

export default App;
