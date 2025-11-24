const { prisma } = require('../config/prisma');

async function findAll({ skip, take, orderBy } = {}) {
  const [items, total] = await Promise.all([
    prisma.brand.findMany({
      skip, take,
      orderBy: orderBy || { id: 'asc' },
    }),
    prisma.brand.count(),
  ]);
  return { items, total };
}

async function findById(id) {
  return prisma.brand.findUnique({ where: { id } });
}

async function create({ name }) {
  return prisma.brand.create({ data: { name } });
}

async function update(id, { name }) {
  return prisma.brand.update({ where: { id }, data: { name } });
}

async function remove(id) {
  return prisma.brand.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
