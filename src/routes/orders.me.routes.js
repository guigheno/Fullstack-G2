const { Router } = require('express');
const { prisma } = require('../config/prisma');

const r = Router();

r.get('/', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(401).json({ error: 'customerId não encontrado' });

    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: true, variant: true } },
        shippingAddress: true,
      },
    });
    res.json(orders);
  } catch (err) { next(err); }
});

r.get('/:id', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(401).json({ error: 'customerId não encontrado' });

    const id = Number(req.params.id);
    const order = await prisma.order.findFirst({
      where: { id, customerId },
      include: {
        items: { include: { product: true, variant: true } },
        shippingAddress: true,
      },
    });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  } catch (err) { next(err); }
});

module.exports = r;
