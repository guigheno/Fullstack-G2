const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedFakeData() {
  console.log('🌱 Iniciando seed de dados fictícios...');

  try {
    // 1. Buscar ou criar suppliers
    let supplier1 = await prisma.supplier.findFirst({
      where: { name: 'Fornecedor Tech' }
    });

    let supplier2 = await prisma.supplier.findFirst({
      where: { name: 'Fornecedor Fashion' }
    });

    if (!supplier1) {
      supplier1 = await prisma.supplier.create({
        data: {
          name: 'Fornecedor Tech',
          email: 'tech@teste.com',
          phone: '(11) 3333-3333'
        }
      });
      console.log('🏭 Supplier Tech criado');
    }

    if (!supplier2) {
      supplier2 = await prisma.supplier.create({
        data: {
          name: 'Fornecedor Fashion', 
          email: 'fashion@teste.com',
          phone: '(11) 4444-4444'
        }
      });
      console.log('🏭 Supplier Fashion criado');
    }

    // 2. Buscar produtos existentes ou criar novos
    let products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: 'Tênis Premium' } },
          { name: { contains: 'Camiseta Premium' } },
          { name: { contains: 'Fone Bluetooth' } }
        ]
      },
      include: { variants: true }
    });

    if (products.length < 3) {
      // Criar produtos que faltam
      const newProducts = await Promise.all([
        prisma.product.create({
          data: {
            name: 'Tênis Premium',
            description: 'Tênis esportivo de alta qualidade',
            price: 459.90,
            brandId: 1,
            categoryId: 1,
            supplierId: supplier1.id,
            variants: {
              create: [
                { size: '41', color: 'Azul', stock: 3, sku: 'TEN-PREM-AZUL-' + Date.now() }
              ]
            }
          },
          include: { variants: true }
        }),

        prisma.product.create({
          data: {
            name: 'Camiseta Premium',
            description: 'Camiseta de algodão premium',
            price: 79.90,
            brandId: 1, 
            categoryId: 1,
            supplierId: supplier2.id,
            variants: {
              create: [
                { size: 'M', color: 'Branco', stock: 20, sku: 'CAM-PREM-BCO-' + Date.now() }
              ]
            }
          },
          include: { variants: true }
        }),

        prisma.product.create({
          data: {
            name: 'Fone Bluetooth',
            description: 'Fone wireless premium',
            price: 299.90,
            brandId: 1,
            categoryId: 1, 
            supplierId: supplier1.id,
            variants: {
              create: [
                { size: 'Padrão', color: 'Preto', stock: 12, sku: 'FONE-BT-PRETO-' + Date.now() }
              ]
            }
          },
          include: { variants: true }
        })
      ]);
      
      products = [...products, ...newProducts];
      console.log('📦 Produtos criados/atualizados');
    }

    // 3. SEMPRE CRIAR PEDIDOS (não verifica existência)
    console.log('🛒 Criando pedidos fictícios...');
    
    const orders = [];
    for (let i = 0; i < 8; i++) {
      const product = products[i % products.length];
      const variant = product.variants[0];
      
      const orderTotal = product.price * (i % 2 === 0 ? 1 : 2);
      
      const order = await prisma.order.create({
        data: {
          customerId: 1,
          shippingAddressId: 1,
          status: 'COMPLETED', // Todos como completos para contar nas vendas
          total: orderTotal,
          items: {
            create: [
              {
                productId: product.id,
                variantId: variant.id,
                quantity: i % 2 === 0 ? 1 : 2,
                unitPrice: product.price
              }
            ]
          }
        }
      });
      orders.push(order);
    }

    console.log('✅ Dados fictícios criados com sucesso!');
    console.log(`📦 ${products.length} produtos disponíveis`);
    console.log(`🛒 ${orders.length} NOVOS pedidos criados`);
    console.log(`💰 Total em vendas: R$ ${orders.reduce((sum, order) => sum + Number(order.total), 0).toFixed(2)}`);

  } catch (error) {
    console.error('❌ Erro ao criar dados fictícios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedFakeData();
}

module.exports = { seedFakeData };