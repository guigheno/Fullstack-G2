const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DashboardService {
  
  // Total de vendas no mês atual
  async getMonthlySales() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const result = await prisma.order.aggregate({
      where: {
        status: 'COMPLETED', // ou o status que indica venda concluída
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        total: true
      },
      _count: {
        id: true
      }
    });

    return {
      totalSales: Number(result._sum.total || 0),
      totalOrders: result._count.id || 0
    };
  }

  // Produto mais vendido no período
  async getTopProducts(limit = 5) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: startOfMonth
          }
        }
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limit
    });

    // Buscar detalhes dos produtos
    const productIds = topProducts.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      include: {
        brand: true,
        variants: true
      }
    });

    // Combinar dados
    return topProducts.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || 'Produto não encontrado',
        brand: product?.brand?.name,
        totalSold: item._sum.quantity,
        price: product?.price
      };
    });
  }

  // Produtos com estoque baixo
  async getLowStockProducts(threshold = 10) {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        variants: true,
        supplier: true
      }
    });

    // Calcular estoque total considerando variantes
    const productsWithStock = products.map(product => {
      const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
      return {
        ...product,
        totalStock,
        isLowStock: totalStock <= threshold
      };
    });

    // Filtrar apenas produtos com estoque baixo
    return productsWithStock
      .filter(product => product.isLowStock)
      .sort((a, b) => a.totalStock - b.totalStock)
      .map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand?.name,
        supplier: product.supplier?.name,
        currentStock: product.totalStock,
        threshold: threshold
      }));
  }

  // Dashboard completo
  async getDashboardData() {
    const [monthlySales, topProducts, lowStockProducts] = await Promise.all([
      this.getMonthlySales(),
      this.getTopProducts(3), // Top 3 produtos
      this.getLowStockProducts(5) // Estoque menor que 5
    ]);

    return {
      sales: monthlySales,
      topProducts,
      lowStockProducts,
      lastUpdated: new Date()
    };
  }
}

module.exports = new DashboardService();