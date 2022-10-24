module.exports = class BadRequireToken extends Error {
  constructor(message) {
    super(message);
    this.message = 'не верные данные';
    this.statusCode = 403;
  }
};
