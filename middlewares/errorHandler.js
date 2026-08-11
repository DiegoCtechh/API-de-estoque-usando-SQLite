function errorHandler(err, req, res, next) {
    console.error(`[ERRO] ${req.method} ${req.url} →`, err.message);

    const isDev = process.env.NODE_ENV === 'development';

    return res.status(err.status || 500).json({
        message: err.message || 'Erro interno do servidor',
        ...(isDev && { stack: err.stack }),
    });
}

export default errorHandler;
