import crypto from 'crypto';
import axios from 'axios';
import MomoTransaction from '../models/momo.js';
import momoConfig from '../config/momoConfig.js';

const { partnerCode, accessKey, secretKey, endpoint } = momoConfig;

export const createPayment = async (req, res) => {
  try {
    const { amount, orderId, orderInfo, redirectUrl, ipnUrl, extraData = '' } = req.body;

    const requestId = `${orderId}-${Date.now()}`;
    const requestType = 'captureWallet';
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const body = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: 'vi'
    };

    const response = await axios.post(endpoint, body, {
      headers: { 'Content-Type': 'application/json' }
    });

    // Save transaction to DB
    await MomoTransaction.create({
      ...response.data,
      orderId,
      requestId,
      amount,
      orderInfo,
      signature,
      extraData
    });

    res.json(response.data);
  } catch (err) {
    console.error('MoMo payment error:', err);
    res.status(500).json({ message: 'Thanh toán MoMo thất bại.', error: err.message });
  }
};
