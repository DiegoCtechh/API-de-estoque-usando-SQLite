import express from "express";
import db from "../database.js";
import authenticateToken from './middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    const movements = db.prepare('SELECT * FROM movements').all();
    res.json(movements);
});

export default router;