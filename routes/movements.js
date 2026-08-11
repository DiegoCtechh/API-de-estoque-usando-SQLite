import express from "express";
import authenticateToken from '../middlewares/auth.js';
import { getAllMovements } from '../controllers/movementsController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movimentações
 *   description: Histórico de entradas e saídas do estoque
 */

/**
 * @swagger
 * /movements:
 *   get:
 *     summary: Lista movimentações com filtros opcionais
 *     tags: [Movimentações]
 *     parameters:
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do produto
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [entrada, saida]
 *         description: Filtrar por tipo de movimentação
 *     responses:
 *       200:
 *         description: Lista de movimentações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movement'
 */
router.get('/', authenticateToken, getAllMovements);

export default router;
