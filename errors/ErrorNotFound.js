module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Объект не найден';
    this.statusCode = 404;
  }
};
