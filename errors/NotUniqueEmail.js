module.exports = class NotUniqueEmailError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Пользователь с таким именем уже существует';
    this.statusCode = 409;
  }
};
