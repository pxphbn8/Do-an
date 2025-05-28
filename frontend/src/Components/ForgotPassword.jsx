import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './ForgotPassword.css'
const ForgotPassword = ({ onClose }) => {
  const [resetEmail, setResetEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

 const handleReset = async () => {
  if (!validateEmail(resetEmail)) {
    setError('Email không hợp lệ');
    return;
  }
  setError('');
  setMessage('');

  try {
    // Gửi yêu cầu tạo token cho email này
    const response = await fetch('http://localhost:3000/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail }),
    });
    
    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Lỗi gửi liên kết đặt lại mật khẩu');
      return;
    }

    // Giả sử backend trả token về trong data.token
    const token = data.token;
    if (!token) {
      setError('Không nhận được token từ server');
      return;
    }

    // Tạo link reset có token
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // Gửi email với link reset
    const templateParams = {
      email: resetEmail,
      reset_link: resetLink,
    };

    await emailjs.send(
      'service_wen1dho',
      'template_4h9utv7',
      templateParams,
      'iphK7lNLyu9-Lb6ZW'
    );

    setMessage('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
    setResetEmail('');
  } catch (err) {
    console.error('EmailJS error:', err);
    setError('Đã xảy ra lỗi khi gửi email.');
  }
};


  return (
     <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        <h3>Quên mật khẩu</h3>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button onClick={handleReset} style={{ marginRight: '10px' }}>Gửi liên kết đặt lại</button>
        <button onClick={onClose}>Đóng</button>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;

