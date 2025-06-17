import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from '../ForgotPassword';
import './LoginSignup.css';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from "jwt-decode";

const LoginSignup = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("User");  
  const [errors, setErrors] = useState({});
  const [showResetPassword, setShowResetPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (username.trim() === "") {
      newErrors.username = "Tên người dùng không được để trống";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      const newUser = { username, email, password, role };
       console.log(" Dữ liệu gửi lên backend:", newUser);
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      try {
        const response = await fetch("http://localhost:3000/tk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        if (!response.ok) throw new Error("Lỗi khi lưu tài khoản.");
        setAction("Login"); 
      } catch (err) {
        console.error("Lỗi API:", err);
      }
    }
  };
  
  const handleLogin = async () => {
    const newErrors = {};
    if (!validateEmail(email)) newErrors.email = "Email không hợp lệ";
    if (password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        const response = await fetch("http://localhost:3000/tk");
        if (!response.ok) throw new Error("Không thể kết nối API.");
        const users = await response.json();
        const userFound = users.find(
          (user) => user.email === email && user.password === password
        );
//         if (userFound && !userFound.isVerified) {
//   alert("Tài khoản chưa được xác minh. Vui lòng kiểm tra email.");
//   return;
// }

        if (userFound) {
          localStorage.setItem("user", JSON.stringify(userFound));
          if (userFound.role === "Admin") {
            navigate('/admin');
          } else {
            localStorage.setItem("isLoggedIn", "true");
            navigate('/Home');
          }
        } else {
          alert("Sai email hoặc mật khẩu");
        }
      } catch (err) {
        console.error("Lỗi khi login:", err);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);
    const { email, name } = decoded;

    const res = await fetch("http://localhost:3000/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credentialResponse.credential })
    });

    const result = await res.json();
    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("isLoggedIn", "true");
    navigate("/Home");
  } catch (err) {
    console.error("Lỗi Google login:", err);
  }
};
  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Sign Up" && (
          <>
            <div className="input">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input">
              <label>Choose Role: </label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </>
        )}
        <div className="input">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="input">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
      </div>

      {action === "Login" && (
        <>
          <div className="forgot-password">
            Quên mật khẩu? <span onClick={() => setShowResetPassword(true)} style={{ color: 'blue', cursor: 'pointer' }}>Click vào đây</span>
          </div>
          <div className="google-login">
            <p>Hoặc đăng nhập bằng:</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Google login thất bại')}
            />
          </div>
        </>
      )}

      {action === "Login" && (
        <div className="signup-prompt">
          Chưa có tài khoản? <span onClick={() => setAction("Sign Up")} style={{ color: 'blue', cursor: 'pointer' }}>Đăng ký</span>
        </div>
      )}
      {action === "Sign Up" && (
        <div className="login-prompt">
          Đã có tài khoản? <span onClick={() => setAction("Login")} style={{ color: 'blue', cursor: 'pointer' }}>Đăng nhập</span>
        </div>
      )}

      <div className="submit-container">
        {action === "Sign Up" ? (
          <div className="submit" onClick={handleSignUp}>Signup</div>
        ) : (
          <div className="submit" onClick={handleLogin}>Login</div>
        )}
      </div>

      {showResetPassword && <ForgotPassword onClose={() => setShowResetPassword(false)} />}
    </div>
  );
};

export default LoginSignup;
