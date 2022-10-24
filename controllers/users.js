const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'very_secret';
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const BadRequestError = require('../errors/ErrorBadRequest');
const NotFoundError = require('../errors/ErrorNotFound');
const NotUniqueEmailError = require('../errors/NotUniqueEmail');
const NotDataError = require('../errors/NotPassOrEmail');
const User = require('../models/user');

const {
  CORRECT_CODE,
  CREATE_CODE,
} = require('../utils/correctcodes');

module.exports.createUser = ((req, res, next) => {
  const {
    name, about, avatar, password,
  } = req.body;
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
        next(new BadRequestError('Некорректные данные для запроса'));
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new NotUniqueEmailError());
      } else {
        next(err);
      }
    });
});

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(CORRECT_CODE).send(user))
    .catch(next);
};

module.exports.getUserSelfInfo = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
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
      res.status(CORRECT_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new NotDataError();
      }
      return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '5d' });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, req.body, {
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
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, req.body, {
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
      } else {
        next(err);
      }
    });
};
