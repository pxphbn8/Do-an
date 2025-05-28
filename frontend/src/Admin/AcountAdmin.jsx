import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AcountAdmin.css";

const AcountAdmin = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ username: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser || loggedInUser.role !== 'Admin') {
      navigate('/Home'); // Nếu không phải Admin, điều hướng về trang chủ
    } else {
      setUser(loggedInUser);
      setEditData({ username: loggedInUser.username, email: loggedInUser.email });
    }
  }, [navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

const handleSave = async () => {
  try {
    const res = await fetch(`http://localhost:3000/accounts/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editData),
    });
    const updatedUser = await res.json();
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  } catch (error) {
    console.error('Update failed:', error);
  }
};


  const handleCancel = () => {
    setEditData({ username: user.username, email: user.email });
    setIsEditing(false);
  };

  return (
    <div className="admin-container">
      <h1>Admin Profile</h1>
      {user && (
        <table className="admin-details">
          <tbody>
            <tr>
              <td><strong>Username:</strong></td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleChange}
                  />
                ) : (
                  user.username
                )}
              </td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                  />
                ) : (
                  user.email
                )}
              </td>
            </tr>
            <tr>
              <td><strong>Role:</strong></td>
              <td>{user.role}</td>
            </tr>
          </tbody>
        </table>
      )}
      <div className="actions">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button onClick={handleEditClick}>Edit Profile</button>
        )}
        <button onClick={() => navigate('/admin')}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default AcountAdmin;
