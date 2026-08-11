import express from "express";
import authenticateToken from '../middlewares/auth.js';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    productEntry,
    productExit,
    getStockReport,
} from '../controllers/productsController.js';

const router = express.Router();

router.get('/report', authenticateToken, getStockReport);

router.post('/', authenticateToken, createProduct);
router.get('/', authenticateToken, getAllProducts);
router.get('/:id', authenticateToken, getProductById);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

router.post('/:id/entrada', authenticateToken, productEntry);
router.post('/:id/saida', authenticateToken, productExit);

export default router;