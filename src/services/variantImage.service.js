const repo = require('../repositories/product.repository.v2');
const { prisma } = require('../config/prisma');
const { NotFoundError } = require('../utils/httpErrors');

async function add(variantId, data) {
  const variant = await prisma.productVariant.findUnique({ where: { id: Number(variantId) } });
  if (!variant) throw new NotFoundError('Variant não encontrada.');

  if (data.isPrimary) {
    await prisma.variantImage.updateMany({
      where: { variantId: Number(variantId), isPrimary: true },
      data: { isPrimary: false },
    });
  }
  return repo.createVariantImage(variantId, data);
}

async function update(imageId, data) {
  const img = await repo.findVariantImageById(imageId);
  if (!img) throw new NotFoundError('Imagem da variant não encontrada.');

  if (data.isPrimary) {
    await prisma.variantImage.updateMany({
      where: { variantId: img.variantId, isPrimary: true, NOT: { id: Number(imageId) } },
      data: { isPrimary: false },
    });
  }
  return repo.updateVariantImage(imageId, data);
}

async function remove(imageId) {
  const img = await repo.findVariantImageById(imageId);
  if (!img) throw new NotFoundError('Imagem da variant não encontrada.');
  return repo.deleteVariantImage(imageId);
}

module.exports = { add, update, remove };
