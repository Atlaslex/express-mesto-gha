const log = (req, res, next) => {
  console.log(' я здесь');
  next();
};
module.exports = { log };
