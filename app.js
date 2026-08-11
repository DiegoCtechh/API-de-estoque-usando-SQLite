import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import productsRouter from './routes/products.js';
import movementsRouter from './routes/movements.js';
import authRouter from './routes/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerSpec from './docs/swagger.js';

const app = express();

app.use(helmet());

const isTest = process.env.NODE_ENV === 'test';

const generalLimiter = isTest ? (req, res, next) => next() : rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Muitas requisições. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = isTest ? (req, res, next) => next() : rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(generalLimiter);

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/products', productsRouter);
app.use('/movements', movementsRouter);
app.use('/auth', authLimiter, authRouter);

app.get('/', (req, res) => {
    res.json({
        name: 'API de Estoque',
        version: '2.0.0',
        endpoints: ['/auth', '/products', '/movements'],
    });
});

app.use(errorHandler);

export default app;
