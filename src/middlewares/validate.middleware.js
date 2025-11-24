function validate(schema, target = 'body') {
  return (req, _res, next) => {
    try {
      schema.parse({ [target]: req[target] });
      next();
    } catch (err) {
      if (err?.issues) {
        return next({ status: 400, message: 'Validação falhou', details: err.issues });
      }
      next(err);
    }
  };
}

module.exports = { validate };
