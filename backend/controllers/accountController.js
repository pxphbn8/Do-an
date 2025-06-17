import Account from '../models/Account.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';


export const createAccount = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existing = await Account.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    // const token = crypto.randomBytes(32).toString('hex');
    // const verifyTokenExpires = Date.now() + 3600000;

    const newAccount = new Account({
      username,
      email,
      password,
      role,
      verifyToken: token,
      verifyTokenExpires,
      isVerified: false
    });
    // await newAccount.save();

    // const verifyLink = `http://localhost:5173/verify-email?token=${token}`;

    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.EMAIL_SENDER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL_SENDER,
    //   to: email,
    //   subject: "Xác thực tài khoản của bạn",
    //   html: `<p>Chào ${username},</p>
    //          <p>Vui lòng nhấn vào liên kết dưới đây để xác thực tài khoản:</p>
    //          <a href="${verifyLink}">${verifyLink}</a>
    //          <p>Liên kết này có hiệu lực trong 1 giờ.</p>`,
    // };

    // try {
    //   await transporter.sendMail(mailOptions);
    //   console.log("Email xác thực đã gửi tới", email);
    // } catch (err) {
    //   console.error("Lỗi gửi email xác thực:", err);
    //   return res.status(500).json({ message: "Không gửi được email xác thực", error: err.message });
    // }

    res.status(201).json({ message: "Đăng ký thành công, vui lòng kiểm tra email để xác thực tài khoản" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};


export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { username, email } = req.body;
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );
    if (!updatedAccount) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Gửi yêu cầu reset password
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Account.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // 1 tiếng
    await user.save();

    // Gửi link reset trong console (hoặc email server gửi)
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    console.log("Gửi email với link:", resetLink);

    // TRẢ TOKEN VỀ CHO FRONTEND
    res.status(200).json({ message: 'Đã gửi liên kết đặt lại mật khẩu đến email', token });
  } catch (error) {
    console.error('Error in requestPasswordReset:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};



// Xử lý đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await Account.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // lấy từ Google Cloud

export const handleGoogleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await Account.findOne({ email });

    if (!user) {
      user = new Account({
        username: name,
        email,
        password: '',         // Vì login qua Google
        role: 'User'
      });
      await user.save();
    }

    res.status(200).json({
      message: 'Google login thành công',
      user,
    });
  } catch (error) {
    console.error('Lỗi xác minh Google token:', error);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await Account.findOne({
      verifyToken: token,
      verifyTokenExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Xác minh tài khoản thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};
