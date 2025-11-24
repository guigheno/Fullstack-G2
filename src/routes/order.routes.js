const { Router } = require('express');
const ctrl = require('../controllers/order.controller');
const { validate } = require('../middlewares/validate.middleware');
const { idParam, listOrderQuery, createOrder, updateStatus } = require('../validators/order.validators');

const r = Router();

r.get('/', validate(listOrderQuery,'query'), ctrl.list);
r.get('/:id', validate(idParam,'params'), ctrl.getById);
r.post('/', validate(createOrder), ctrl.create);
r.put('/:id/status', validate(idParam,'params'), validate(updateStatus), ctrl.updateStatus);
r.delete('/:id', validate(idParam,'params'), ctrl.remove);

module.exports = r;
