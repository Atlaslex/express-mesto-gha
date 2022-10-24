const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = 'very_secret';

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуйтесь для доступа');
  error.statusCode = 401;
  throw error;
};

const isAuthorized = ((req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw throwUnauthorizedError();
  }
  try {
    const token = () => jwt.verify(authorization.replace('Bearer ', ''), SECRET_KEY);
    const payload = token();
    User.findOne({ id: payload._id }).then((user) => {
      if (!user) {
        throwUnauthorizedError();
      }
    });
    req.user = payload;
  } catch (err) {
    throwUnauthorizedError();
  }

  next();
});

module.exports = { isAuthorized };
