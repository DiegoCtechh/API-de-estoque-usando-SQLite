const Database = require("better-sqlite3");

const DB_PATH = process.env.DB_PATH || 'estoque.db'; // Caminho do banco via .env
const db = new Database(DB_PATH);

db.exec(`
CREATE TABLE if NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL
)
`);


db.exec(`
CREATE TABLE if NOT EXISTS movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
)
`);

module.exports = db;
