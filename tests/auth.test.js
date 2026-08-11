import request from 'supertest';
import app from '../app.js';
import db from '../database.js';

describe('Autenticação (/auth)', () => {

    beforeEach(() => {
        db.prepare('DELETE FROM users').run();
    });

    describe('POST /auth/register', () => {

        test('deve registrar um usuário com sucesso e retornar status 201', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ username: 'diego', password: '123456' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Usuário registrado com sucesso');
        });

        test('deve retornar 400 se o username tiver menos de 3 caracteres', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ username: 'ab', password: '123456' });

            expect(response.status).toBe(400);
        });

        test('deve retornar 400 se a senha tiver menos de 6 caracteres', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ username: 'diego', password: '123' });

            expect(response.status).toBe(400);
        });

        test('deve retornar 400 se username ou senha estiverem ausentes', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ username: 'diego' });

            expect(response.status).toBe(400);
        });

        test('deve retornar 409 se o username já estiver em uso', async () => {
            await request(app)
                .post('/auth/register')
                .send({ username: 'diego', password: '123456' });

            const response = await request(app)
                .post('/auth/register')
                .send({ username: 'diego', password: '654321' });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe('Nome de usuário já está em uso');
        });
    });

    describe('POST /auth/login', () => {

        beforeEach(async () => {
            await request(app)
                .post('/auth/register')
                .send({ username: 'diego', password: '123456' });
        });

        test('deve retornar um token JWT com status 200 ao fazer login com credenciais corretas', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ username: 'diego', password: '123456' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
        });

        test('deve retornar 401 com senha incorreta', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ username: 'diego', password: 'senhaerrada' });

            expect(response.status).toBe(401);
        });

        test('deve retornar 401 com usuário inexistente', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ username: 'naoexiste', password: '123456' });

            expect(response.status).toBe(401);
        });

        test('deve retornar 400 se campos estiverem ausentes', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({});

            expect(response.status).toBe(400);
        });
    });
});
