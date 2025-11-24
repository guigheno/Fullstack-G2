const repo = require('../repositories/product.repository.v2');
const { prisma } = require('../config/prisma');
const { NotFoundError } = require('../utils/httpErrors');

async function add(productId, data) {
  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) throw new NotFoundError('Produto não encontrado.');

  if (data.isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId: Number(productId), isPrimary: true },
      data: { isPrimary: false },
    });
  }
  return repo.createImage(productId, data);
}

async function update(imageId, data) {
  const img = await repo.findImageById(imageId);
  if (!img) throw new NotFoundError('Imagem não encontrada.');

  if (data.isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId: img.productId, isPrimary: true, NOT: { id: Number(imageId) } },
      data: { isPrimary: false },
    });
  }
  return repo.updateImage(imageId, data);
}

async function remove(imageId) {
  const img = await repo.findImageById(imageId);
  if (!img) throw new NotFoundError('Imagem não encontrada.');
  return repo.deleteImage(imageId);
}

module.exports = { add, update, remove };
