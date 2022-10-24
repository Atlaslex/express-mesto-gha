const mongoose = require('mongoose');
const {
  cardNameValidator,
  cardLinkValidator,
} = require('../validators/validators');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: cardNameValidator,
  },
  link: {
    type: String,
    required: true,
    validate: cardLinkValidator,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
