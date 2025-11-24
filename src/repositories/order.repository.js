const { prisma } = require('../config/prisma');

function buildWhere(qs = {}) {
  const where = {};
  if (qs.customerId) where.customerId = Number(qs.customerId);
  return where;
}

async function findAll({ skip, take, orderBy, qs } = {}) {
  const where = buildWhere(qs);
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { customer: true, shippingAddress: true, items: true },
      skip, take, orderBy: orderBy || { id: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);
  return { items, total };
}

async function findById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: { customer: true, shippingAddress: true, items: true },
  });
}

async function create(data, items) {
  return prisma.order.create({
    data: {
      ...data,
      items: { create: items },
    },
    include: { items: true },
  });
}

async function updateStatus(id, status) {
  return prisma.order.update({ where: { id }, data: { status } });
}

async function remove(id) {
  return prisma.order.delete({ where: { id } });
}

module.exports = { findAll, findById, create, updateStatus, remove };
