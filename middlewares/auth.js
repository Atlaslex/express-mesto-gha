const { checkToken } = require('../utils/jwt');
const User = require('../models/user');

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуйтесь для доступа');
  error.statusCode = 401;
  throw error;
};

const isAuthorized = ((req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = checkToken(token);

    User.findOne({ id: payload._id }).then((user) => {
      if (!user) {
        throwUnauthorizedError();
      }

      req.user = { _id: user._id };

      next();
    });
  } catch (err) {
    throwUnauthorizedError();
  }
});

module.exports = { isAuthorized };
