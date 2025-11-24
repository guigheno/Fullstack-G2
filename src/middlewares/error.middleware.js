const { AppError } = require('../utils/httpErrors');

function notFoundMiddleware(_req, _res, next) {
  next(new AppError('Rota não encontrada', 404));
}

function errorMiddleware(err, _req, res, _next) {
  const status = err.status || 500;
  const body = {
    error: err.message || 'Erro interno',
  };
  if (err.details) body.details = err.details;
  res.status(status).json(body);
}

module.exports = { errorMiddleware, notFoundMiddleware };
