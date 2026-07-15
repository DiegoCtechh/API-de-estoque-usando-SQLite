require("dotenv").config(); // Carrega as variáveis do arquivo .env

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000; // Usa a variável do .env, ou 3000 como padrão

app.use(express.json());

const productsRouter = require('./routes/products');
const movementsRouter = require('./routes/movements');

app.use('/products', productsRouter);
app.use('/movements', movementsRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} [${process.env.NODE_ENV}]`);
});

