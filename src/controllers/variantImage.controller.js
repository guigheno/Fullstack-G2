const service = require('../services/variantImage.service');

async function add(req, res, next) {
  try {
    const { variantId } = req.params;
    const created = await service.add(variantId, req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const { imageId } = req.params;
    const updated = await service.update(imageId, req.body);
    res.json(updated);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    const { imageId } = req.params;
    await service.remove(imageId);
    res.json({ message: 'Imagem de variant removida com sucesso.' });
  } catch (e) { next(e); }
}

module.exports = { add, update, remove };
