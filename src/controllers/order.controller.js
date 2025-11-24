const service = require('../services/order.service');
const { getPagingAndSorting } = require('../utils/pagination');

async function list(req,res,next){
  try {
    const paging = getPagingAndSorting(req.query, {
      defaultPageSize: 10, maxPageSize: 100, allowedSortBy: ['id','createdAt','status','total']
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
  } catch(e){ next(e); }
}
async function getById(req,res,next){ try{ res.json(await service.getById(Number(req.params.id))); }catch(e){ next(e); } }
async function create(req,res,next){ try{ res.status(201).json(await service.create(req.body)); }catch(e){ next(e); } }
async function updateStatus(req,res,next){ try{ res.json(await service.updateStatus(Number(req.params.id), req.body.status)); }catch(e){ next(e); } }
async function remove(req,res,next){ try{ await service.remove(Number(req.params.id)); res.json({ message: 'Pedido removido com sucesso.' }); }catch(e){ next(e); } }

module.exports = { list, getById, create, updateStatus, remove };
