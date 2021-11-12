const app = require('../../../app');
const supertest = require('supertest');

test('POST /carts', async () => {
  const data = {};
  const response = await supertest(app).post('/api/carts').send(data);
  expect(response.statusCode).toBe(200);
  await supertest(app).delete(`/api/carts/${response.body.id}`);
});

// describe('Testing GET methods', () => {
//   test('GET /carts/:id', async () => {
//     await supertest(app).get('/api/carts/1').expect(200);
//   });
//   test('GET 404 when supertesting a cart that does not exist', async () => {
//     await supertest(app).get('/api/carts/100').expect(404);
//   });
//   test('should get all carts', async () => {
//     const response = await supertest(app).get('/api/carts');
//     expect(response.statusCode).toBe(200);
//   });
// });

// describe('Testing PUT methods', () => {
//   test('PUT /carts/:id', async () => {
//     const dummy = {};
//     const newpost = await supertest(app).post(`/api/carts`).send(dummy);
//     const dummy_edit = {
//       quantity: 10,
//     };

//     await supertest(app).put(`/api/carts/${newpost.body.id}`).send(dummy_edit).expect(200);
//     await supertest(app).delete(`/api/carts/${newpost.body.id}`);
//   });
// });

// describe('Testing DELETE method', () => {
//   test('DELETE /carts/:id', async () => {
//     const dummy = {};
//     const newpost = await supertest(app).post(`/api/carts`).send(dummy);

//     await supertest(app).delete(`/api/carts/${newpost.body.id}`).expect(200);
//   });
// });
