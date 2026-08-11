import db from "../database.js";
import { productSchema, stockMovementSchema } from '../schemas/productSchema.js';


export function createProduct(req, res) {
    const { name, price, stock } = req.body;
    const processProduct = productSchema.safeParse(req.body);
    if (!processProduct.success) {
        return res.status(400).json({ message: processProduct.error.errors });
    }

    const stmt = db.prepare(`INSERT INTO products (name, price, stock) VALUES (?, ?, ?)`);
    const result = stmt.run(name.trim(), price, stock);
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(result.lastInsertRowid);
    return res.status(201).json(product);
}

export function getAllProducts(req, res) {
    const { search, page, limit } = req.query;

    let query = `SELECT * FROM products WHERE 1=1`;
    const params = [];

    if (search) {
        query += ` AND name LIKE ?`;
        params.push(`%${search}%`);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    query += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const products = db.prepare(query).all(...params);

    return res.json({
        data: products,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        }
    });
}

export function getProductById(req, res) {
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }
    return res.json(product);
}

export function updateProduct(req, res) {
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors });
    }

    const { name, price, stock } = validation.data;

    db.prepare(`UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?`)
        .run(name.trim(), price, stock, req.params.id);

    const updated = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    return res.json(updated);
}

export function deleteProduct(req, res) {
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }
    db.prepare(`DELETE FROM products WHERE id = ?`).run(req.params.id);
    return res.json({ message: 'Produto excluído com sucesso' });
}

export function productEntry(req, res) {
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const { stock } = req.body;
    if (!stock || typeof stock !== 'number' || !Number.isInteger(stock) || stock <= 0) {
        return res.status(400).json({ message: 'Quantidade deve ser um número inteiro maior que zero' });
    }

    db.prepare(`UPDATE products SET stock = stock + ? WHERE id = ?`).run(stock, req.params.id);
    db.prepare(`INSERT INTO movements (product_id, type, stock, date) VALUES (?, ?, ?, ?)`)
        .run(req.params.id, 'entrada', stock, new Date().toISOString());

    const updated = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    return res.json({ message: 'Entrada registrada com sucesso', product: updated });
}

export function productExit(req, res) {
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const { stock } = req.body;
    if (!stock || typeof stock !== 'number' || !Number.isInteger(stock) || stock <= 0) {
        return res.status(400).json({ message: 'Quantidade deve ser um número inteiro maior que zero' });
    }
    if (product.stock < stock) {
        return res.status(400).json({ message: `Estoque insuficiente. Disponível: ${product.stock}` });
    }

    db.prepare(`UPDATE products SET stock = stock - ? WHERE id = ?`).run(stock, req.params.id);
    db.prepare(`INSERT INTO movements (product_id, type, stock, date) VALUES (?, ?, ?, ?)`)
        .run(req.params.id, 'saida', stock, new Date().toISOString());

    const updated = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    return res.json({ message: 'Saída registrada com sucesso', product: updated });
}

export function getStockReport(req, res) {
    const totalProducts = db.prepare(`SELECT COUNT(*) as count FROM products`).get().count;
    const totalStockValue = db.prepare(`SELECT SUM(price * stock) as value FROM products`).get().value || 0;
    const totalItems = db.prepare(`SELECT SUM(stock) as total FROM products`).get().total || 0;

    const LOW_STOCK_THRESHOLD = 5;
    const lowStock = db.prepare(`SELECT * FROM products WHERE stock <= ? ORDER BY stock ASC`)
        .all(LOW_STOCK_THRESHOLD);

    const totalEntries = db.prepare(`SELECT COUNT(*) as count FROM movements WHERE type = 'entrada'`).get().count;
    const totalExits = db.prepare(`SELECT COUNT(*) as count FROM movements WHERE type = 'saida'`).get().count;

    return res.json({
        summary: {
            totalProducts,
            totalItems,
            totalStockValue: parseFloat(totalStockValue.toFixed(2)),
            totalEntries,
            totalExits,
        },
        lowStockAlert: {
            threshold: LOW_STOCK_THRESHOLD,
            count: lowStock.length,
            products: lowStock,
        }
    });
}
