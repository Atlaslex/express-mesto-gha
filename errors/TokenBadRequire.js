module.exports = class BadRequireToken extends Error {
  constructor(message) {
    super(message);
    this.message = 'Неверные данные';
    this.statusCode = 403;
  }
};
