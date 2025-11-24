const { Router } = require('express');
const ctrl = require('../controllers/product.controller.v2');
const vctrl = require('../controllers/variant.controller');
const imgCtrl = require('../controllers/image.controller');
const imgVarCtrl = require('../controllers/variantImage.controller');
const { validate } = require('../middlewares/validate.middleware');

const {
  idParamSchema,
  createProductSchemaV2,
  updateProductSchemaV2,
  listProductQuerySchemaV2,
} = require('../validators/product.validators.v2');

const {
  productIdParam,
  variantIdParam,
  createVariantSchema,
  updateVariantSchema,
} = require('../validators/variant.validators');

const {
  productIdParam: imgProductIdParam,
  imageIdParam,
  createImageSchema,
  updateImageSchema,
} = require('../validators/image.validators');

const {
  variantIdParam: vImgVariantIdParam,
  variantImageIdParam,
  createVariantImageSchema,
  updateVariantImageSchema,
} = require('../validators/variantImage.validators');

const r = Router();

r.get('/', validate(listProductQuerySchemaV2, 'query'), ctrl.list);
r.get('/:id', validate(idParamSchema, 'params'), ctrl.getById);
r.post('/', validate(createProductSchemaV2), ctrl.create);
r.put('/:id', validate(idParamSchema, 'params'), validate(updateProductSchemaV2), ctrl.update);
r.delete('/:id', validate(idParamSchema, 'params'), ctrl.remove);

r.post(
  '/:productId/variants',
  validate(productIdParam, 'params'),
  validate(createVariantSchema),
  vctrl.add
);
r.put(
  '/variants/:variantId',
  validate(variantIdParam, 'params'),
  validate(updateVariantSchema),
  vctrl.update
);
r.delete(
  '/variants/:variantId',
  validate(variantIdParam, 'params'),
  vctrl.remove
);

r.post(
  '/:productId/images',
  validate(imgProductIdParam, 'params'),
  validate(createImageSchema),
  imgCtrl.add
);
r.put(
  '/images/:imageId',
  validate(imageIdParam, 'params'),
  validate(updateImageSchema),
  imgCtrl.update
);
r.delete(
  '/images/:imageId',
  validate(imageIdParam, 'params'),
  imgCtrl.remove
);

r.post(
  '/variants/:variantId/images',
  validate(vImgVariantIdParam, 'params'),
  validate(createVariantImageSchema),
  imgVarCtrl.add
);
r.put(
  '/variants/images/:imageId',
  validate(variantImageIdParam, 'params'),
  validate(updateVariantImageSchema),
  imgVarCtrl.update
);
r.delete(
  '/variants/images/:imageId',
  validate(variantImageIdParam, 'params'),
  imgVarCtrl.remove
);

module.exports = r;
