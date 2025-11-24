const service = require('../services/brand.service');
const { getPagingAndSorting } = require('../utils/pagination');

async function list(req, res, next) {
  try {
    const paging = getPagingAndSorting(req.query, {
      defaultPageSize: 10,
      maxPageSize: 100,
      allowedSortBy: ['id', 'name', 'createdAt'],
    });
    const result = await service.list(paging);
    return res.json({
      data: result.items,
      meta: {
        total: result.total,
        page: paging.page,
        pageSize: paging.pageSize,
        pages: Math.ceil(result.total / paging.pageSize),
      },
    });
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    return res.json(await service.getById(id));
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const created = await service.create(req.body);
    return res.status(201).json(created);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body);
    return res.json(updated);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await service.remove(id);
    return res.json({ message: 'Brand removida com sucesso.' });
  } catch (e) { next(e); }
}

module.exports = { list, getById, create, update, remove };
