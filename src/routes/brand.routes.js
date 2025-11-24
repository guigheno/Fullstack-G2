const { Router } = require('express');
const ctrl = require('../controllers/brand.controller');
const { validate } = require('../middlewares/validate.middleware');
const { idParamSchema, createBrandSchema, updateBrandSchema, listBrandQuerySchema } = require('../validators/brand.validators');

const r = Router();

r.get('/', validate(listBrandQuerySchema, 'query'), ctrl.list);
r.get('/:id', validate(idParamSchema, 'params'), ctrl.getById);
r.post('/', validate(createBrandSchema), ctrl.create);
r.put('/:id', validate(idParamSchema, 'params'), validate(updateBrandSchema), ctrl.update);
r.delete('/:id', validate(idParamSchema, 'params'), ctrl.remove);

module.exports = r;
