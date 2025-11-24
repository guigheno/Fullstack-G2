const { Router } = require('express');
const ctrl = require('../controllers/customer.controller');
const { validate } = require('../middlewares/validate.middleware');
const { idParam, createCustomer, updateCustomer, listCustomerQuery } = require('../validators/customer.validators');

const r = Router();
r.get('/', validate(listCustomerQuery,'query'), ctrl.list);
r.get('/:id', validate(idParam,'params'), ctrl.getById);
r.post('/', validate(createCustomer), ctrl.create);
r.put('/:id', validate(idParam,'params'), validate(updateCustomer), ctrl.update);
r.delete('/:id', validate(idParam,'params'), ctrl.remove);

module.exports = r;
