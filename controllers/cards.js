const BadRequestError = require('../errors/ErrorBadRequest');
const BadRequireToken = require('../errors/TokenBadRequire');
const NotFoundError = require('../errors/ErrorNotFound');

const Card = require('../models/card');

const {
  CORRECT_CODE,
  CREATE_CODE,
} = require('../utils/correctcodes');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user.id,
  })
    .then((card) => {
      res.status(CREATE_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.status(CORRECT_CODE).send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user.id)) {
        throw new BadRequireToken();
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((cards) => {
      res.status(CORRECT_CODE).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      return res.status(CORRECT_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

module.exports.delLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      return res.status(CORRECT_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};
