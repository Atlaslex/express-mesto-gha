module.exports.errorHandler = ((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: 'Что-то пошло не так(сообщение центрального обработчика ошибок)' });
  next();
});
