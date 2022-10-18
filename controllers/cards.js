const Cards = require('../models/card');
const {ValidationErrors, NotFoundError} = require('../errors/Errors');

module.exports.getCards = (req, res) => {
  const validationError = new ValidationErrors('Переданы некорректные данные при создании карточки.');
  Cards.find({})
    .then(cards => res.send(cards))
    .catch((err) => {
      let status = 500;
      let message = 'Произошла ошибка';
      switch(err.name) {
      case validationError.name:
        status = validationError.statusCode;
        message = validationError.message;
        break;
      }
      res.status(status).send(message);
    });
};

module.exports.createCard = (req, res) => {
  const validationError = new ValidationErrors('Переданы некорректные данные при создании карточки.');
  const {name, link} = req.body;
  const owner = req.user._id;
  Cards.create({name, link, owner})
    .then(cards => res.send(cards))
    .catch((err) => {
      let status = 500;
      let message = 'Произошла ошибка';
      switch(err.name) {
      case validationError.name:
        status = validationError.statusCode;
        message = validationError.message;
        break;
      }
      res.status(status).send(message);
    });
};

module.exports.deleteCard = (req, res) => {
  const notFoundError = new NotFoundError('Карточка с указанным _id не найдена.');
  Cards.findByIdAndRemove(req.params.cardId).orFail(notFoundError)
    .then(cards => res.send(cards))
    .catch((err) => {
      let status = 500;
      let message = 'Произошла ошибка';
      switch(err.name) {
      case notFoundError.name:
        status = notFoundError.statusCode;
        message = notFoundError.message;
        break;
      }
      res.status(status).send(message);
    });
};

module.exports.likeCard  = (req, res) => {
  const notFoundError = new NotFoundError('Карточка с указанным _id не найдена.');
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
    )
    .then(cards => res.send(cards))
    .catch((err) => {
      let status = 500;
      let message = 'Произошла ошибка';
      switch(err.name) {
      case notFoundError.name:
        status = notFoundError.statusCode;
        message = notFoundError.message;
        break;
      }
      res.status(status).send(message);
    });
};

module.exports.dislikeCard  = (req, res) => {
  const notFoundError = new NotFoundError('Карточка с указанным _id не найдена.');
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
    )
    .then(cards => res.send(cards))
    .catch((err) => {
      let status = 500;
      let message = 'Произошла ошибка';
      switch(err.name) {
      case notFoundError.name:
        status = notFoundError.statusCode;
        message = notFoundError.message;
        break;
      }
      res.status(status).send(message);
    });
};