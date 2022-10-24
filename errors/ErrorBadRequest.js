module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Некорректные или неполные данные';
    this.statusCode = 400;
  }
};
