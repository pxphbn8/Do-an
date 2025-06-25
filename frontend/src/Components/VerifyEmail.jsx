import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Đang xác minh...');

  // Lấy token từ query param, loại bỏ dấu " và khoảng trắng
  const rawToken = searchParams.get('token');
  const token = rawToken ? rawToken.replace(/"/g, '').trim() : null;

  useEffect(() => {
    const verify = async () => {
      try {
        console.log('Token gửi lên API:', token);
        const res = await axios.get(`http://localhost:3000/verify-email?token=${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Xác minh thất bại');
      }
    };

    if (token) verify();
    else setMessage("Token không hợp lệ.");
  }, [token]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
