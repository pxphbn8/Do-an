import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const token = new URLSearchParams(location.search).get('token');
console.log('Token:', token);
  useEffect(() => {
    if (!token) {
      setMessage('Liên kết không hợp lệ.');
    }
  }, [token]);

  const handleReset = async () => {
    try {
      const res = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Đặt lại mật khẩu thành công. Đang chuyển hướng...');
        setTimeout(() => navigate('/LoginSignup'), 1000);
      } else {
        setMessage(data.message || 'Lỗi đặt lại mật khẩu');
      }
    } catch (error) {
      setMessage('Lỗi server');
    }
  };

  return (
    <div className="reset-page">
      <h2>Đặt lại mật khẩu</h2>
      {message && <p>{message}</p>}
      {!message.includes('không hợp lệ') && !message.includes('thành công') && (
        <>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleReset}>Xác nhận</button>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
