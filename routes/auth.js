import express from 'express';
import db from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || username.trim() === "" || password.length === 0) {
        return res.status(400).json({ message: "todos os campos sao obrigatorios" });
    }

    const userExists = db.prepare("SELECT * FROM users WHERE username = ?").get(username)

    if (userExists) {
        return res.status(400).json({ message: "usuario ja existe" });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    try {
        const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        const result = stmt.run(username, hashPassword);
        if (!result.changes) {
            throw new Error("Erro ao registrar usuário");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao registrar usuário" });
    }

    return res.status(201).json({ message: "usuario registrado com sucesso" });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || username.trim() === "" || password.length === 0) {
        return res.status(400).json({ message: "todos os campos sao obrigatorios" });
    }

    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

    if (!user) {
        return res.status(401).json({ message: "usuario nao encontrado" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: "senha incorreta" });
    }

    const token = jwt.sign({ userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
});

export default router;