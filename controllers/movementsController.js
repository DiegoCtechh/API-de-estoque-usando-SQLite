import db from "../database.js";

export function getAllMovements(req, res) {
    const { product_id, type } = req.query;

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

    query += ' ORDER BY date DESC';

    const movements = db.prepare(query).all(...params);
    return res.json(movements);
}
