const repo = require('../repositories/user.repository');
const { NotFoundError } = require('../utils/httpErrors');

async function list() {
  return repo.findAll();
}

async function getById(id) {
  const item = await repo.findById(id);
  if (!item) throw new NotFoundError('Usuário não encontrado.');
  return item;
}

async function create(data) {
  return repo.create(data);
}

async function update(id, data) {
  await getById(id);
  return repo.update(id, data);
}

async function remove(id) {
  await getById(id);
  return repo.remove(id);
}

module.exports = { list, getById, create, update, remove };
