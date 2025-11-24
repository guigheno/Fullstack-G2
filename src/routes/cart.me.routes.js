const { Router } = require('express');
const { prisma } = require('../config/prisma');

const r = Router();

async function getOrCreateCart(customerId) {
  const found = await prisma.cart.findFirst({ where: { customerId } });
  if (found) return found;
  return prisma.cart.create({ data: { customerId } });
}

function getVariantModelFrom(db) {
  if (db.variant) return db.variant;
  if (db.productVariant) return db.productVariant;
  if (db.variants) return db.variants;
  return null;
}
async function findVariantByIdWith(db, id) {
  const Model = getVariantModelFrom(db);
  if (!Model) throw new Error('Modelo de Variante não encontrado no Prisma');
  return Model.findUnique({ where: { id: Number(id) } });
}
async function decrementVariantStockWith(db, id, qty) {
  const Model = getVariantModelFrom(db);
  if (!Model) throw new Error('Modelo de Variante não encontrado no Prisma');
  return Model.update({
    where: { id: Number(id) },
    data: { stock: { decrement: Number(qty) } },
  });
}

r.get('/', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(401).json({ error: 'customerId não encontrado' });

    const cart = await getOrCreateCart(customerId);
    const full = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true, variant: true } } },
    });
    return res.json(full);
  } catch (err) { next(err); }
});

r.post('/start', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(401).json({ error: 'customerId não encontrado' });
    const cart = await getOrCreateCart(customerId);
    return res.json(cart);
  } catch (err) { next(err); }
});

r.post('/items', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(401).json({ error: 'customerId não encontrado' });

    const { productId, variantId = null, quantity } = req.body || {};
    const qty = Math.max(1, Number(quantity || 1));
    if (!productId) return res.status(400).json({ error: 'productId é obrigatório' });

    const cart = await getOrCreateCart(customerId);

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

    if (variantId) {
      const v = await findVariantByIdWith(prisma, variantId);
      if (!v) return res.status(404).json({ error: 'Variante não encontrada' });
      if (Number(v.productId) !== Number(product.id)) {
        return res.status(400).json({ error: 'Variante não pertence ao produto' });
      }
      if (Number(v.stock) < qty) return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    const unitPrice = product.price;

    const created = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: Number(productId),
        variantId: variantId ? Number(variantId) : null,
        quantity: qty,
        unitPrice,
      },
      include: { product: true, variant: true },
    });

    return res.status(201).json(created);
  } catch (err) { next(err); }
});

r.put('/items/:id', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(401).json({ error: 'customerId não encontrado' });

    const id = Number(req.params.id);
    const { quantity } = req.body || {};
    const qty = Math.max(1, Number(quantity || 1));

    const cart = await getOrCreateCart(customerId);

    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { variant: true },
    });
    if (!item || item.cartId !== cart.id) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    if (item.variantId) {
      const v = await findVariantByIdWith(prisma, item.variantId);
      if (!v || Number(v.stock) < qty) return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: qty },
      include: { product: true, variant: true },
    });

    return res.json(updated);
  } catch (err) { next(err); }
});

r.delete('/items/:id', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(401).json({ error: 'customerId não encontrado' });

    const id = Number(req.params.id);
    const cart = await getOrCreateCart(customerId);

    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.cartId !== cart.id) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    await prisma.cartItem.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) { next(err); }
});

r.post('/checkout', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(401).json({ error: 'customerId não encontrado' });

    const { addressId } = req.body || {};
    if (!addressId) return res.status(400).json({ error: 'addressId é obrigatório' });

    const cart = await getOrCreateCart(customerId);

    const full = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });
    if (!full || full.items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    const addr = await prisma.address.findUnique({ where: { id: Number(addressId) } });
    if (!addr || Number(addr.customerId) !== customerId) {
      return res.status(400).json({ error: 'Endereço inválido para este cliente' });
    }

    const order = await prisma.$transaction(async (tx) => {
      for (const it of full.items) {
        if (it.variantId) {
          const v = await findVariantByIdWith(tx, it.variantId);
          if (!v || Number(v.stock) < it.quantity) {
            throw new Error('Estoque insuficiente');
          }
          await decrementVariantStockWith(tx, it.variantId, it.quantity);
        }
      }

      const total = full.items.reduce((acc, i) => acc + Number(i.unitPrice) * i.quantity, 0);

      const createdOrder = await tx.order.create({
        data: {
          total,
          status: 'PENDING',
          customer: { connect: { id: customerId } },
          shippingAddress: { connect: { id: Number(addressId) } },
          items: {
            create: full.items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          },
        },
        include: { items: { include: { product: true, variant: true } } },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });

    return res.status(201).json(order);
  } catch (err) { next(err); }
});

module.exports = r;
