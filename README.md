# Sistema de Eventos

Projeto desenvolvido para gerenciamento de eventos, usuários, categorias, participantes e inscrições.

## Tecnologias utilizadas

- Node.js
- Express
- EJS
- PostgreSQL
- JavaScript
- HTML
- CSS
- Nodemon

## Estrutura do projeto

```text
Eventos/
├── Dados/
├── Public/
├── Routes/
├── Views/
├── app.js
├── db.js
├── package.json
├── package-lock.json
└── .gitignore
```

## Funcionalidades

- Cadastro de usuários
- Cadastro de categorias
- Cadastro de eventos
- Cadastro de participantes
- Controle de inscrições
- Listagem de registros
- Edição de registros
- Exclusão de registros
- Integração com banco de dados PostgreSQL

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm
- PostgreSQL

Para verificar se o Node.js está instalado:

```bash
node -v
```

Para verificar a versão do npm:

```bash
npm -v
```

## Clonando o projeto

Clone o repositório:

```bash
git clone https://github.com/astevanellisenai/eventos.git
```

Entre na pasta do projeto:

```bash
cd eventos
```

## Instalando as dependências

Depois de clonar o projeto, execute:

```bash
npm install
```

Esse comando lê o arquivo `package.json` e instala automaticamente todas as dependências necessárias.

As dependências serão instaladas dentro da pasta:

```text
node_modules
```

A pasta `node_modules` não precisa ser enviada para o GitHub, pois ela pode ser recriada utilizando:

```bash
npm install
```

## Principais pacotes utilizados

Caso seja necessário instalar os pacotes manualmente, utilize:

### Express

Framework utilizado para criação do servidor e das rotas:

```bash
npm install express
```

### EJS

Template Engine utilizada para criação das páginas:

```bash
npm install ejs
```

### PostgreSQL

Pacote utilizado para comunicação com o banco PostgreSQL:

```bash
npm install pg
```

### Express Session

Utilizado para gerenciamento de sessões de usuários:

```bash
npm install express-session
```

### Nodemon

Utilizado durante o desenvolvimento para reiniciar automaticamente o servidor quando algum arquivo é alterado:

```bash
npm install --save-dev nodemon
```

## Instalando todos os principais pacotes

Também é possível instalar os pacotes principais de uma única vez:

```bash
npm install express ejs pg express-session
```

Depois instale o Nodemon:

```bash
npm install --save-dev nodemon
```

## Configuração do package.json

Para utilizar o Nodemon através do comando:

```bash
npm start
```

O arquivo `package.json` deve possuir um script semelhante a:

```json
"scripts": {
  "start": "nodemon app.js"
}
```

Exemplo:

```json
{
  "scripts": {
    "start": "nodemon app.js"
  }
}
```

## Configuração do banco de dados

Configure a conexão com o PostgreSQL no arquivo `db.js`.

Exemplo:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'eventos',
  password: 'sua_senha',
  port: 5432
});

module.exports = pool;
```

> Não publique senhas reais no GitHub.

O ideal é armazenar dados sensíveis em variáveis de ambiente utilizando um arquivo `.env`.

## Executando o projeto

Depois de instalar as dependências e configurar o banco de dados, execute:

```bash
npm start
```

O Nodemon iniciará o servidor e reiniciará automaticamente sempre que algum arquivo do projeto for alterado.

Depois acesse no navegador:

```text
http://localhost:3000
```

## Fluxo para executar o projeto em outro computador

Depois de clonar o repositório:

```bash
git clone https://github.com/astevanellisenai/eventos.git
```

Entre na pasta:

```bash
cd eventos
```

Instale as dependências:

```bash
npm install
```

Configure o banco de dados PostgreSQL.

Depois execute:

```bash
npm start
```

## Objetivo educacional

Este projeto foi desenvolvido para aplicação prática dos conceitos de:

- Banco de Dados
- PostgreSQL
- CRUD
- Node.js
- Express
- EJS
- Rotas
- Backend
- Integração entre aplicação e banco de dados
- Desenvolvimento de aplicações web

## Autor

Projeto desenvolvido para fins educacionais no SESI/SENAI.
