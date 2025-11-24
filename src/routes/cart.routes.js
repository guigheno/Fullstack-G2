const { Router } = require('express');
const ctrl = require('../controllers/cart.controller');
const { validate } = require('../middlewares/validate.middleware');
const {
  cartIdParam,
  itemIdParam,
  startCartSchema,
  addItemSchema,
  updateItemQtySchema,
  checkoutSchema,
} = require('../validators/cart.validators');

const r = Router();

r.post('/carts/start', validate(startCartSchema), ctrl.start);

r.get('/carts/:cartId', validate(cartIdParam, 'params'), ctrl.getById);

r.get('/carts/:cartId/items', validate(cartIdParam, 'params'), ctrl.listItems);
r.post('/carts/:cartId/items', validate(cartIdParam, 'params'), validate(addItemSchema), ctrl.addItem);
r.put('/carts/items/:itemId', validate(itemIdParam, 'params'), validate(updateItemQtySchema), ctrl.updateItem);
r.delete('/carts/items/:itemId', validate(itemIdParam, 'params'), ctrl.removeItem);

r.post('/carts/:cartId/checkout', validate(cartIdParam, 'params'), validate(checkoutSchema), ctrl.checkout);

module.exports = r;
