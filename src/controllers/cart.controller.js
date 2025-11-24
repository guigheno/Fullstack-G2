const service = require('../services/cart.service');

async function start(req, res, next) {
  try {
    const out = await service.startCart(Number(req.body.customerId));
    res.status(201).json(out);
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const out = await service.getCart(Number(req.params.cartId));
    res.json(out);
  } catch (e) { next(e); }
}

async function addItem(req, res, next) {
  try {
    const cartId = Number(req.params.cartId);
    const out = await service.addItem(cartId, req.body);
    res.status(201).json(out);
  } catch (e) { next(e); }
}

async function updateItem(req, res, next) {
  try {
    const out = await service.updateItem(Number(req.params.itemId), req.body);
    res.json(out);
  } catch (e) { next(e); }
}

async function removeItem(req, res, next) {
  try {
    await service.removeItem(Number(req.params.itemId));
    res.json({ message: 'Item removido com sucesso.' });
  } catch (e) { next(e); }
}

async function listItems(req, res, next) {
  try {
    const items = await service.listItems(Number(req.params.cartId));
    res.json(items);
  } catch (e) { next(e); }
}

async function checkout(req, res, next) {
  try {
    const order = await service.checkout(Number(req.params.cartId), Number(req.body.shippingAddressId));
    res.status(201).json(order);
  } catch (e) { next(e); }
}

module.exports = { start, getById, addItem, updateItem, removeItem, listItems, checkout };
