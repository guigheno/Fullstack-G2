const { Router } = require('express');
const { prisma } = require('../config/prisma');

const r = Router();

r.get('/', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(400).json({ error: 'customerId required' });

    const items = await prisma.address.findMany({
      where: { customerId },
      orderBy: { id: 'asc' },
    });
    res.json(items);
  } catch (err) { next(err); }
});

r.post('/', async (req, res, next) => {
  try {
    const customerId = Number(req.user?.customerId);
    if (!customerId) return res.status(400).json({ error: 'customerId required' });

    const {
      street,
      number,
      complement,
      district,
      city,
      state,
      zipCode,
      zip,
    } = req.body;

    const payload = {
      street,
      number: number ?? null,
      complement: complement ?? null,
      district,
      city,
      state,
      zipCode: String(zipCode ?? zip ?? ''),
      customerId,
    };

    if (!payload.street || !payload.district || !payload.city || !payload.state || !payload.zipCode) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const created = await prisma.address.create({ data: payload });
    res.status(201).json(created);
  } catch (err) { next(err); }
});

module.exports = r;
