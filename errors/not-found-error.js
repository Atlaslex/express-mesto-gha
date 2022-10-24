module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Запрашиваемый объект не найден';
    this.statusCode = 404;
  }
};
