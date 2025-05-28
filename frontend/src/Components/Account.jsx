import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Account.css'; 

function Account() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: ""
  });

  useEffect(() => {
    // Lấy user từ localStorage hoặc gọi API lấy thông tin user theo token
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        username: storedUser.username,
        email: storedUser.email,
        role: storedUser.role
      });
    } else {
      // Chưa đăng nhập, chuyển về trang login
      navigate('/LoginSignup');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Gọi API cập nhật thông tin user
      const res = await axios.put(`http://localhost:3000/accounts/${user._id}`, formData);
      if (res.status === 200) {
        setUser(formData);
        localStorage.setItem("user", JSON.stringify(formData));
        setIsEditing(false);
        alert("Cập nhật thông tin thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản", error);
      alert("Cập nhật thất bại");
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("user");
  //    localStorage.removeItem("isLoggedIn");
  //   setUser(null);
  //   navigate('/LoginSignup');
  // };

  const cancel=()=>{
    navigate('/Home');
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="account-container">
      <h3 className="account-header">Account Information</h3>
      {!isEditing ? (
        <div className="account-details">
          <table className="account-table">
            <tbody>
              <tr>
                <td><strong>Username</strong></td>
                <td>{user?.username || "Not provided"}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>{user?.email || "Not provided"}</td>
              </tr>
              <tr>
                <td><strong>Role</strong></td>
                <td>{user?.role || "Not provided"}</td>
              </tr>
            </tbody>
          </table>
          <div className="account-actions">
            <button onClick={() => setIsEditing(true)} className="btn btn-edit">Edit</button>
            <button onClick={cancel} className="btn btn-logout">Cance</button>
          </div>
        </div>
      ) : (
        <div className="account-edit-form">
          <form>
            <table className="account-table">
              <tbody>
                <tr>
                  <td><strong>Username</strong></td>
                  <td>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </td>
                </tr>
                <tr>
                  <td><strong>Role</strong></td>
                  <td>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="account-actions">
              <button type="button" onClick={handleSave} className="btn btn-save">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Account;
