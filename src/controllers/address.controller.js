const service = require('../services/address.service');

async function listByCustomer(req,res,next){
  try {
    const { customerId } = req.params;
    const items = await service.listByCustomer(Number(customerId));
    res.json(items);
  } catch(e){ next(e); }
}
async function create(req,res,next){
  try {
    const { customerId } = req.params;
    const created = await service.create(Number(customerId), req.body);
    res.status(201).json(created);
  } catch(e){ next(e); }
}
async function update(req,res,next){
  try {
    const { id } = req.params;
    const updated = await service.update(Number(id), req.body);
    res.json(updated);
  } catch(e){ next(e); }
}
async function remove(req,res,next){
  try {
    const { id } = req.params;
    await service.remove(Number(id));
    res.json({ message: 'Endereço removido com sucesso.' });
  } catch(e){ next(e); }
}

module.exports = { listByCustomer, create, update, remove };
