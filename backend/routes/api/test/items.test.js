const app = require('../../../app');
const supertest = require('supertest');

test('GET /api/items', async () => {
  await supertest(app)
    .get('/api/items')
    .expect(200)
    .then((response) => {
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(20);

      // Check data
      expect(response.body[0].id).toBe(1);
    });
});

test('GET /api/items/:id', async () => {
  await supertest(app)
    .get('/api/items/1')
    .expect(200)
    .then((response) => {
      // Check data
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops');
      expect(response.body.CategoryId).toBe(4);
    });
});

test('GET /api/items/:wrongId', async () => {
  await supertest(app)
    .get('/api/items/100')
    .expect(404)
    .catch((error) => {});
});

test('POST /items', async () => {
  const data = {
    name: 'dummy',
    imageLink: 'www.google.com',
    description: 'dummy desc',
    price: '1',
  };
  const response = await supertest(app).post('/api/items').send(data);
  expect(response.statusCode).toBe(200);
  await supertest(app).delete(`/api/items/${response.body.id}`);
});

test('POST /items should give 400 code when category not given name', async () => {
  const data = {
    name: '',
    imageLink: 'www.google.com',
    description: 'dummy desc',
    price: '1',
  };
  const response = await supertest(app).post('/api/items').send(data);
  expect(response.statusCode).toBe(400);
});

describe('Testing PUT methods', () => {
  test('PUT /items/:id', async () => {
    const dummy = {
      name: 'dummy',
      imageLink: 'www.google.com',
      description: 'dummy desc',
      price: '1',
    };
    const newpost = await supertest(app).post(`/api/items/`).send(dummy);
    const dummy_edit = {
      name: 'dummy edited',
    };

    await supertest(app).put(`/api/items/${newpost.body.id}`).send(dummy_edit).expect(200);
    await supertest(app).delete(`/api/items/${newpost.body.id}`);
  });
});

describe('Testing PUT methods, wrong ID', () => {
  test('PUT /items/:id', async () => {
    const dummy = {
      name: 'dummy',
      imageLink: 'www.google.com',
      description: 'dummy desc',
      price: '1',
    };
    const newpost = await supertest(app).post(`/api/items/`).send(dummy);
    const dummy_edit = {
      name: 'dummy edited',
      id: 200,
    };
    await supertest(app).put(`/api/items/${newpost.body.id}`).send(dummy_edit).expect(404);
    await supertest(app).delete(`/api/items/${newpost.body.id}`);
  });
});
