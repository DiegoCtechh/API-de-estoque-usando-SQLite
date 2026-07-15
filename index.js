import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

import productsRouter from './routes/products.js';
import movementsRouter from './routes/movements.js';
import authRouter from './routes/auth.js';

app.use('/products', productsRouter);
app.use('/movements', movementsRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} [${process.env.NODE_ENV}]`);
});

