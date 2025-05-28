import Order from '../models/orderModel.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
  try {
    const { userId, products, totalPrice, shippingInfo, status } = req.body;
    if (
      !userId ||
      !products ||
      products.length === 0 ||
      !shippingInfo ||
      !shippingInfo.name ||
      !shippingInfo.phone ||
      !shippingInfo.address
    ) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng!" });
    }

    const validProducts = products.map(p => ({
      productId: new mongoose.Types.ObjectId(p.productId),
      quantity: p.quantity,
    }));

    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      products: validProducts,
      totalPrice,
      shippingInfo,
      status: status || 'Chờ Xác Nhận',
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error.message);
    res.status(500).json({ message: "Lỗi server khi lưu đơn hàng", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json(order);
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error.message);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Failed to get orders', error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng theo id
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;  
  const { status } = req.body; 

  if (!status) {
    return res.status(400).json({ message: 'Missing status in request body' });
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};
