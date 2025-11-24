const { prisma } = require('../config/prisma');

async function findByCustomer(customerId) {
  return prisma.address.findMany({ where: { customerId }, orderBy: { id: 'asc' } });
}
async function create(customerId, data) {
  return prisma.address.create({ data: { ...data, customerId } });
}
async function update(id, data) {
  return prisma.address.update({ where: { id }, data });
}
async function remove(id) {
  return prisma.address.delete({ where: { id } });
}
async function findById(id) {
  return prisma.address.findUnique({ where: { id } });
}

module.exports = { findByCustomer, create, update, remove, findById };
