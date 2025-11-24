const { prisma } = require('../config/prisma');

function buildWhere(qs = {}) {
  const where = {};
  if (qs.q && qs.q.trim()) {
    where.OR = [
      { name: { contains: qs.q } },
      { email: { contains: qs.q } },
      { phone: { contains: qs.q } },
    ];
  }
  return where;
}

async function findAll({ skip, take, orderBy, qs } = {}) {
  const where = buildWhere(qs);
  const [items, total] = await Promise.all([
    prisma.customer.findMany({ where, skip, take, orderBy: orderBy || { id: 'asc' } }),
    prisma.customer.count({ where }),
  ]);
  return { items, total };
}

async function findById(id) {
  return prisma.customer.findUnique({
    where: { id },
    include: { addresses: true, orders: true },
  });
}

async function create(data) {
  return prisma.customer.create({ data });
}

async function update(id, data) {
  return prisma.customer.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.customer.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
