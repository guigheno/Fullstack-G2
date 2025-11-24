const repo = require('../repositories/product.repository.v2');
const { prisma } = require('../config/prisma');
const { NotFoundError, AppError } = require('../utils/httpErrors');

async function list(paging, qs) { 
  return repo.findAll({ ...paging, qs }); 
}

async function getById(id) {
  const x = await repo.findById(id);
  if (!x) throw new NotFoundError('Produto não encontrado.');
  return x;
}

async function create(data) {
  const [brand, category, supplier] = await Promise.all([
    prisma.brand.findUnique({ where: { id: Number(data.brandId) } }),
    prisma.category.findUnique({ where: { id: Number(data.categoryId) } }),
    data.supplierId ? prisma.supplier.findUnique({ where: { id: Number(data.supplierId) } }) : Promise.resolve(null),
  ]);
  
  if (!brand) throw new AppError('brandId inválido: marca não encontrada.', 400);
  if (!category) throw new AppError('categoryId inválido: categoria não encontrada.', 400);
  if (data.supplierId && !supplier) throw new AppError('supplierId inválido: fornecedor não encontrado.', 400);

  return repo.create(data);
}

async function update(id, data) {
  await getById(id);
  
  const validations = [];
  
  if (data.brandId !== undefined) {
    validations.push(
      prisma.brand.findUnique({ where: { id: Number(data.brandId) } })
        .then(brand => { if (!brand) throw new AppError('brandId inválido: marca não encontrada.', 400); })
    );
  }
  
  if (data.categoryId !== undefined) {
    validations.push(
      prisma.category.findUnique({ where: { id: Number(data.categoryId) } })
        .then(category => { if (!category) throw new AppError('categoryId inválido: categoria não encontrada.', 400); })
    );
  }
  
  if (data.supplierId !== undefined) {
    validations.push(
      data.supplierId 
        ? prisma.supplier.findUnique({ where: { id: Number(data.supplierId) } })
            .then(supplier => { if (!supplier) throw new AppError('supplierId inválido: fornecedor não encontrado.', 400); })
        : Promise.resolve() // supplierId null é válido
    );
  }

  await Promise.all(validations);
  return repo.update(id, data);
}

async function remove(id) { 
  await getById(id); 
  return repo.remove(id); 
}

module.exports = { list, getById, create, update, remove };