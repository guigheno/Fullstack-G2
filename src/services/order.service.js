const repo = require('../repositories/order.repository');
const { prisma } = require('../config/prisma');
const { NotFoundError, AppError } = require('../utils/httpErrors');

async function prepareItemsAndTotal(items) {
  let total = 0;
  const prepared = [];

  for (const it of items) {
    const product = await prisma.product.findUnique({ where: { id: Number(it.productId) } });
    if (!product) throw new AppError(`Produto inválido: ${it.productId}`, 400);

    if (it.variantId !== undefined && it.variantId !== null) {
      const variant = await prisma.productVariant.findUnique({ where: { id: Number(it.variantId) } });
      if (!variant || variant.productId !== product.id) {
        throw new AppError(`Variant inválida ou não pertence ao produto: variantId=${it.variantId}`, 400);
      }
      if (variant.stock < Number(it.quantity)) {
        throw new AppError(`Estoque insuficiente para SKU: ${variant.sku}`, 400);
      }
    }

    const lineTotal = Number(it.quantity) * Number(it.unitPrice);
    total += lineTotal;

    prepared.push({
      productId: Number(it.productId),
      variantId: it.variantId !== undefined ? Number(it.variantId) : null,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unitPrice),
    });
  }

  return { total, prepared };
}

async function create(data) {
  const customerId = Number(data.customerId);
  const shippingAddressId = Number(data.shippingAddressId);

  const [customer, address] = await Promise.all([
    prisma.customer.findUnique({ where: { id: customerId } }),
    prisma.address.findUnique({ where: { id: shippingAddressId } }),
  ]);
  if (!customer) throw new NotFoundError('Cliente não encontrado.');
  if (!address || address.customerId !== customerId) {
    throw new AppError('Endereço de entrega inválido para este cliente.', 400);
  }

  const { total, prepared } = await prepareItemsAndTotal(data.items);

  const created = await prisma.$transaction(async (tx) => {
    for (const it of prepared) {
      if (it.variantId) {
        await tx.productVariant.update({
          where: { id: it.variantId },
          data: { stock: { decrement: it.quantity } },
        });
      }
    }
    return tx.order.create({
      data: {
        customerId,
        shippingAddressId,
        status: 'PENDING',
        total,
        items: { create: prepared },
      },
      include: { items: true },
    });
  });

  return created;
}

async function list(paging, qs) { return repo.findAll({ ...paging, qs }); }

async function getById(id) {
  const o = await repo.findById(id);
  if (!o) throw new NotFoundError('Pedido não encontrado.');
  return o;
}

async function updateStatus(id, status) {
  await getById(id);
  return repo.updateStatus(id, status);
}

async function remove(id) {
  await getById(id);
  return repo.remove(id);
}

module.exports = { create, list, getById, updateStatus, remove };
