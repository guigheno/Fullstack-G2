const { Router } = require('express');
const ctrl = require('../controllers/category.controller');
const { validate } = require('../middlewares/validate.middleware');
const {
  idParamSchema, createCategorySchema, updateCategorySchema, listCategoryQuerySchema
} = require('../validators/category.validators');

const r = Router();
r.get('/', validate(listCategoryQuerySchema,'query'), ctrl.list);
r.get('/:id', validate(idParamSchema,'params'), ctrl.getById);
r.post('/', validate(createCategorySchema), ctrl.create);
r.put('/:id', validate(idParamSchema,'params'), validate(updateCategorySchema), ctrl.update);
r.delete('/:id', validate(idParamSchema,'params'), ctrl.remove);
module.exports = r;
