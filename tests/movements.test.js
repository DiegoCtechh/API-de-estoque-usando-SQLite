import request from 'supertest';
import app from '../app.js';
import db from '../database.js';

async function getAuthToken() {
    await request(app)
        .post('/auth/register')
        .send({ username: 'testuser', password: '123456' });

    const loginRes = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: '123456' });

    return loginRes.body.token;
}

async function createProduct(token, data = { name: 'Produto Teste', price: 10, stock: 50 }) {
    const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(data);
    return res.body.id;
}

describe('Movimentações (/movements)', () => {

    beforeEach(() => {
        db.prepare('DELETE FROM movements').run();
        db.prepare('DELETE FROM products').run();
        db.prepare('DELETE FROM users').run();
    });

    describe('GET /movements', () => {

        test('deve retornar lista de movimentações com paginação', async () => {
            const token = await getAuthToken();
            const productId = await createProduct(token);

            await request(app).post(`/products/${productId}/entrada`)
                .set('Authorization', `Bearer ${token}`).send({ stock: 10 });
            await request(app).post(`/products/${productId}/saida`)
                .set('Authorization', `Bearer ${token}`).send({ stock: 5 });

            const response = await request(app)
                .get('/movements')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('pagination');
            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination.total).toBe(2);
        });

        test('deve filtrar movimentações por tipo "entrada"', async () => {
            const token = await getAuthToken();
            const productId = await createProduct(token);

            await request(app).post(`/products/${productId}/entrada`)
                .set('Authorization', `Bearer ${token}`).send({ stock: 10 });
            await request(app).post(`/products/${productId}/saida`)
                .set('Authorization', `Bearer ${token}`).send({ stock: 5 });

            const response = await request(app)
                .get('/movements?type=entrada')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].type).toBe('entrada');
        });

        test('deve filtrar movimentações por product_id', async () => {
            const token = await getAuthToken();
            const id1 = await createProduct(token, { name: 'Produto A', price: 10, stock: 50 });
            const id2 = await createProduct(token, { name: 'Produto B', price: 20, stock: 50 });

            await request(app).post(`/products/${id1}/entrada`)
                .set('Authorization', `Bearer ${token}`).send({ stock: 10 });
            await request(app).post(`/products/${id2}/entrada`)
                .set('Authorization', `Bearer ${token}`).send({ stock: 5 });

            const response = await request(app)
                .get(`/movements?product_id=${id1}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].product_id).toBe(id1);
        });

        test('deve retornar 400 para tipo inválido', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .get('/movements?type=invalido')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
        });

        test('deve retornar 401 sem token', async () => {
            const response = await request(app).get('/movements');
            expect(response.status).toBe(401);
        });
    });
});
