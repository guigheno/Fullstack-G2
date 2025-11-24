const service = require('../services/product.service.v2');
const { getPagingAndSorting } = require('../utils/pagination');

async function list(req, res, next) {
  try {
    const paging = getPagingAndSorting(req.query, {
      defaultPageSize: 10,
      maxPageSize: 100,
      allowedSortBy: ['id','name','price','createdAt'],
    });
    const result = await service.list(paging, req.query);
    res.json({
      data: result.items,
      meta: {
        total: result.total,
        page: paging.page,
        pageSize: paging.pageSize,
        pages: Math.ceil(result.total / paging.pageSize),
      }
    });
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    res.json(await service.getById(id));
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const created = await service.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body);
    res.json(updated);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await service.remove(id);
    res.json({ message: 'Produto removido com sucesso.' });
  } catch (e) { next(e); }
}

module.exports = { list, getById, create, update, remove };
