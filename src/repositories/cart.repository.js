const { prisma } = require('../config/prisma');

async function findActiveByCustomer(customerId) {
  return prisma.cart.findFirst({
    where: { customerId, status: 'ACTIVE' },
    include: { items: true },
  });
}

async function createCart(customerId) {
  return prisma.cart.create({
    data: { customerId, status: 'ACTIVE' },
    include: { items: true },
  });
}

async function findById(cartId) {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: true,
      customer: true,
    },
  });
}

async function addItem(cartId, { productId, variantId, quantity, unitPrice }) {
  return prisma.cartItem.create({
    data: {
      cartId,
      productId,
      variantId: variantId ?? null,
      quantity,
      unitPrice,
    },
  });
}

async function updateItem(itemId, data) {
  return prisma.cartItem.update({
    where: { id: itemId },
    data,
  });
}

async function deleteItem(itemId) {
  return prisma.cartItem.delete({ where: { id: itemId } });
}

async function listItems(cartId) {
  return prisma.cartItem.findMany({
    where: { cartId },
    include: { product: true, variant: true },
    orderBy: { id: 'asc' },
  });
}

async function updateCartStatus(cartId, status) {
  return prisma.cart.update({
    where: { id: cartId },
    data: { status },
  });
}

module.exports = {
  findActiveByCustomer,
  createCart,
  findById,
  addItem,
  updateItem,
  deleteItem,
  listItems,
  updateCartStatus,
};
