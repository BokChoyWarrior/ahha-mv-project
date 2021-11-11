const request = require('supertest');
const app = "http://localhost:3000/api"

describe('Testing POST methods', () => {
    test('POST /cartItems', async () => {
        const data ={
            "quantity": 2,
        }
        const response = await request(app).post("/cartItems").send(data);;
        expect(response.statusCode).toBe(200);
        await request(app).delete(`/cartItems/${response.body.id}`);
    });
    test('POST /cartItems should give 400 code when quantity is not INT', async () => {
        const data ={
            "quantity": "hi",
        }
        const response = await request(app).post("/cartItems").send(data);;
        expect(response.statusCode).toBe(400);
    });

});



describe('Testing GET methods', () => {
    test('GET /cartItems/:id', async () => {

        await request(app)
            .get("/cartItems/1")
            .expect(200)
            
    });
    test('GET 404 when requesting a cart item that does not exist', async () => {

        await request(app)
            .get("/cartItems/100")
            .expect(404)
            
    });
    test('should get all cartItems', async () => {
        const response = await request(app).get("/cartItems");
        expect(response.statusCode).toBe(200);
    });

});

describe('Testing PUT methods', () => {
    test('PUT /cartItems/:id', async () => {
        const dummy = {
            "quantity": 5,
        }
        const newpost = await request(app).post(`/cartItems/`).send(dummy);
        const dummy_edit = {
            "quantity": 10,
        }

        await request(app)
            .put(`/cartItems/${newpost.body.id}`)
            .send(dummy_edit)
            .expect(200)
        await request(app).delete(`/cartItems/${newpost.body.id}`);   
    });
});