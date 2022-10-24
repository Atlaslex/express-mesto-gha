const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const BadRequestError = require('../errors/bad-request-error');
const BadRequireToken = require('../errors/bad-require-token');
const NotFoundError = require('../errors/not-found-error');
const NotUniqueEmailError = require('../errors/not-unique-email');
const NotDataError = require('../errors/not-pass-or-email');
const User = require('../models/user');

const {
  CORRECT_CODE,
  CREATE_CODE,
} = require('../utils/correctcodes');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) =>

      // eslint-disable-next-line implicit-arrow-linebreak
      res.status(CORRECT_CODE).send(user))
    .catch(next);
};

module.exports.getUserSelfInfo = (req, res, next) => {
  console.log(req.user);
  User.findById(req.user)
    .then((user) => {
      console.log(user);
      res.status(CORRECT_CODE).send(user);
    })
    .catch(next);
};
module.exports.getUserById = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(CORRECT_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
        return;
      }
      next();
    })
    .catch(next);
};

module.exports.createUser = ((req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError();
  }
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(CREATE_CODE).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для запроса'));
      }
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new NotUniqueEmailError());
      }
      next(err);
    })
    .catch(next);
});

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequireToken();
  }
  User.findUserByCredentials(email, password)
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new NotDataError();
      }
      return generateToken({ _id: user._id, expiresIn: '7d' });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(CORRECT_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(CORRECT_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      }

      next(err);
    })
    .catch(next);
};
