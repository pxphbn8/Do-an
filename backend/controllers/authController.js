import Account from '../models/accountModel.js';
import bcrypt from 'bcryptjs';

// Đăng ký tài khoản mới
export const registerAccount = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được đăng ký.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAccount = new Account({
      username,
      email,
      password: hashedPassword,
      role: role || 'User',
    });

    await newAccount.save();

    res.status(201).json({ message: 'Tài khoản đã được tạo thành công.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
};

// Lấy danh sách tài khoản
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().select('-__v -createdAt -updatedAt');
    res.json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
};
