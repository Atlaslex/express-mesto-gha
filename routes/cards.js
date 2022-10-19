const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  delLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLikeCard);
router.delete('/:cardId/likes', delLikeCard);

module.exports = router;
