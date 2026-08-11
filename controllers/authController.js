import db from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authSchema } from '../schemas/authSchema.js';

export function register(req, res) {
    const validation = authSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors });
    }

    const { username, password } = validation.data;

    const userExists = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (userExists) {
        return res.status(409).json({ message: "Nome de usuário já está em uso" });
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
        return res.status(500).json({ message: "Erro interno ao registrar usuário" });
    }

    return res.status(201).json({ message: "Usuário registrado com sucesso" });
}

export function login(req, res) {
    const validation = authSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors });
    }

    const { username, password } = validation.data;

    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) {
        return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
    const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn }
    );

    return res.status(200).json({ token, expiresIn });
}
