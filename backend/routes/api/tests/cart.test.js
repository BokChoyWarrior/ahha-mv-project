const request = require('supertest');
const app = "http://localhost:3000/api"

describe('Testing POST methods', () => {
    test('POST /carts', async () => {
        const data ={
        }
        const response = await request(app).post("/carts").send(data);;
        expect(response.statusCode).toBe(200);
        await request(app).delete(`/carts/${response.body.id}`);
    });
});



describe('Testing GET methods', () => {
    test('GET /carts/:id', async () => {

        await request(app)
            .get("/carts/1")
            .expect(200)
            
    });
    test('GET 404 when requesting a cart that does not exist', async () => {

        await request(app)
            .get("/carts/100")
            .expect(404)
            
    });
    test('should get all carts', async () => {
        const response = await request(app).get("/carts");
        expect(response.statusCode).toBe(200);
    });

});

describe('Testing PUT methods', () => {
    test('PUT /carts/:id', async () => {
        const dummy = {
        }
        const newpost = await request(app).post(`/carts/`).send(dummy);
        const dummy_edit = {
            "quantity": 10,
        }

        await request(app)
            .put(`/carts/${newpost.body.id}`)
            .send(dummy_edit)
            .expect(200)
        await request(app).delete(`/carts/${newpost.body.id}`);   
    });
});

