const request = require('supertest');
const app = "http://localhost:3000/api"


describe('Testing POST methods', () => {
    test('POST /items', async () => {
        const data ={
            "name": "dummy",
            "imageLink": "www.google.com",
            "description" : "dummy desc",
            "price" : "1"
        }
        const response = await request(app).post("/items").send(data);;
        expect(response.statusCode).toBe(200);
        await request(app).delete(`/items/${response.body.id}`);
    });
    test('POST /items should give 400 code when category not given name', async () => {
        const data ={
            "name": "",
            "imageLink": "www.google.com",
            "description" : "dummy desc",
            "price" : "1"
        }
        const response = await request(app).post("/items").send(data);;
        expect(response.statusCode).toBe(400);
    });

});



describe('Testing GET methods', () => {
    test('GET /items/:id', async () => {

        await request(app)
            .get("/items/1")
            .expect(200)
            
    });
    test('GET 404 when requesting an item that does not exist', async () => {

        await request(app)
            .get("/items/100")
            .expect(404)
            
    });
    test('should get all items', async () => {
        const response = await request(app).get("/items");
        expect(response.statusCode).toBe(200);
    });

});

describe('Testing PUT methods', () => {
    test('PUT /items/:id', async () => {
        const dummy = {
            "name": "dummy",
            "imageLink": "www.google.com",
            "description" : "dummy desc",
            "price" : "1"
        }
        const newpost = await request(app).post(`/items/`).send(dummy);
        const dummy_edit = {
            "name": "dummy edited",
        }

        await request(app)
            .put(`/items/${newpost.body.id}`)
            .send(dummy_edit)
            .expect(200)
        await request(app).delete(`/items/${newpost.body.id}`);   
    });
});


