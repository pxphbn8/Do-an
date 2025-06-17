import mongoose from 'mongoose';

const momo = new mongoose.Schema({
  orderId: String,
  requestId: String,
  amount: Number,
  resultCode: Number,
  message: String,
  payType: String,
  extraData: String,
  signature: String,
  orderInfo: String,
  responseTime: { type: Date, default: Date.now }
});

const MomoTransaction = mongoose.model('MomoTransaction', momo);
export default MomoTransaction;
