const service = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const out = await service.register(req.body);
    res.status(201).json(out);
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const out = await service.login(req.body);
    res.json(out);
  } catch (e) { next(e); }
}

module.exports = { register, login };
