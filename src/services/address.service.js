const repo = require('../repositories/address.repository');
const { prisma } = require('../config/prisma');
const { NotFoundError } = require('../utils/httpErrors');

async function listByCustomer(customerId) {
  const c = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!c) throw new NotFoundError('Cliente não encontrado.');
  return repo.findByCustomer(customerId);
}

async function create(customerId, data) {
  const c = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!c) throw new NotFoundError('Cliente não encontrado.');
  return repo.create(customerId, data);
}

async function update(id, data) {
  const a = await repo.findById(id);
  if (!a) throw new NotFoundError('Endereço não encontrado.');
  return repo.update(id, data);
}

async function remove(id) {
  const a = await repo.findById(id);
  if (!a) throw new NotFoundError('Endereço não encontrado.');
  return repo.remove(id);
}

module.exports = { listByCustomer, create, update, remove };
