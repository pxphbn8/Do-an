import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import './Page.css';
import { useSelector } from "react-redux";

const Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useSelector((state) => state.handleCart);

  const [user, setUser] = useState(null); 

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  } else {
    setUser(null);
  }
}, [location.pathname]);



useEffect(() => {
  // Danh sách route công khai không cần đăng nhập
  const publicPaths = ['/LoginSignup', '/forgot-password', '/reset-password', '/verify-email'];

  // Nếu chưa đăng nhập và không phải route công khai thì redirect
  if (!user && !publicPaths.includes(location.pathname)) {
    navigate('/LoginSignup');
  }
  if (user?.role === 'User' && publicPaths.includes(location.pathname)) {
  navigate('/Home');
}
}, [user, location.pathname, navigate]);
 

  return (
    <>
      {user && user.role !== "Admin" ? (
        <header className="navbar-header">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
              <div className="navbar-brand fw-bold fs-4">SMARTPHONE</div>
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link active" to="/Home">Home</NavLink>
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
                      <i className="fa fa-user me-1"></i> Account
                    </NavLink>
                  </div>
                </div>

                <div className="buttons ms-2">
                  <div className="button-group d-flex">
                   
                    {!user ? (
                      <div className="button">
                        <NavLink to="/LoginSignup" className="btn btn-outline-dark">
                          <i className="fa fa-sign-in me-1"></i> Login
                        </NavLink>
                      </div>
                    ) : (
                      <div className="button">
                       
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("isLoggedIn");
                            setUser(null);  // Cập nhật state để component re-render
                            navigate('/LoginSignup');
                          }}
                        >
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
      ) : null}
    </>
  );
};

export default Page;
