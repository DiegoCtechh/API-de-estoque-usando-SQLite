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

describe('Produtos (/products)', () => {

    beforeEach(() => {
        db.prepare('DELETE FROM movements').run();
        db.prepare('DELETE FROM products').run();
        db.prepare('DELETE FROM users').run();
    });

    describe('POST /products', () => {

        test('deve criar um produto com sucesso e retornar status 201', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Camiseta', price: 49.90, stock: 100 });

            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Camiseta');
            expect(response.body.price).toBe(49.90);
            expect(response.body.stock).toBe(100);
        });

        test('deve retornar 401 sem token de autenticação', async () => {
            const response = await request(app)
                .post('/products')
                .send({ name: 'Camiseta', price: 49.90, stock: 100 });

            expect(response.status).toBe(401);
        });

        test('deve retornar 400 se o nome estiver vazio', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: '', price: 49.90, stock: 100 });

            expect(response.status).toBe(400);
        });

        test('deve retornar 400 se o preço for negativo', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Camiseta', price: -10, stock: 100 });

            expect(response.status).toBe(400);
        });

        test('deve retornar 400 se o estoque não for inteiro', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Camiseta', price: 49.90, stock: 1.5 });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /products', () => {

        test('deve retornar lista de produtos com paginação', async () => {
            const token = await getAuthToken();

            await request(app).post('/products').set('Authorization', `Bearer ${token}`)
                .send({ name: 'Camiseta', price: 49.90, stock: 100 });
            await request(app).post('/products').set('Authorization', `Bearer ${token}`)
                .send({ name: 'Calça', price: 89.90, stock: 50 });

            const response = await request(app)
                .get('/products')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('pagination');
            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination.total).toBe(2);
        });

        test('deve filtrar produtos pelo parâmetro search', async () => {
            const token = await getAuthToken();

            await request(app).post('/products').set('Authorization', `Bearer ${token}`)
                .send({ name: 'Camiseta Azul', price: 49.90, stock: 100 });
            await request(app).post('/products').set('Authorization', `Bearer ${token}`)
                .send({ name: 'Calça Jeans', price: 89.90, stock: 50 });

            const response = await request(app)
                .get('/products?search=Camiseta')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].name).toBe('Camiseta Azul');
        });
    });

    describe('GET /products/:id', () => {

        test('deve retornar o produto correto pelo id', async () => {
            const token = await getAuthToken();

            const created = await request(app)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Tênis', price: 199.90, stock: 30 });

            const productId = created.body.id;

            const response = await request(app)
                .get(`/products/${productId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(productId);
            expect(response.body.name).toBe('Tênis');
        });

        test('deve retornar 404 para produto inexistente', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .get('/products/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('POST /products/:id/entrada e /saida', () => {

        test('deve aumentar o estoque com uma entrada', async () => {
            const token = await getAuthToken();

            const created = await request(app).post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Produto', price: 10, stock: 10 });

            const id = created.body.id;

            const response = await request(app)
                .post(`/products/${id}/entrada`)
                .set('Authorization', `Bearer ${token}`)
                .send({ stock: 5 });

            expect(response.status).toBe(200);
            expect(response.body.product.stock).toBe(15);
        });

        test('deve diminuir o estoque com uma saída', async () => {
            const token = await getAuthToken();

            const created = await request(app).post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Produto', price: 10, stock: 10 });

            const id = created.body.id;

            const response = await request(app)
                .post(`/products/${id}/saida`)
                .set('Authorization', `Bearer ${token}`)
                .send({ stock: 3 });

            expect(response.status).toBe(200);
            expect(response.body.product.stock).toBe(7);
        });

        test('deve retornar 400 ao tentar saída maior que o estoque disponível', async () => {
            const token = await getAuthToken();

            const created = await request(app).post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Produto', price: 10, stock: 5 });

            const id = created.body.id;

            const response = await request(app)
                .post(`/products/${id}/saida`)
                .set('Authorization', `Bearer ${token}`)
                .send({ stock: 10 });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Estoque insuficiente');
        });
    });

    describe('GET /products/report', () => {

        test('deve retornar o relatório com os totais corretos', async () => {
            const token = await getAuthToken();

            await request(app).post('/products').set('Authorization', `Bearer ${token}`)
                .send({ name: 'Produto A', price: 10, stock: 100 });
            await request(app).post('/products').set('Authorization', `Bearer ${token}`)
                .send({ name: 'Produto B', price: 20, stock: 50 });

            const response = await request(app)
                .get('/products/report')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.summary.totalProducts).toBe(2);
            expect(response.body.summary.totalStockValue).toBe(2000);
        });
    });
});
