import express from 'express';
import { searchProducts, getAllProducts, getProductById, updateProduct, createProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/products', createProduct); 
router.delete("/products/:id", deleteProduct);
router.get('/products', getAllProducts);
router.get('/products/search', searchProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
export default router;
