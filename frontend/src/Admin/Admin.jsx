import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Admin.css";
const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser || loggedInUser.role !== 'Admin') {
      navigate('/Home'); // Nếu không phải Admin, điều hướng về trang chủ
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/LoginSignup');
  };

  return (
    <div className="admin-container">
      <h1>Welcome to Admin Dashboard</h1>
      <div className="admin-actions">
        <button onClick={() => navigate('/AcountAdmin')}>Edit Profile</button>
        <button onClick={() => navigate('/ManageUsers')}>Manage Users</button>
        <button onClick={() => navigate('/ManageProducts')}>Manage Products</button>
        <button onClick={() => navigate('/OrderManagement')}>Manage Orders</button>
        <button onClick={() => navigate('/reviews')}>Review</button>
        <button onClick={() => navigate('/income')}>Income</button>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
};

export default Admin;
