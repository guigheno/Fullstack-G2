const service = require('../services/user.service');

async function list(_req, res, next) {
  try {
    const usuarios = await service.list();
    return res.json(usuarios);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const usuario = await service.getById(id);
    return res.json(usuario);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const novo = await service.create(req.body);
    return res.status(201).json(novo);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const atualizado = await service.update(id, req.body);
    return res.json(atualizado);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await service.remove(id);
    return res.json({ message: 'Usuário removido com sucesso.' });
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };
