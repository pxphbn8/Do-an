import React from 'react';
import './App.css';
import Page from './Components/Page';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import ForgotPassword from './Components/ForgotPassword.jsx';
import ResetPassword from './Components/ResetPassword.jsx';
import Home from './Components/Home';
import Products from './Components/Products';
import Account from './Components/Account';
import About from './Components/About';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Routes, Route } from 'react-router-dom';
import Productdetails from './Components/Productdetails';
import Cart from './Components/Cart';
import Thanhtoan from './Components/Thanhtoan';
import Trangcapnhat from './Components/Trangcapnhat.jsx';
import Danhgia from './Components/Danhgia';
import Admin from './Admin/Admin.jsx';
import ManageUsers from './Admin/ManageUsers';
import ManageProducts from './Admin/ManageProducts';
import ProductCreate from './Admin/ProductCreate';
import ProductEdit from './Admin/ProductEdit';
import OrderManagement from './Admin/OrderManagement';
import AcountAdmin from './Admin/AcountAdmin';
import Reviews from './Admin/Reviews';
import Income from './Admin/Income';
// import Contact from './Components/Contact.jsx';

function App() {
  return (
    <>
      <Page />
      <Routes>
        <Route path="Income" element={<Income />} />
        <Route path="Reviews" element={<Reviews />} />
        <Route path="AcountAdmin" element={<AcountAdmin />} />
        <Route path="OrderManagement" element={<OrderManagement />} />
        <Route path="/ProductCreate" element={<ProductCreate />} />
        <Route path="/ProductEdit/:productId" element={<ProductEdit />} />
        <Route path="/ManageUsers" element={<ManageUsers />} /> 
        <Route path="/ManageProducts" element={<ManageProducts />} /> 
        <Route path="/admin" element={<Admin />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Productdetails />} />
        <Route path="/LoginSignup" element={<LoginSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Thanhtoan" element={<Thanhtoan />} />
        <Route path="/Trangcapnhat/:orderId" element={<Trangcapnhat />} />
        <Route path="/Danhgia" element={<Danhgia />} />
        {/* <Route path="/Contact" element={<Contact/>}/> */}
      </Routes>
    </>
  );
}

export default App;
