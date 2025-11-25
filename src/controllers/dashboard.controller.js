const dashboardService = require('../services/dashboard.service');

async function getDashboard(req, res, next) {
  try {
    const dashboardData = await dashboardService.getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
}

async function getSalesReport(req, res, next) {
  try {
    const salesData = await dashboardService.getMonthlySales();
    res.json(salesData);
  } catch (error) {
    next(error);
  }
}

async function getTopProducts(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const topProducts = await dashboardService.getTopProducts(limit);
    res.json(topProducts);
  } catch (error) {
    next(error);
  }
}

async function getLowStock(req, res, next) {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    const lowStockProducts = await dashboardService.getLowStockProducts(threshold);
    res.json(lowStockProducts);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getSalesReport,
  getTopProducts,
  getLowStock
};