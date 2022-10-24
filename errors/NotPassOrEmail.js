module.exports = class NotDataError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Неверный пароль или email';
    this.statusCode = 401;
  }
};
