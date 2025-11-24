const service = require('../services/category.service');
const { getPagingAndSorting } = require('../utils/pagination');

async function list(req,res,next){
  try{
    const paging = getPagingAndSorting(req.query, {
      defaultPageSize: 10, maxPageSize: 100, allowedSortBy: ['id','name']
    });
    const result = await service.list(paging);
    res.json({ data: result.items, meta: {
      total: result.total, page: paging.page, pageSize: paging.pageSize,
      pages: Math.ceil(result.total / paging.pageSize),
    }});
  }catch(e){ next(e); }
}
async function getById(req,res,next){ try{ res.json(await service.getById(Number(req.params.id))); }catch(e){ next(e); } }
async function create(req,res,next){ try{ res.status(201).json(await service.create(req.body)); }catch(e){ next(e); } }
async function update(req,res,next){ try{ res.json(await service.update(Number(req.params.id), req.body)); }catch(e){ next(e); } }
async function remove(req,res,next){ try{ await service.remove(Number(req.params.id)); res.json({message:'Category removida com sucesso.'}); }catch(e){ next(e); } }

module.exports = { list, getById, create, update, remove };
