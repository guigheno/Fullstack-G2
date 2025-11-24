const { Router } = require('express');
const ctrl = require('../controllers/address.controller');
const { validate } = require('../middlewares/validate.middleware');
const { customerIdParam, addressIdParam, createAddress, updateAddress } = require('../validators/address.validators');

const r = Router();

r.get('/customers/:customerId/addresses', validate(customerIdParam,'params'), ctrl.listByCustomer);
r.post('/customers/:customerId/addresses', validate(customerIdParam,'params'), validate(createAddress), ctrl.create);

r.put('/addresses/:id', validate(addressIdParam,'params'), validate(updateAddress), ctrl.update);
r.delete('/addresses/:id', validate(addressIdParam,'params'), ctrl.remove);

module.exports = r;
