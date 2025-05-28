import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['User', 'Admin'], default: 'User' },
    resetToken: String,
  resetTokenExpires: Date,
});

const Account = mongoose.model('Account', accountSchema);
export default Account;
