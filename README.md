# 🎫 Conecta Eventos

Sistema web para gerenciamento de **eventos, categorias, participantes, usuários e inscrições**, desenvolvido com **Node.js**, **Express**, **EJS** e **PostgreSQL**.

O projeto possui uma área pública para exibição dos próximos eventos e uma área administrativa protegida por login, onde é possível realizar o gerenciamento completo dos dados do sistema.

---

## 📌 Funcionalidades

### 🌐 Área pública

- Exibição dos próximos eventos
- Eventos ordenados por data
- Exibição de título, descrição, data e horário
- Exibição do local do evento
- Exibição da quantidade de vagas
- Exibição da categoria
- Exibição do organizador
- Exibição de imagem do evento

### 🔐 Autenticação

- Login de usuários
- Controle de sessão com `express-session`
- Validação de usuário ativo
- Proteção das rotas administrativas
- Logout

### 🏷️ Categorias

- Listagem de categorias
- Cadastro
- Edição
- Exclusão

### 🎫 Eventos

- Listagem de eventos
- Cadastro
- Edição
- Exclusão
- Associação com categoria
- Associação com usuário organizador
- Definição de data e horário
- Definição do local
- Controle da quantidade de vagas
- Imagem do evento

### 👥 Participantes

- Listagem de participantes
- Cadastro
- Edição
- Exclusão
- Registro de nome, e-mail e telefone

### 📝 Inscrições

- Listagem de inscrições
- Cadastro
- Edição
- Exclusão
- Associação entre participante e evento
- Controle do status da inscrição
- Controle de presença
- Prevenção de inscrição duplicada do mesmo participante no mesmo evento

### 👤 Usuários

- Listagem de usuários
- Cadastro
- Edição
- Exclusão
- Controle de usuário ativo ou inativo
- Utilização do usuário como organizador dos eventos

---

## 🛠️ Tecnologias utilizadas

- Node.js
- Express 5
- EJS
- PostgreSQL
- pg
- express-session
- Nodemon
- JavaScript
- HTML
- CSS

---

## 📁 Estrutura do projeto

```text
eventos/
│
├── Public/                         # Arquivos estáticos: CSS, JS e imagens
│
├── Routes/                         # Rotas da aplicação
│   ├── categoriasRoutes.js
│   ├── eventosRoutes.js
│   ├── inscricaoRoutes.js
│   ├── participantesRoutes.js
│   └── usuariosRoutes.js
│
├── Views/                          # Interfaces EJS
│   ├── categorias/
│   ├── eventos/
│   ├── inscricoes/
│   ├── participantes/
│   ├── usuarios/
│   ├── landing/
│   ├── admin.ejs
│   └── login.ejs
│
├── app.js                          # Arquivo principal da aplicação
├── db.js                           # Configuração da conexão PostgreSQL
├── eventos.sql                     # Estrutura e dados iniciais do banco
├── testeconexao.js                 # Teste de conexão com o banco
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, instale:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- Git

Você pode verificar a instalação do Node.js e do npm com:

```bash
node -v
npm -v
```

---

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/astevanellisenai/eventos.git
```

Entre na pasta:

```bash
cd eventos
```

### 2. Instalar as dependências

```bash
npm install
```

O comando instala automaticamente as dependências definidas no `package.json`.

Caso seja necessário instalar o Nodemon separadamente:

```bash
npm install nodemon
```

Ou globalmente:

```bash
npm install -g nodemon
```

---

## 📦 Principais dependências

O projeto utiliza:

```text
express
EJS
pg
express-session
nodemon
```

O `package.json` está configurado para iniciar o projeto com Nodemon:

```json
"scripts": {
  "start": "nodemon app.js"
}
```

---

## 🗄️ Configuração do banco de dados

Crie no PostgreSQL um banco chamado:

```text
eventos
```

Depois execute o arquivo:

```text
eventos.sql
```

O script cria as tabelas:

```text
usuarios
categorias
eventos
participantes
inscricoes
```

Também inclui dados iniciais para facilitar os testes da aplicação.

---

## 🔗 Relacionamentos do banco de dados

Estrutura principal:

```text
usuarios
   │
   └── eventos
          │
          ├── categorias
          │
          └── inscricoes
                 │
                 └── participantes
```

Os principais relacionamentos são:

- `eventos.categoria_id` → `categorias.id`
- `eventos.organizador_id` → `usuarios.id`
- `inscricoes.participante_id` → `participantes.id`
- `inscricoes.evento_id` → `eventos.id`

A tabela `inscricoes` possui uma restrição `UNIQUE` que impede que o mesmo participante seja inscrito duas vezes no mesmo evento.

---

## 🔌 Configuração da conexão

A conexão com o PostgreSQL está definida no arquivo:

```text
db.js
```

Configuração utilizada atualmente:

```javascript
const { Pool } = require("pg");

const BD = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'eventos',
    password: 'admin',
    port: 5432
});

module.exports = BD;
```

Caso sua instalação do PostgreSQL possua usuário ou senha diferentes, altere essas informações no arquivo `db.js`.

> Para projetos em produção, recomenda-se utilizar variáveis de ambiente para armazenar dados de conexão e outras informações sensíveis.

---

## ▶️ Executando o projeto

Execute:

```bash
npm start
```

O projeto utiliza **Nodemon**, portanto o servidor será reiniciado automaticamente sempre que houver alterações no código.

A aplicação ficará disponível em:

```text
http://localhost:3001
```

---

## 🔑 Usuários de teste

O arquivo `eventos.sql` possui usuários iniciais para testes.

### Administrador

```text
E-mail: admin@email.com
Senha: 123456
```

### Usuário ativo

```text
E-mail: carlos@email.com
Senha: 123456
```

Também existe um usuário inativo para testar a validação de acesso:

```text
E-mail: mariana@email.com
Senha: 123456
Situação: inativo
```

A página de login pode ser acessada em:

```text
http://localhost:3001/login
```

> As credenciais acima são destinadas somente ao ambiente didático/de desenvolvimento e devem ser alteradas antes de qualquer publicação real do sistema.

---

## 🧭 Principais rotas

| Rota | Descrição |
|---|---|
| `/` | Página pública com os próximos eventos |
| `/login` | Login |
| `/logout` | Logout |
| `/admin` | Área administrativa |
| `/categorias` | Gerenciamento de categorias |
| `/eventos` | Gerenciamento de eventos |
| `/participantes` | Gerenciamento de participantes |
| `/inscricoes` | Gerenciamento de inscrições |
| `/usuarios` | Gerenciamento de usuários |

As rotas administrativas exigem que o usuário esteja autenticado.

---

## 📝 Status das inscrições

O banco permite os seguintes status:

```text
confirmada
cancelada
pendente
```

Cada inscrição também possui o campo:

```text
presente
```

Esse campo é do tipo `BOOLEAN` e pode ser utilizado para registrar a presença do participante no evento.

---

## 👨‍💻 Desenvolvimento

Projeto desenvolvido para fins educacionais, aplicando conceitos de:

- Desenvolvimento Web Backend
- Node.js e Express
- Renderização com EJS
- CRUD
- Sessões e autenticação
- PostgreSQL
- Chaves primárias e estrangeiras
- Relacionamentos entre tabelas
- Constraints
- `CHECK`
- `UNIQUE`
- `ON DELETE CASCADE`
- Rotas protegidas
- Integração entre Backend e banco de dados

---

## 📚 Projeto Eventos

Este repositório pode ser utilizado como exemplo prático de integração entre uma aplicação web Node.js e um banco de dados PostgreSQL, contemplando autenticação, CRUDs relacionados e gerenciamento completo de eventos e inscrições.

Projeto desenvolvido para fins educacionais no **SESI/SENAI**.
