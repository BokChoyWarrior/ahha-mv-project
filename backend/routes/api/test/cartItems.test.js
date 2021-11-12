const app = require('../../../app');
const supertest = require('supertest');

describe('Testing POST methods', () => {
  test('POST /cartItems', async () => {
    const data = {
      quantity: 2,
    };
    const response = await supertest(app).post('/api/cartItems').send(data);
    expect(response.statusCode).toBe(200);
    await supertest(app).delete(`/api/cartItems/${response.body.id}`);
  });
  test('POST /cartItems should give 400 code when quantity is not INT', async () => {
    const data = {
      quantity: 'hi',
    };
    const response = await supertest(app).post('/api/cartItems').send(data);
    expect(response.statusCode).toBe(400);
  });
});

describe('Testing GET methods', () => {
  test('GET /cartItems/:id', async () => {
    await supertest(app).get('/api/cartItems/1').expect(200);
  });
  test('GET 404 when supertesting a cart item that does not exist', async () => {
    await supertest(app).get('/api/cartItems/100').expect(404);
  });
  test('should get all cartItems', async () => {
    const response = await supertest(app).get('/api/cartItems');
    expect(response.statusCode).toBe(200);
  });
});

describe('Testing PUT methods', () => {
  test('PUT /cartItems/:id', async () => {
    const dummy = {
      quantity: 5,
    };
    const newpost = await supertest(app).post(`/api/cartItems/`).send(dummy);
    const dummy_edit = {
      quantity: 10,
    };

    await supertest(app).put(`/api/cartItems/${newpost.body.id}`).send(dummy_edit).expect(200);
    await supertest(app).delete(`/api/cartItems/${newpost.body.id}`);
  });
});

describe('Testing DELETE method', () => {
  test('DELETE /cartItems/:id', async () => {
    const dummy = {
      quantity: 1,
    };
    const newpost = await supertest(app).post(`/api/cartItems`).send(dummy);

    await supertest(app).delete(`/api/cartItems/${newpost.body.id}`).expect(200);
  });
});
