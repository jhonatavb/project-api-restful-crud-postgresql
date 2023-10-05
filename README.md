# API RESTful CRUD PostgreSQL

## 💻 Overview

This project involves the development of a RESTful API (Representational State Transfer) that offers CRUD (Create, Read, Update, Delete) operations to manage user-related, category, and transaction information. PostgreSQL is used as the database, with a defined structure of tables and columns for data storage.

## 🛠️ Technologies

![https://nodejs.org/en](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![https://www.npmjs.com/](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![https://www.npmjs.com/package/nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![https://expressjs.com/](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![https://jwt.io/](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![https://www.postman.com/](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![https://www.postgresql.org/](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

# 📦 Features

- [x] **Cadastrar Usuário**
- [x] **Fazer Login**
- [x] **Detalhar Perfil do Usuário Logado**
- [x] **Editar Perfil do Usuário Logado**
- [x] **Listar categorias**
- [x] **Listar transações**
- [x] **Detalhar transação**
- [x] **Cadastrar transação**
- [x] **Editar transação**
- [x] **Remover transação**
- [x] **Obter extrato de transações**
- [x] **Filtrar transações por categoria**

## 📋 Prerequisites

To clone the repository, you will need to have [Git](https://git-scm.com/downloads) installed on your machine. Additionally, to run the server and interact with the PostgreSQL database, you will need to have [Node.js](https://nodejs.org/pt-br/download) and [PostgreSQL](https://www.postgresql.org/download/) installed.

## 🚀 Installation

- Clone the project and navigate to the directory
```bash
git clone git@github.com:jhonatavbrg/project-api-restful-crud-postgresql.git && cd project-api-restful-crud-postgresql
```
- Install project dependencies<br />
```bash
npm i
```

# 🔎 How To Use

- Supported Methods `GET`, `POST`, `PUT` and `DELETE`
- For requests that use methods other than `GET`, such as `POST`, `PUT`, and `DELETE`, it will be necessary to use a client tool like [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com/), or any other of your choice
- You will need to set up the .env file. Inside the project, there is a file called .env.example, where all the environment variables for the project are listed. In the .env file, you should configure all the variables for both the database, such as user, password, port, and host, and for the project, such as the JWT password to generate the token for the user and also the port where the server will run. It's very important that you configure everything with great care because each credential is unique, so you cannot set them with default values. If you configure something incorrectly, it will result in an error.
- Inside the `src/database` folder, there is a file named `database.sql`. You should open it with an SQL editor such as [Beekeeper Studio](https://www.beekeeperstudio.io/), [DBeaver](https://dbeaver.io/download/), or any other of your choice. After opening it, execute the queries within this file. These queries will create a database named `dindin` and the respective tables that were modeled specifically for this project. **Remember that after executing the first query to create a database, you need to select it before creating the tables, as SQL editors do not automatically select. If you do not select the created database, the tables will be created in the current database you are connected to, causing issues when interacting with the project's routes.**
- Inside the project directory, run the command
```bash
npm run dev
```

# 🛤️ Routes

- After that, the server will be running the API, and you can configure your routes in Insomnia, Postman, or any other client of your choice. The routes to be configured are as follows: (Remember to change the port)

### Registration
#### `POST http://localhost:YOUR_PORT/usuario`
#### **Request Example:**
```javascript
// POST /usuario
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}
```
#### **Response Example:**
```javascript
// HTTP Status 201
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```
```javascript
// HTTP Status 409
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```
### Login
#### `POST http://localhost:YOUR_PORT/usuario`
#### **Request Example:**
```javascript
// POST /login
{
    "email": "jose@email.com",
    "senha": "123456"
}
```
#### **Response Example:**
```javascript
// HTTP Status 200 / 201 / 204
{
    "usuario": {
        "id": 1,
        "nome": "José",
        "email": "jose@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```
```javascript
// HTTP Status 400
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```
### 
**ATTENTION: Starting from this route, all functionalities (endpoints) require an authentication token. This token is generated after logging in with your previously registered account. In both programs (Insomnia and Postman), there is a specific place where you can put this token. It is a Bearer token and is placed in the request header. Its duration is 8 hours; after that, it is necessary to log in again to generate another token.**
### 
### View user details
#### `GET http://localhost:YOUR_PORT/usuario`
#### **Request Example:**
```javascript
// GET /usuario
// No content in the request body
```
#### **Response Example:**
```javascript
// HTTP Status 200
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```
```javascript
// HTTP Status 401
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```
### Update user
#### `PUT http://localhost:YOUR_PORT/usuario`
#### **Request Example:**
```javascript
// PUT /usuario
{
    "nome": "José de Abreu",
    "email": "jose_abreu@email.com",
    "senha": "j4321"
}
```
#### **Response Example:**
```javascript
// HTTP Status 204
// No content in the response body
```
```javascript
// HTTP Status 409
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```
### List categories
#### `GET http://localhost:YOUR_PORT/categoria`
#### **Request Example:**
```javascript
// GET /categoria
// No content in the request body
```
#### **Response Example:**
```javascript
// HTTP Status 200
[
  {
    id: 1,
    descricao: "Roupas",
  },
  {
    id: 2,
    descricao: "Mercado",
  },
  ...
];
```
```javascript
// HTTP Status 200
[];
```
### List transactions for the logged-in user
#### `GET http://localhost:YOUR_PORT/transacao`
#### **Request Example:**
```javascript
// GET /transacao
// No content in the request body
```
#### **Response Example:**
```javascript
// HTTP Status 200
[
  {
    id: 1,
    tipo: "saida",
    descricao: "Sapato amarelo",
    valor: 15800,
    data: "2022-03-23T15:35:00.000Z",
    usuario_id: 5,
    categoria_id: 4,
    categoria_nome: "Roupas",
  },
  {
    id: 3,
    tipo: "entrada",
    descricao: "Salário",
    valor: 300000,
    data: "2022-03-24T15:30:00.000Z",
    usuario_id: 5,
    categoria_id: 6,
    categoria_nome: "Salários",
  },
];
```
```javascript
// HTTP Status 200
[];
```
### View a transaction for the logged-in user
#### `GET http://localhost:YOUR_PORT/transacao/:id`
#### **Request Example:**
```javascript
// GET /transacao/2
// No content in the request body
```
#### **Response Example:**
```javascript
// HTTP Status 200
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```
```javascript
// HTTP Status 404
{
    "mensagem": "Transação não encontrada."
}
```
### Add a transaction for the logged-in user
#### `POST http://localhost:YOUR_PORT/transacao`
#### **Request Example:**
```javascript
// POST /transacao
{
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "categoria_id": 6
}
```
#### **Response Example:**
```javascript
// HTTP Status 200
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```
```javascript
// HTTP Status 400
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```
### Update a transaction for the logged-in user
#### `PUT http://localhost:YOUR_PORT/transacao/:id`
#### **Request Example:**
```javascript
// PUT /transacao/2
{
	"descricao": "Sapato amarelo",
	"valor": 15800,
	"data": "2022-03-23 12:35:00",
	"categoria_id": 4,
	"tipo": "saida"
}
```
#### **Response Example:**
```javascript
// HTTP Status 204
// No content in the response body
```
```javascript
// HTTP Status 400
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```
### Delete a transaction for the logged-in user
#### `DELETE http://localhost:YOUR_PORT/transacao/:id`
#### **Request Example:**
```javascript
// DELETE /transacao/2
// No content in the request body
```
#### **Response Example:**
```javascript
// HTTP Status 204
// No content in the response body
```
```javascript
// HTTP Status 404
{
    "mensagem": "Transação não encontrada."
}
```
### Obtain transaction statement
#### `GET http://localhost:YOUR_PORT/transacao/extrato`
#### **Request Example:**
```javascript
// GET /transacao/extrato
// No content in the request body
```
#### **Response Example:**
```javascript
// HTTP Status 200
{
	"entrada": 300000,
	"saida": 15800
}
```
### Filter transactions by category
#### `GET http://localhost:YOUR_PORT/transacao?filtro[]=roupas&filtro[]=salários`
#### **Request Example:**
```javascript
// GET /transacao?filtro[]=roupas&filtro[]=salários
// No content in the request body
```
#### **Response Example:**
```javascript
// HTTP Status 200
[
  {
    id: 1,
    tipo: "saida",
    descricao: "Sapato amarelo",
    valor: 15800,
    data: "2022-03-23T15:35:00.000Z",
    usuario_id: 5,
    categoria_id: 4,
    categoria_nome: "Roupas",
  },
  {
    id: 3,
    tipo: "entrada",
    descricao: "Salário",
    valor: 300000,
    data: "2022-03-24T15:30:00.000Z",
    usuario_id: 5,
    categoria_id: 6,
    categoria_nome: "Salários",
  },
  ...
];
```
```javascript
// HTTP Status 200
[];
```

# 🖼️ Screenshots
<details>
  <summary>Verification Tests For All Routes</summary><br />
    <img src="https://i.imgur.com/1yILalh.png" />
</details>

<details>
  <summary>Database Modeling</summary><br />
    <img src="https://i.imgur.com/xsTLfyP.png" />
</details>

# 🐞 Issues and 💡 Suggestions
- If you encounter any issues (bugs) or have suggestions for improving this project, please feel free to report them on the [Issue-tracker](https://github.com/jhonatavbrg/project-api-restful-crud-postgresql/issues)

# 📝 License
[MIT](https://opensource.org/license/mit/) © [jhonatavbrg](https://www.linkedin.com/in/jhonatavbrg)

