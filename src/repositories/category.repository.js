const { prisma } = require('../config/prisma');

async function findAll({ skip, take, orderBy } = {}) {
  const [items, total] = await Promise.all([
    prisma.category.findMany({ skip, take, orderBy: orderBy || { id: 'asc' } }),
    prisma.category.count(),
  ]);
  return { items, total };
}

async function findById(id) { return prisma.category.findUnique({ where: { id } }); }
async function create({ name }) { return prisma.category.create({ data: { name } }); }
async function update(id, { name }) { return prisma.category.update({ where: { id }, data: { name } }); }
async function remove(id) { return prisma.category.delete({ where: { id } }); }

module.exports = { findAll, findById, create, update, remove };
