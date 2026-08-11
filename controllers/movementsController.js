import db from "../database.js";

export function getAllMovements(req, res) {
    const { product_id, type, page, limit } = req.query;

    let query = 'SELECT * FROM movements WHERE 1=1';
    const params = [];

    if (product_id) {
        query += ' AND product_id = ?';
        params.push(product_id);
    }

    if (type) {
        if (type !== 'entrada' && type !== 'saida') {
            return res.status(400).json({ message: 'Tipo inválido. Use "entrada" ou "saida"' });
        }
        query += ' AND type = ?';
        params.push(type);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const movements = db.prepare(query).all(...params);

    return res.json({
        data: movements,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        }
    });
}
