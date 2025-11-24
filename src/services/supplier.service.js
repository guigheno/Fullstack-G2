const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os fornecedores
async function list(paging, filters = {}) {
  const { page, pageSize, sortBy, sortOrder } = paging;
  const skip = (page - 1) * pageSize;
  
  const where = {};
  
  // Filtros
  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' };
  }
  if (filters.email) {
    where.email = { contains: filters.email, mode: 'insensitive' };
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === 'true';
  }

  const [items, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      include: {
        products: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    }),
    prisma.supplier.count({ where })
  ]);

  return { items, total };
}

// Buscar fornecedor por ID
async function getById(id) {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          brand: true,
          category: true,
          variants: true
        }
      }
    }
  });

  if (!supplier) {
    throw new Error('Fornecedor não encontrado');
  }

  return supplier;
}

// Criar novo fornecedor
async function create(data) {
  const { name, email, phone, address, cnpj } = data;
  
  // Validar CNPJ único se fornecido
  if (cnpj) {
    const existingSupplier = await prisma.supplier.findUnique({
      where: { cnpj }
    });
    if (existingSupplier) {
      throw new Error('CNPJ já cadastrado');
    }
  }

  return await prisma.supplier.create({
    data: {
      name,
      email,
      phone,
      address,
      cnpj,
      isActive: true
    },
    include: {
      products: true
    }
  });
}

// Atualizar fornecedor
async function update(id, data) {
  const supplier = await prisma.supplier.findUnique({
    where: { id }
  });

  if (!supplier) {
    throw new Error('Fornecedor não encontrado');
  }

  // Validar CNPJ único se estiver sendo alterado
  if (data.cnpj && data.cnpj !== supplier.cnpj) {
    const existingSupplier = await prisma.supplier.findUnique({
      where: { cnpj: data.cnpj }
    });
    if (existingSupplier) {
      throw new Error('CNPJ já cadastrado');
    }
  }

  return await prisma.supplier.update({
    where: { id },
    data,
    include: {
      products: {
        include: {
          brand: true,
          category: true
        }
      }
    }
  });
}

// Deletar fornecedor
async function remove(id) {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      products: true
    }
  });

  if (!supplier) {
    throw new Error('Fornecedor não encontrado');
  }

  // Verificar se há produtos vinculados
  if (supplier.products.length > 0) {
    throw new Error('Não é possível excluir fornecedor com produtos vinculados');
  }

  return await prisma.supplier.delete({
    where: { id }
  });
}

module.exports = { list, getById, create, update, remove };