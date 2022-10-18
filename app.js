
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');


const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '634f3431a9fe1ac62ed8b849'
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  });