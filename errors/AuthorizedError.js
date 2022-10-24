module.exports = class AuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Авторизуйтесь для доступа';
    this.statusCode = 401;
  }
};
