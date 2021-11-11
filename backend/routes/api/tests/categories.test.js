const request = require('supertest');
const app = "http://localhost:3000/api"


describe('Testing POST methods', () => {
    test('POST /categories', async () => {
        const data ={
            "name": "dummy",
            "imageLink": "www.google.com",
        }
        const response = await request(app).post("/categories").send(data);;
        expect(response.statusCode).toBe(200);
        await request(app).delete(`/categories/${response.body.id}`);
    });
    test('POST /categories should give 400 code when category not given name', async () => {
        const data ={
            "name": "",
            "imageLink": "www.google.com",
            "description" : "dummy desc",
            "price" : "1"
        }
        const response = await request(app).post("/categories").send(data);;
        expect(response.statusCode).toBe(400);
    });

});



describe('Testing GET methods', () => {
    test('GET /categories/:id', async () => {

        await request(app)
            .get("/categories/1")
            .expect(200)
            
    });
    test('GET 404 when requesting an item that does not exist', async () => {

        await request(app)
            .get("/categories/100")
            .expect(404)
            
    });
    test('should get all categories', async () => {
        const response = await request(app).get("/categories");
        expect(response.statusCode).toBe(200);
    });

});

describe('Testing PUT methods', () => {
    test('PUT /categories/:id', async () => {
        const dummy = {
            "name": "dummy",
            "imageLink": "www.google.com",
        }
        const newpost = await request(app).post(`/categories/`).send(dummy);
        const dummy_edit = {
            "name": "dummy edited",
        }

        await request(app)
            .put(`/categories/${newpost.body.id}`)
            .send(dummy_edit)
            .expect(200)
        await request(app).delete(`/categories/${newpost.body.id}`);   
    });
});















