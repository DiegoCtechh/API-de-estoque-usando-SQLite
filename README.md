<div align="center">

<h1>API de Estoque</h1>

<p>API RESTful para gerenciamento de estoque de produtos, construída com Node.js, Express e SQLite.</p>

<p>
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/JWT-Auth-black?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Zod-Validation-3E67B1?style=flat-square" alt="Zod"/>
  <img src="https://img.shields.io/badge/Swagger-Docs-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger"/>
  <img src="https://img.shields.io/badge/Jest-Tests-C21325?style=flat-square&logo=jest&logoColor=white" alt="Jest"/>
  <img src="https://img.shields.io/badge/license-ISC-blue?style=flat-square" alt="License"/>
</p>

</div>

---

## Sobre o Projeto

API RESTful para controle de estoque de produtos. O sistema permite o gerenciamento completo do ciclo de vida de produtos, incluindo cadastro, atualização, controle de entradas e saídas e geração de relatórios.

Todos os endpoints são protegidos por autenticação JWT. A documentação interativa está disponível via Swagger UI, permitindo testar os endpoints diretamente pelo navegador.

---

## Funcionalidades

- Autenticação com JWT e hash de senha via bcrypt
- CRUD completo de produtos
- Busca por nome e paginação de resultados
- Registro de entradas e saídas de estoque com histórico de movimentações
- Relatório de estoque com valor total e alertas de estoque baixo
- Proteção com Helmet e Rate Limiting
- Documentação interativa via Swagger UI em `/docs`
- Tratamento centralizado de erros com respostas padronizadas
- Suíte de testes automatizados com Jest e Supertest (27 testes)

---

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [Node.js](https://nodejs.org) | v18+ | Runtime JavaScript |
| [Express](https://expressjs.com) | v5 | Framework web |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | v12 | Banco de dados SQLite |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | v9 | Geração e verificação de tokens JWT |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | v3 | Hash de senhas |
| [zod](https://zod.dev/) | v4 | Validação de dados de entrada |
| [helmet](https://helmetjs.github.io/) | v8 | Headers de segurança HTTP |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | v8 | Proteção contra força bruta |
| [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) | v6 | Geração de especificação OpenAPI |
| [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) | v5 | Interface Swagger no navegador |
| [jest](https://jestjs.io/) | v30 | Framework de testes |
| [supertest](https://github.com/ladjs/supertest) | v7 | Testes de integração HTTP |
| [sucrase](https://sucrase.io/) + [nodemon](https://nodemon.io/) | — | Ambiente de desenvolvimento |

---

## Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm (incluído na instalação do Node.js)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/DiegoCtechh/API-de-estoque-usando-SQLite.git

# Acesse a pasta do projeto
cd API-de-estoque-usando-SQLite

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente a partir do modelo
cp .env.example .env
```

Edite o arquivo `.env` com as configurações do ambiente:

```env
PORT=3000
NODE_ENV=development
DB_PATH=estoque.db
JWT_SECRET=substitua_por_uma_chave_secreta_longa_e_aleatoria
JWT_EXPIRES_IN=1h
```

```bash
# Inicie o servidor em modo de desenvolvimento
npm run dev
```

| Serviço | URL |
|---|---|
| API | `http://localhost:3000` |
| Documentação Swagger | `http://localhost:3000/docs` |

> O banco de dados SQLite (`estoque.db`) é criado automaticamente na primeira execução. Nenhuma configuração adicional de banco de dados é necessária.

---

## Testes

### Ferramentas

**Jest** é o framework de testes utilizado. Ele é responsável por organizar e executar os testes, fornecer as funções de asserção (`expect`) e gerar o relatório de resultados.

**Supertest** é a biblioteca utilizada para simular requisições HTTP diretamente sobre a instância do Express, sem a necessidade de subir um servidor em uma porta de rede. Isso torna os testes mais rápidos e confiáveis.

### Isolamento do banco de dados

Durante a execução dos testes, a variável de ambiente `DB_PATH` é definida como `:memory:`, instruindo o SQLite a criar um banco de dados temporário em memória. Esse banco existe apenas durante a execução dos testes e é descartado ao final, sem interferir no arquivo `estoque.db` de produção.

### Estrutura

```
tests/
├── auth.test.js        — registro e login de usuários
├── products.test.js    — CRUD de produtos, entradas, saídas e relatório
└── movements.test.js   — listagem e filtros de movimentações
```

### Cobertura

| Módulo | Cenários testados |
|---|---|
| `POST /auth/register` | Registro com sucesso, username duplicado, campos inválidos |
| `POST /auth/login` | Login com sucesso, senha incorreta, usuário inexistente |
| `POST /products` | Criação com sucesso, validação de campos, requisição sem token |
| `GET /products` | Listagem paginada, filtro por nome |
| `GET /products/:id` | Produto encontrado, produto inexistente |
| `POST /products/:id/entrada` | Incremento de estoque |
| `POST /products/:id/saida` | Decremento de estoque, estoque insuficiente |
| `GET /products/report` | Totais e valor de estoque corretos |
| `GET /movements` | Listagem paginada, filtro por tipo, filtro por produto, tipo inválido |

### Executar os testes

```bash
npm test
```

```
Test Suites: 3 passed, 3 total
Tests:       27 passed, 27 total
```

---

## Endpoints

### Autenticação — `/auth`

| Método | Rota | Descricao | Requer Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Registra um novo usuário | Nao |
| `POST` | `/auth/login` | Autentica e retorna um token JWT | Nao |

### Produtos — `/products`

| Método | Rota | Descricao | Requer Auth |
|---|---|---|---|
| `GET` | `/products` | Lista todos os produtos com paginacao | Sim |
| `GET` | `/products?search=termo` | Filtra produtos por nome | Sim |
| `GET` | `/products?page=1&limit=10` | Paginacao de resultados | Sim |
| `GET` | `/products/report` | Relatorio e estatisticas do estoque | Sim |
| `GET` | `/products/:id` | Busca um produto pelo ID | Sim |
| `POST` | `/products` | Cria um novo produto | Sim |
| `PUT` | `/products/:id` | Atualiza um produto existente | Sim |
| `DELETE` | `/products/:id` | Remove um produto | Sim |
| `POST` | `/products/:id/entrada` | Registra entrada de estoque | Sim |
| `POST` | `/products/:id/saida` | Registra saida de estoque | Sim |

### Movimentacoes — `/movements`

| Método | Rota | Descricao | Requer Auth |
|---|---|---|---|
| `GET` | `/movements` | Lista todas as movimentacoes com paginacao | Sim |
| `GET` | `/movements?product_id=1` | Filtra movimentacoes por produto | Sim |
| `GET` | `/movements?type=entrada` | Filtra por tipo (`entrada` ou `saida`) | Sim |

> Rotas que requerem autenticacao devem incluir o header: `Authorization: Bearer <token>`

---

## Exemplos de Uso

### Registrar um usuario

```http
POST /auth/register
Content-Type: application/json

{
  "username": "diego",
  "password": "minhasenha123"
}
```

Resposta `201 Created`:
```json
{
  "message": "Usuario registrado com sucesso"
}
```

---

### Fazer login e obter token

```http
POST /auth/login
Content-Type: application/json

{
  "username": "diego",
  "password": "minhasenha123"
}
```

Resposta `200 OK`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h"
}
```

Utilize o token retornado no header de todas as requisicoes protegidas: `Authorization: Bearer <token>`

---

### Criar um produto

```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Camiseta Basica",
  "price": 49.90,
  "stock": 100
}
```

Resposta `201 Created`:
```json
{
  "id": 1,
  "name": "Camiseta Basica",
  "price": 49.90,
  "stock": 100
}
```

---

### Registrar entrada de estoque

```http
POST /products/1/entrada
Authorization: Bearer <token>
Content-Type: application/json

{
  "stock": 50
}
```

Resposta `200 OK`:
```json
{
  "message": "Entrada registrada com sucesso",
  "product": {
    "id": 1,
    "name": "Camiseta Basica",
    "price": 49.90,
    "stock": 150
  }
}
```

---

### Consultar relatorio do estoque

```http
GET /products/report
Authorization: Bearer <token>
```

Resposta `200 OK`:
```json
{
  "summary": {
    "totalProducts": 10,
    "totalItems": 843,
    "totalStockValue": 32450.00,
    "totalEntries": 47,
    "totalExits": 29
  },
  "lowStockAlert": {
    "threshold": 5,
    "count": 2,
    "products": [
      { "id": 3, "name": "Calca Jeans", "price": 129.90, "stock": 2 },
      { "id": 7, "name": "Meia Esportiva", "price": 19.90, "stock": 4 }
    ]
  }
}
```

---

## Estrutura do Projeto

```
api-de-estoque/
|
+-- controllers/               # Logica de negocio
|   +-- authController.js      # Registro e login
|   +-- productsController.js  # CRUD de produtos, entrada/saida, relatorio
|   +-- movementsController.js # Listagem e filtros de movimentacoes
|
+-- middlewares/               # Middlewares Express
|   +-- auth.js                # Verificacao e decodificacao do JWT
|   +-- errorHandler.js        # Tratamento centralizado de erros
|
+-- routes/                    # Definicao das rotas HTTP com documentacao Swagger
|   +-- auth.js
|   +-- products.js
|   +-- movements.js
|
+-- schemas/                   # Schemas de validacao (Zod)
|   +-- authSchema.js
|   +-- productSchema.js
|
+-- docs/
|   +-- swagger.js             # Configuracao e schemas do Swagger/OpenAPI
|
+-- tests/                     # Testes automatizados
|   +-- auth.test.js
|   +-- products.test.js
|   +-- movements.test.js
|
+-- app.js                     # Configuracao do Express (sem inicializacao do servidor)
+-- index.js                   # Ponto de entrada — inicializacao do servidor
+-- database.js                # Conexao com SQLite e criacao das tabelas
+-- jest.setup.js              # Configuracao do ambiente de testes
+-- .env                       # Variaveis de ambiente (nao versionado)
+-- .env.example               # Modelo do arquivo .env
+-- package.json
```

---

## Segurança

- **Helmet** — define headers HTTP de segurança (XSS, clickjacking, MIME sniffing)
- **Rate Limiting** — limite de 100 requisicoes por IP a cada 15 minutos (geral) e 20 requisicoes a cada 15 minutos nas rotas de autenticacao
- **Bcrypt** — senhas armazenadas exclusivamente como hash (salt factor 10)
- **JWT** — tokens com tempo de expiracao configuravel via variavel de ambiente
- **Mensagens de erro genericas** — o endpoint de login nao revela se o usuario existe ou nao, prevenindo enumeracao de usuarios

---

## Licenca

Distribuido sob a licenca ISC.
