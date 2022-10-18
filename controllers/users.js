const Users = require('../models/user');
const { ValidationErrors, NotFoundError } = require('../errors/Errors');

module.exports.getUsers = (req, res) => {
  const validationError = new ValidationErrors('Переданы некорректные данные при создании пользователя.');
  Users.find({})
    .then(user => res.send(user))
    .catch((err) => {
      let status = 500;
      let message = 'Произошла ошибка';
      // eslint-disable-next-line default-case
      switch (err.name) {
        case validationError.name:
          status = validationError.statusCode;
          message = validationError.message;
          break;
      }
      res.status(status).send(message);
    });
};

module.exports.getUserById = (req, res) => {
  const notFoundError = new NotFoundError('Пользователь по указанному _id не найден.');
  Users.findById(req.params.id).orFail(notFoundError)
    .then(user => res.send(user))
    .catch((err) => {
      let status = 500;
      let message = 'Произошла ошибка';
      // eslint-disable-next-line default-case
      switch (err.name) {
        case notFoundError.name:
          status = notFoundError.statusCode;
          message = notFoundError.message;
          break;
      }
      res.status(status).send(message);
    });
};

module.exports.createUser = (req, res) => {
  const validationError = new ValidationErrors('Переданы некорректные данные при создании пользователя.');
  const data = req.body;
  Users.create(data)
    .then(user => res.send({ data: user }))
    .catch((err) => {
      let status = 500;
      let message = 'Произошла ошибка';
      // eslint-disable-next-line default-case
      switch (err.name) {
        case validationError.name:
          status = validationError.statusCode;
          message = validationError.message;
          break;
      }
      res.status(status).send(message);
    });
};

module.exports.updateUser = (req, res) => {
  if (!(req.body.name && req.body.about)) {
    throw res.status(400).send('Переданы некорректные данные при обновлении профиля');
  }
  const { name, about } = req.body;
  const notFoundError = new NotFoundError('Пользователь с указанным _id не найден.');
  Users.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  ).orFail(notFoundError)
    .then(user => res.send(user))
    .catch((err) => {
      let status = 500;
      let message = 'Произошла ошибка';
      // eslint-disable-next-line default-case
      switch (err.name) {
        case notFoundError.name:
          status = notFoundError.statusCode;
          message = notFoundError.message;
          break;
      }
      res.status(status).send(message);
    });
};

module.exports.updateAvatarUser = (req, res) => {
  if (!req.body.avatar) {
    throw res.status(400).send('Переданы некорректные данные при обновлении аватара.');
  }
  const { avatar } = req.body;
  const notFoundError = new NotFoundError('Пользователь с указанным _id не найден.');

  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true
    }
  ).orFail(notFoundError)
    .then(user => res.send(user))
    .catch((err) => {
      console.dir(err);
      let status = 500;
      let message = 'Произошла ошибка';
      // eslint-disable-next-line default-case
      switch (err.name) {
        case notFoundError.name:
          status = notFoundError.statusCode;
          message = notFoundError.message;
          break;
      }
      res.status(status).send(message);
    });
};