const { prisma } = require('../config/prisma');
const repo = require('../repositories/cart.repository');
const { AppError, NotFoundError } = require('../utils/httpErrors');

async function startCart(customerId) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) throw new NotFoundError('Cliente não encontrado.');

  const existing = await repo.findActiveByCustomer(customerId);
  if (existing) return existing;

  return repo.createCart(customerId);
}

async function getCart(cartId) {
  const cart = await repo.findById(cartId);
  if (!cart) throw new NotFoundError('Carrinho não encontrado.');
  return cart;
}

async function resolveUnitPrice(productId, variantId) {
  if (variantId) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant || variant.productId !== productId) {
      throw new AppError('Variant inválida ou não pertence ao produto.', 400);
    }
    if (variant.price !== null && variant.price !== undefined) return Number(variant.price);
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Produto inválido.', 400);
  return Number(product.price);
}

async function addItem(cartId, { productId, variantId, quantity, unitPrice }) {
  const cart = await getCart(cartId);
  if (cart.status !== 'ACTIVE') throw new AppError('Carrinho não está ativo.', 400);

  if (variantId) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant || variant.productId !== productId) {
      throw new AppError('Variant inválida ou não pertence ao produto.', 400);
    }
    if (variant.stock < Number(quantity)) {
      throw new AppError('Estoque insuficiente para a variant selecionada.', 400);
    }
  }

  const price = unitPrice !== undefined ? Number(unitPrice) : await resolveUnitPrice(productId, variantId);

  return repo.addItem(cartId, { productId, variantId, quantity: Number(quantity), unitPrice: price });
}

async function updateItem(itemId, { quantity, unitPrice }) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) throw new NotFoundError('Item do carrinho não encontrado.');

  if (item.variantId) {
    const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
    if (!variant) throw new AppError('Variant inválida.', 400);
    if (variant.stock < Number(quantity)) {
      throw new AppError('Estoque insuficiente para a variant selecionada.', 400);
    }
  }

  const data = { quantity: Number(quantity) };
  if (unitPrice !== undefined) data.unitPrice = Number(unitPrice);

  return repo.updateItem(itemId, data);
}

async function removeItem(itemId) {
  await getCartIdByItemOrThrow(itemId);
  return repo.deleteItem(itemId);
}

async function getCartIdByItemOrThrow(itemId) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) throw new NotFoundError('Item do carrinho não encontrado.');
  return item.cartId;
}

async function listItems(cartId) {
  await getCart(cartId);
  return repo.listItems(cartId);
}

async function checkout(cartId, shippingAddressId) {
  const cart = await getCart(cartId);
  if (cart.status !== 'ACTIVE') throw new AppError('Carrinho não está ativo.', 400);

  const address = await prisma.address.findUnique({ where: { id: shippingAddressId } });
  if (!address || address.customerId !== cart.customerId) {
    throw new AppError('Endereço de entrega inválido para este cliente.', 400);
  }

  const items = await repo.listItems(cartId);
  if (!items.length) throw new AppError('Carrinho vazio.', 400);

  let total = 0;
  for (const it of items) {
    if (it.variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: it.variantId } });
      if (!variant || variant.stock < it.quantity) {
        throw new AppError('Estoque insuficiente para um dos itens.', 400);
      }
    }
    total += Number(it.unitPrice) * Number(it.quantity);
  }

  const order = await prisma.$transaction(async (tx) => {
    for (const it of items) {
      if (it.variantId) {
        await tx.productVariant.update({
          where: { id: it.variantId },
          data: { stock: { decrement: it.quantity } },
        });
      }
    }

    const createdOrder = await tx.order.create({
      data: {
        customerId: cart.customerId,
        shippingAddressId,
        status: 'PENDING',
        total,
        items: {
          create: items.map((it) => ({
            productId: it.productId,
            variantId: it.variantId ?? null,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    await tx.cart.update({ where: { id: cart.id }, data: { status: 'ORDERED' } });
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createdOrder;
  });

  return order;
}

module.exports = {
  startCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  listItems,
  checkout,
};
