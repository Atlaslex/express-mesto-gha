const user = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

user.get('/users', getUsers);
user.get('/users/:id', getUserById);
user.post('/users', createUser);

module.exports = user;
