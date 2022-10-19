const Card = require('../models/card');

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/errorcodes');

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => {
      res.status(CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Некорректные данные при создании карточки',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Некорректные данные для удаления карточки',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(OK).send(card))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      }
      return res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Некорректные данные для лайка карточки',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.delLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      }
      return res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Некорректные данные для снятия лайка' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка по-умолчанию' });
    });
};
