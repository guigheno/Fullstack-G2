const request = require('supertest');
const { app } = require('../app');

describe('Main API Endpoints', () => {
  
  
  // Teste de rota não encontrada
  test('GET /rota-inexistente - deve retornar 404', async () => {
    const response = await request(app)
      .get('/rota-inexistente')
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  // Teste de CORS
  test('OPTIONS / - deve permitir CORS', async () => {
    const response = await request(app)
      .options('/')
      .expect(204);

    expect(response.headers['access-control-allow-methods']).toContain('GET');
  });
});