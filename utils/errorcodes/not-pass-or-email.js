module.exports = class NotDataError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Не правильный пароль или емейл';
    this.statusCode = 401;
  }
};
