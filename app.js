const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routesCard = require('./routes/cards');
const routesUser = require('./routes/users');
const { NOT_FOUND } = require('./errors/errorcodes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '634f3431a9fe1ac62ed8b849',
  };

  next();
});
app.use('/users', routesUser);
app.use('/cards', routesCard);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log('Приложение запущено, используется порт PORT.');
});
