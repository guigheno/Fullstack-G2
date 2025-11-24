class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}
class NotFoundError extends AppError {
  constructor(message = 'Não encontrado') {
    super(message, 404);
  }
}
module.exports = { AppError, NotFoundError };
