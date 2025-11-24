const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/supplier.controller');

// GET /api/suppliers - Listar todos os fornecedores
router.get('/', suppliersController.list);

// GET /api/suppliers/:id - Buscar fornecedor por ID
router.get('/:id', suppliersController.getById);

// POST /api/suppliers - Criar novo fornecedor
router.post('/', suppliersController.create);

// PUT /api/suppliers/:id - Atualizar fornecedor
router.put('/:id', suppliersController.update);

// DELETE /api/suppliers/:id - Deletar fornecedor
router.delete('/:id', suppliersController.remove);

module.exports = router;