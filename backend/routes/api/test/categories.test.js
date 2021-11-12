const app = require('../../../app');
const supertest = require('supertest');

test('POST /api/categories', async () => {
  const data = {
    name: 'dummy',
    imageLink: 'www.google.com',
  };

  const response = await supertest(app).post('/api/categories').send(data);
  expect(response.statusCode).toBe(200);
  expect(response);
  expect(typeof response.text).toBe('string');
  await supertest(app).delete(`/api/categories/${response.body.id}`);
});
test('POST /api/categories should give 400 code when category not given name', async () => {
  const data = {
    name: '',
    imageLink: 'www.google.com',
    description: 'dummy desc',
    price: '1',
  };
  const response = await supertest(app).post('/api/categories').send(data);
  expect(response.statusCode).toBe(400);
});

describe('Testing GET methods', () => {
  test('GET /api/categories/:id', async () => {
    await supertest(app).get('/api/categories/1').expect(200);
  });
  test('GET 404 when requesting an item that does not exist', async () => {
    await supertest(app).get('/api/categories/100').expect(404);
  });
  test('should get all categories', async () => {
    const response = await supertest(app).get('/api/categories');
    expect(response.statusCode).toBe(200);
  });
});

describe('Testing PUT methods', () => {
  test('PUT /api/categories/:id', async () => {
    const dummy = {
      name: 'dummy',
      imageLink: 'www.google.com',
    };
    const newpost = await supertest(app).post(`/api/categories`).send(dummy);
    const dummy_edit = {
      name: 'dummy edited',
    };

    await supertest(app).put(`/api/categories/${newpost.body.id}`).send(dummy_edit).expect(200);
    await supertest(app).delete(`/api/categories/${newpost.body.id}`);
  });
});

describe('Testing DELETE method', () => {
  test('DELETE /api/categories/:id', async () => {
    const dummy = {
      name: 'dummy',
      imageLink: 'www.google.com',
    };
    const newpost = await supertest(app).post(`/api/categories`).send(dummy);

    await supertest(app).delete(`/api/categories/${newpost.body.id}`).expect(200);
  });
});
