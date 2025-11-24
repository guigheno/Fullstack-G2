const repo = require('../repositories/customer.repository');
const { NotFoundError } = require('../utils/httpErrors');

async function list(paging, qs) { return repo.findAll({ ...paging, qs }); }

async function getById(id) {
  const c = await repo.findById(id);
  if (!c) throw new NotFoundError('Cliente não encontrado.');
  return c;
}

async function create(data) { return repo.create(data); }
async function update(id, data) { await getById(id); return repo.update(id, data); }
async function remove(id) { await getById(id); return repo.remove(id); }

module.exports = { list, getById, create, update, remove };
