import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Tải biến môi trường từ file .env

const connectToMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI; // Lấy chuỗi kết nối từ biến môi trường
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Kết nối MongoDB thành công!");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error);
  }
};

export default connectToMongoDB;
