import express from "express";
import db from "../database.js";
import authenticateToken from './middleware/auth.js';

const router = express.Router();

//post
router.post('/', authenticateToken, (req, res) => {
    const { name, price, stock } = req.body;

    if (!name || name.trim() === '') {
        res.status(400).json({ message: 'Nome do produto é obrigatório' });
        return;
    }

    if (price === undefined || price < 0) {
        res.status(400).json({ message: 'Preço deve ser um número positivo' });
        return;
    }

    if (stock === undefined || stock < 0) {
        res.status(400).json({ message: 'Estoque inválido' });
        return;
    }

    const stmt = db.prepare(`INSERT INTO products (name, price, stock) VALUES (?, ?, ?)`);
    const result = stmt.run(name, price, stock);
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(result.lastInsertRowid);
    res.json(product);
});


router.get('/', authenticateToken, (req, res) => {
    const products = db.prepare(`SELECT * FROM products`).all();
    res.json(products);
});


router.delete('/:id', authenticateToken, (req, res) => {
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    if (!product) {
        res.status(404).json({ message: 'Produto não encontrado' });
        return;
    }
    db.prepare(`DELETE FROM products WHERE id = ?`).run(req.params.id);
    res.json({ message: 'Produto excluído com sucesso' });
});

//change
router.put('/:id', authenticateToken, (req, res) => {
    const { name, price, stock } = req.body;
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    if (!product) {
        res.status(404).json({ message: 'Produto não encontrado' });
        return;
    }

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'O nome do preoduto e obrigatório' });
    }

    if (price === undefined || price < 0) {
        return res.status(400).json({ message: 'O preço deve ser um numero positivo.' });
    }

    if (stock === undefined || stock < 0) {
        return res.status(400).json({ message: 'O estoque deve ser um numero positivo.' });
    }

    db.prepare(`UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?`).run(name, price, stock, req.params.id);
    res.json({ message: 'Produto atualizado com sucesso' });
})

router.post('/:id/entrada', authenticateToken, (req, res) => {
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);

    if (!product) {
        res.status(404).json({ message: 'Produto não encontrado' });
        return;
    }

    const { stock } = req.body;

    if (!stock || stock <= 0) {
        return res.status(400).json({ message: 'Quantidade deve ser maior que zero' });
    }

    db.prepare(`UPDATE products SET stock = stock + ? WHERE id = ?`).run(stock, req.params.id);
    db.prepare(`INSERT INTO movements (product_id, type, stock, date) VALUES (?, ?, ?, ?)`).run(req.params.id, 'entrada', stock, new Date().toISOString());
    res.json({ message: 'Entrada do produto registrada com sucesso' });
});

router.post('/:id/saida', authenticateToken, (req, res) => {
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    if (!product) {
        res.status(404).json({ message: 'Produto não encontrado' });
        return;
    }
    const { stock } = req.body;
    if (!stock || stock <= 0) {
        res.status(400).json({ message: 'quantidade inválida' });
        return;
    }
    if (product.stock < stock) {
        res.status(400).json({ message: 'Estoque insuficiente' });
        return;
    }
    db.prepare(`UPDATE products SET stock = stock - ? WHERE id = ?`).run(stock, req.params.id);
    db.prepare(`INSERT INTO movements (product_id, type,stock, date) VALUES (?, ?, ?, ?)`).run(req.params.id, 'saida', stock, new Date().toISOString());
    res.json({ message: 'Saída do produto registrada com sucesso' });
});

export default router;