const { prisma } = require('../config/prisma');

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function create({ name, email, passwordHash, role, customerId }) {
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role || 'CUSTOMER',
      customerId: customerId ?? null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      customerId: true,
      createdAt: true,
    },
  });
}

async function update(id, data) {
  const payload = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.email !== undefined) payload.email = data.email;
  if (data.passwordHash !== undefined) payload.passwordHash = data.passwordHash;
  if (data.role !== undefined) payload.role = data.role;
  if (data.customerId !== undefined) payload.customerId = data.customerId;

  return prisma.user.update({
    where: { id: Number(id) },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      customerId: true,
      createdAt: true,
    },
  });
}

async function remove(id) {
  return prisma.user.delete({
    where: { id: Number(id) },
    select: { id: true, email: true },
  });
}

async function findAll() {
  return prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      customerId: true,
      createdAt: true,
    },
  });
}

module.exports = {
  findAll,
  findByEmail,
  findById,
  create,
  update,
  remove,
};
