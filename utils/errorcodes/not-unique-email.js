module.exports = class NotUniqueEmailError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Такой пользователь уже существует';
    this.statusCode = 409;
  }
};
