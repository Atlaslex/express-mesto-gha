module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Переданы некорректные или неполные данные';
    this.statusCode = 400;
  }
};
