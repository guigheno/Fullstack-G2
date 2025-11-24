const repo = require('../repositories/brand.repository');
const { NotFoundError } = require('../utils/httpErrors');

async function list(paging) {
  return repo.findAll(paging);
}

async function getById(id) {
  const x = await repo.findById(id);
  if (!x) throw new NotFoundError('Brand não encontrada.');
  return x;
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
