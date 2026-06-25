const express = require("express");

const app = express();

app.use(express.json());

const productsRouter = require('./routes/products');
const movementsRouter = require('./routes/movements');

app.use('/products', productsRouter);
app.use('/movements', movementsRouter);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

