const repo = require('../repositories/product.repository.v2');
const { prisma } = require('../config/prisma');
const { NotFoundError, AppError } = require('../utils/httpErrors');

async function add(productId, data) {
  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) throw new NotFoundError('Produto não encontrado.');

  if (data.sku) {
    const exists = await prisma.productVariant.findUnique({ where: { sku: data.sku } });
    if (exists) throw new AppError('SKU já existe.', 400);
  }

  return repo.createVariant(productId, data);
}

async function update(variantId, data) {
  const v = await repo.findVariantById(variantId);
  if (!v) throw new NotFoundError('Variant não encontrada.');
  if (data.sku) {
    const exists = await prisma.productVariant.findUnique({ where: { sku: data.sku } });
    if (exists && exists.id !== Number(variantId)) {
      throw new AppError('SKU já existe.', 400);
    }
  }
  return repo.updateVariant(variantId, data);
}

async function remove(variantId) {
  const v = await repo.findVariantById(variantId);
  if (!v) throw new NotFoundError('Variant não encontrada.');
  return repo.deleteVariant(variantId);
}

module.exports = { add, update, remove };
