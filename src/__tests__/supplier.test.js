const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const { app } = require('../app'); // Ajuste conforme sua app

const prisma = new PrismaClient();

describe('Suppliers API', () => {
  let supplierId;

  // Limpar banco antes de cada teste
  beforeEach(async () => {
    await prisma.supplier.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Teste 1: Criar supplier
  test('POST /api/suppliers - deve criar um novo fornecedor', async () => {
    const supplierData = {
      name: 'Fornecedor Teste',
      email: 'fornecedor@teste.com',
      phone: '(11) 9999-9999',
      address: 'Rua Teste, 123',
      cnpj: '12.345.678/0001-90'
    };

    const response = await request(app)
      .post('/api/suppliers')
      .send(supplierData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(supplierData.name);
    expect(response.body.email).toBe(supplierData.email);
    expect(response.body.cnpj).toBe(supplierData.cnpj);

    supplierId = response.body.id;
  });

  // Teste 2: Listar suppliers
  test('GET /api/suppliers - deve listar todos os fornecedores', async () => {
    // Primeiro cria um supplier
    await prisma.supplier.create({
      data: {
        name: 'Fornecedor Lista',
        email: 'lista@teste.com',
        phone: '(11) 8888-8888'
      }
    });

    const response = await request(app)
      .get('/api/suppliers')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Teste 3: Buscar supplier por ID
  test('GET /api/suppliers/:id - deve retornar um fornecedor específico', async () => {
    const supplier = await prisma.supplier.create({
      data: {
        name: 'Fornecedor Específico',
        email: 'especifico@teste.com'
      }
    });

    const response = await request(app)
      .get(`/api/suppliers/${supplier.id}`)
      .expect(200);

    expect(response.body.id).toBe(supplier.id);
    expect(response.body.name).toBe('Fornecedor Específico');
  });

  // Teste 4: Atualizar supplier
  test('PUT /api/suppliers/:id - deve atualizar um fornecedor', async () => {
    const supplier = await prisma.supplier.create({
      data: {
        name: 'Fornecedor Original',
        email: 'original@teste.com'
      }
    });

    const updateData = {
      name: 'Fornecedor Atualizado',
      phone: '(11) 7777-7777'
    };

    const response = await request(app)
      .put(`/api/suppliers/${supplier.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body.name).toBe('Fornecedor Atualizado');
    expect(response.body.phone).toBe('(11) 7777-7777');
  });

  // Teste 5: Criar múltiplos suppliers (sem validação de email único)
  test('POST /api/suppliers - deve permitir criar múltiplos suppliers', async () => {
    const supplier1 = await request(app)
      .post('/api/suppliers')
      .send({
        name: 'Fornecedor A',
        email: 'mesmo@email.com'
      })
      .expect(201);

    const supplier2 = await request(app)
      .post('/api/suppliers')
      .send({
        name: 'Fornecedor B', 
        email: 'mesmo@email.com' // Mesmo email (sem validação)
      })
      .expect(201);

    expect(supplier1.body.id).not.toBe(supplier2.body.id);
    expect(supplier1.body.email).toBe(supplier2.body.email);
  });
});