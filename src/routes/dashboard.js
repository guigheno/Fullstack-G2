const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// GET /api/admin/dashboard - Dashboard completo
router.get('/dashboard', dashboardController.getDashboard);

// GET /api/admin/reports/sales - Relatório de vendas
router.get('/reports/sales', dashboardController.getSalesReport);

// GET /api/admin/reports/top-products - Produtos mais vendidos
router.get('/reports/top-products', dashboardController.getTopProducts);

// GET /api/admin/reports/low-stock - Produtos com estoque baixo
router.get('/reports/low-stock', dashboardController.getLowStock);

module.exports = router; // ← IMPORTANTE: exportar o router