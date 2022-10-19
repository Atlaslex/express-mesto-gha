const User = require('../models/user');

const {
  CORRECT_CODE,
  CREATE_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/errorcodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(CORRECT_CODE).send(user))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(CORRECT_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Переданы некорректные данные для запроса' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умоланию' });
    });
};

module.exports.createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(CREATE_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умоланию' });
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(CORRECT_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }

      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умоланию' });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(CORRECT_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }

      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умоланию!' });
    });
};
