const bcrypt = require('bcryptjs');
const users = require('../repositories/user.repository');
const { prisma } = require('../config/prisma');
const { AppError } = require('../utils/httpErrors');

function normalizeEmail(v) {
  return String(v || '').trim().toLowerCase();
}

async function register({ name, email, password, role, customerId, customer }) {
  const normEmail = normalizeEmail(email);

  const exists = await users.findByEmail(normEmail);
  if (exists) throw new AppError('E-mail já cadastrado.', 409);

  const passwordHash = await bcrypt.hash(String(password), 10);

  const createdUser = await prisma.user.create({
    data: {
      name: name ?? null,
      email: normEmail,
      passwordHash,
      role: role || 'CUSTOMER',
      customerId: customerId ?? null,
    },
    select: { id: true, name: true, email: true, role: true, customerId: true, createdAt: true },
  });

  let createdCustomer = null;

  if (createdUser.role === 'CUSTOMER' && !createdUser.customerId) {
    const cPayload = {
      name: customer?.name ?? name ?? '',
      email: normalizeEmail(customer?.email ?? normEmail),
      phone: customer?.phone ?? null,
    };

    createdCustomer = await prisma.customer.create({ data: cPayload });

    const updatedUser = await prisma.user.update({
      where: { id: createdUser.id },
      data: { customerId: createdCustomer.id },
      select: { id: true, name: true, email: true, role: true, customerId: true, createdAt: true },
    });

    return { user: updatedUser, customer: createdCustomer };
  }

  return { user: createdUser, customer: createdCustomer };
}

async function login({ email, password }) {
  const normEmail = normalizeEmail(email);
  const user = await users.findByEmail(normEmail);
  if (!user) throw new AppError('Credenciais inválidas.', 401);

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) throw new AppError('Credenciais inválidas.', 401);

  const safe = { id: user.id, name: user.name, email: user.email, role: user.role, customerId: user.customerId };
  return { user: safe };
}

module.exports = { register, login };
