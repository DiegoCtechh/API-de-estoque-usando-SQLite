<div align="center">

<h1>📦 API de Estoque</h1>

<p>API RESTful completa para gerenciamento de estoque, construída com Node.js, Express e SQLite.</p>

<p>
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/JWT-Auth-black?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Swagger-Docs-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger"/>
  <img src="https://img.shields.io/badge/license-ISC-blue?style=flat-square" alt="License"/>
</p>

<p>
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-como-rodar">Como Rodar</a> •
  <a href="#-endpoints">Endpoints</a> •
  <a href="#-exemplos">Exemplos</a>
</p>

</div>

---

## 📖 Sobre o Projeto

Esta API foi desenvolvida como projeto de portfólio para praticar o desenvolvimento back-end com Node.js. O sistema permite que empresas controlem seu estoque de produtos, registrando entradas e saídas de mercadorias com histórico completo de movimentações.

Toda a API é protegida por **autenticação JWT** e conta com **documentação interativa via Swagger**, onde é possível testar todos os endpoints diretamente pelo navegador.

---

## ✨ Funcionalidades

- 🔐 **Autenticação segura** — registro e login com JWT + hash de senha (bcrypt)
- 📦 **CRUD de Produtos** — criar, listar, buscar, atualizar e excluir
- 🔍 **Busca e Paginação** — filtrar por nome e paginar os resultados
- 📊 **Relatório de Estoque** — resumo com valor total e alertas de estoque baixo
- 📈 **Controle de Movimentações** — histórico de todas as entradas e saídas
- 🛡️ **Segurança** — proteção com Helmet (headers HTTP) e Rate Limiting
- 📄 **Documentação Interativa** — Swagger UI acessível em `/docs`
- ⚠️ **Tratamento de Erros** — respostas de erro padronizadas e seguras

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [Node.js](https://nodejs.org) | v18+ | Runtime JavaScript |
| [Express](https://expressjs.com) | v5 | Framework web |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | v12 | Banco de dados SQLite |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | v9 | Geração e verificação de JWT |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | v3 | Hash de senhas |
| [helmet](https://helmetjs.github.io/) | v8 | Segurança com headers HTTP |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | v8 | Proteção contra brute force |
| [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) | v6 | Geração de spec OpenAPI |
| [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) | v5 | Interface Swagger no browser |
| [sucrase](https://sucrase.io/) + [nodemon](https://nodemon.io/) | — | Ambiente de desenvolvimento |

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) **v18 ou superior**
- **npm** (vem junto com o Node.js)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/api-de-estoque.git

# 2. Entre na pasta do projeto
cd api-de-estoque

# 3. Instale as dependências
npm install

# 4. Crie o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
NODE_ENV=development
DB_PATH=estoque.db
JWT_SECRET=coloque_uma_chave_secreta_longa_aqui
JWT_EXPIRES_IN=1h
```

```bash
# 5. Inicie o servidor em modo de desenvolvimento
npm run dev
```

| Serviço | URL |
|---|---|
| 🖥️ API | `http://localhost:3000` |
| 📄 Documentação (Swagger) | `http://localhost:3000/docs` |

> O banco de dados SQLite (`estoque.db`) é criado automaticamente na primeira execução.

---

## 📡 Endpoints

### 🔓 Autenticação — `/auth`

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Registra um novo usuário | Não |
| `POST` | `/auth/login` | Autentica e retorna um token JWT | Não |

### 📦 Produtos — `/products`

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/products` | Lista todos os produtos | ✅ |
| `GET` | `/products?search=nome` | Busca produto por nome | ✅ |
| `GET` | `/products?page=1&limit=10` | Listagem com paginação | ✅ |
| `GET` | `/products/report` | Relatório e estatísticas do estoque | ✅ |
| `GET` | `/products/:id` | Busca um produto pelo ID | ✅ |
| `POST` | `/products` | Cria um novo produto | ✅ |
| `PUT` | `/products/:id` | Atualiza um produto | ✅ |
| `DELETE` | `/products/:id` | Remove um produto | ✅ |
| `POST` | `/products/:id/entrada` | Registra entrada de estoque | ✅ |
| `POST` | `/products/:id/saida` | Registra saída de estoque | ✅ |

### 📈 Movimentações — `/movements`

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/movements` | Lista todas as movimentações | ✅ |
| `GET` | `/movements?product_id=1` | Filtra por produto | ✅ |
| `GET` | `/movements?type=entrada` | Filtra por tipo (`entrada` ou `saida`) | ✅ |

> **Auth** ✅ = necessário enviar o header `Authorization: Bearer <token>`

---

## 💡 Exemplos de Uso

### 1. Registrar um usuário

```http
POST /auth/register
Content-Type: application/json

{
  "username": "diego",
  "password": "minhasenha123"
}
```

**Resposta `201 Created`:**
```json
{
  "message": "Usuário registrado com sucesso"
}
```

---

### 2. Fazer login e obter token

```http
POST /auth/login
Content-Type: application/json

{
  "username": "diego",
  "password": "minhasenha123"
}
```

**Resposta `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h"
}
```

> 💡 Use o token recebido no header de todas as requisições protegidas:
> `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### 3. Criar um produto

```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Camiseta Básica",
  "price": 49.90,
  "stock": 100
}
```

**Resposta `201 Created`:**
```json
{
  "id": 1,
  "name": "Camiseta Básica",
  "price": 49.90,
  "stock": 100
}
```

---

### 4. Registrar entrada de estoque

```http
POST /products/1/entrada
Authorization: Bearer <token>
Content-Type: application/json

{
  "stock": 50
}
```

**Resposta `200 OK`:**
```json
{
  "message": "Entrada registrada com sucesso",
  "product": {
    "id": 1,
    "name": "Camiseta Básica",
    "price": 49.90,
    "stock": 150
  }
}
```

---

### 5. Consultar relatório do estoque

```http
GET /products/report
Authorization: Bearer <token>
```

**Resposta `200 OK`:**
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
      { "id": 3, "name": "Calça Jeans", "price": 129.90, "stock": 2 },
      { "id": 7, "name": "Meia Esportiva", "price": 19.90, "stock": 4 }
    ]
  }
}
```

---

## 📁 Estrutura do Projeto

```
api-de-estoque/
│
├── controllers/               # Lógica de negócio (separada das rotas)
│   ├── authController.js      # Registro e login
│   ├── productsController.js  # CRUD de produtos, entrada/saída, relatório
│   └── movementsController.js # Listagem e filtros de movimentações
│
├── middlewares/               # Middlewares Express
│   ├── auth.js                # Verificação e decodificação do JWT
│   └── errorHandler.js        # Tratamento centralizado de erros
│
├── routes/                    # Definição das rotas HTTP
│   ├── auth.js
│   ├── products.js
│   └── movements.js
│
├── docs/
│   └── swagger.js             # Configuração e schemas do Swagger/OpenAPI
│
├── database.js                # Conexão com SQLite e criação das tabelas
├── index.js                   # Ponto de entrada — configuração do servidor
├── .env                       # Variáveis de ambiente (não versionado)
├── .env.example               # Modelo do arquivo .env
└── package.json
```

---

## 🔒 Segurança

Este projeto implementa diversas camadas de segurança:

- **Helmet** — define headers HTTP de segurança (XSS, clickjacking, etc.)
- **Rate Limiting** — máximo de 100 req/IP a cada 15 min (geral) e 20 req/15 min nas rotas de auth
- **Bcrypt** — senhas nunca são armazenadas em texto puro
- **JWT** — tokens com expiração configurável
- **Mensagens de erro genéricas** — login não revela se o usuário existe ou não

---

## 📄 Licença

Distribuído sob a licença **ISC**. Veja `LICENSE` para mais informações.

---

