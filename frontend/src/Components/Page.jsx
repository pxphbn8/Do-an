import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import './Page.css';
import { useSelector } from "react-redux";

const Page = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const state = useSelector((state) => state.handleCart)
  const [user,setUser] = useState({});
  console.log("user", user)
  useEffect(() => {
    // user không tồn tại sẽ vào if
    if (!user) {
      navigate('/LoginSignup');
    }
  }, [user])
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, [location.pathname])
  return (
    <>
  {user && user.role !== "Admin" ? (
  <header className="navbar-header">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand fw-bold fs-4" >SMARTPHONE</div>
        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink className="nav-link active" aria-current="page" to="/Home">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/Products">Products</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/About">About</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link disabled">Contact</NavLink>
          </li>       
        </ul>
        <form className="d-flex">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn btn-outline-success" type="submit">Search</button>
          <div className="buttons ms-2">
            <div className="button">
              <NavLink to="/Account" className="btn btn-outline-dark">
                <i className="fa fa-user me-1" ></i> Account
              </NavLink>
            </div>
          </div>
          <div className="buttons ms-2">
            <div className="button-group d-flex">
              {/* Ẩn nút Login khi user đã đăng nhập */}
              {!user ? (
                <div className="button">
                  <NavLink to="/LoginSignup" className="btn btn-outline-dark">
                    <i className="fa fa-sign-in me-1"></i> Login
                  </NavLink>
                </div>
              ) : (
                <div className="button">
                  {/* Nếu muốn có nút Logout luôn ở đây, bạn có thể thêm */}
                  <button className="btn btn-outline-danger" onClick={() => {
                    localStorage.removeItem("user");
                    setUser(null); // Bạn cần đảm bảo có cách cập nhật lại user ở đây hoặc force refresh
                    navigate('/LoginSignup');
                  }}>
                    <i className="fa fa-sign-out me-1"></i> Logout
                  </button>
                </div>
              )}

              <div className="button ms-2">
                <NavLink to="/Cart" className="btn btn-outline-dark">
                  <i className="fa fa-shopping-cart me-1"></i> Cart({state.length})
                </NavLink>
              </div>
            </div>
          </div>
        </form>
      </div>
    </nav>
  </header>
) : <></>}
</>
  );
}

export default Page;

