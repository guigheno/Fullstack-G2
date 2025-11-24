const supplierService = require('../services/supplier.service');
const { getPagingAndSorting } = require('../utils/pagination');

// Listar todos os fornecedores
async function list(req, res, next) {
  try {
    const paging = getPagingAndSorting(req.query, {
      defaultPageSize: 10,
      maxPageSize: 100,
      allowedSortBy: ['id', 'name', 'createdAt'],
    });
    
    const result = await supplierService.list(paging, req.query);
    res.json({
      data: result.items,
      meta: {
        total: result.total,
        page: paging.page,
        pageSize: paging.pageSize,
        pages: Math.ceil(result.total / paging.pageSize),
      }
    });
  } catch (e) { 
    next(e); 
  }
}

// Buscar fornecedor por ID
async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const supplier = await supplierService.getById(id);
    res.json(supplier);
  } catch (e) { 
    next(e); 
  }
}

// Criar novo fornecedor
async function create(req, res, next) {
  try {
    const created = await supplierService.create(req.body);
    res.status(201).json(created);
  } catch (e) { 
    next(e); 
  }
}

// Atualizar fornecedor
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await supplierService.update(id, req.body);
    res.json(updated);
  } catch (e) { 
    next(e); 
  }
}

// Deletar fornecedor
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await supplierService.remove(id);
    res.json({ message: 'Fornecedor removido com sucesso.' });
  } catch (e) { 
    next(e); 
  }
}

module.exports = { list, getById, create, update, remove };