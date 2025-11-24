const { Router } = require('express');
const controller = require('../controllers/user.controller');
const { validate } = require('../middlewares/validate.middleware');

const {
  createUserSchema,
  updateUserProfileSchema,
  idParamSchema,
} = require('../validators/user.validators');

const router = Router();

router.get('/', controller.list);

router.get('/:id', validate(idParamSchema, 'params'), controller.getById);

router.post('/', validate(createUserSchema), controller.create);

router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateUserProfileSchema),
  controller.update
);

router.delete('/:id', validate(idParamSchema, 'params'), controller.remove);

module.exports = router;
