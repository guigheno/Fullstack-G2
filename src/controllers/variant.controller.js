const service = require('../services/variant.service');

async function add(req, res, next) {
  try {
    const { productId } = req.params;
    const created = await service.add(productId, req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const { variantId } = req.params;
    const updated = await service.update(variantId, req.body);
    res.json(updated);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    const { variantId } = req.params;
    await service.remove(variantId);
    res.json({ message: 'Variant removida com sucesso.' });
  } catch (e) { next(e); }
}

module.exports = { add, update, remove };
