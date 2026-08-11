import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Estoque",
            version: "2.0.0",
            description: `
API RESTful para gerenciamento de estoque de produtos.
Desenvolvida com Node.js, Express e SQLite.

## Autenticação
Esta API usa **JWT (JSON Web Token)**. Para acessar as rotas protegidas:
1. Registre um usuário em \`POST /auth/register\`
2. Faça login em \`POST /auth/login\` e copie o \`token\`
3. Clique em **Authorize** e cole \`Bearer <seu_token>\`
            `,
            contact: {
                name: "GitHub do Projeto",
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: "Servidor local",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                Product: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Camiseta Básica" },
                        price: { type: "number", example: 49.90 },
                        stock: { type: "integer", example: 100 },
                    },
                },
                Movement: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        product_id: { type: "integer", example: 1 },
                        type: { type: "string", enum: ["entrada", "saida"] },
                        stock: { type: "integer", example: 20 },
                        date: { type: "string", example: "2025-01-15T14:30:00.000Z" },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Produto não encontrado" },
                    },
                },
            },
        },
        security: [{ BearerAuth: [] }],
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
