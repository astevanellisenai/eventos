//Definição
const express = require("express");
const session = require('express-session');
const app = express();
const BD = require('./db');

//Motor de conversao do HTML para o Backend
app.set("view engine", "ejs");

app.use(express.static('Public'));

//Codificação de URL
app.use(express.urlencoded({
    extended: true
}));

//Configurar o Session
app.use(session({
    secret: 'SESISENAI',
    resave: false,
    saveUninitialized: false
}));

//Rotas
app.get("/", (req, res) => {
    res.render("landing/index");
});

//Rota Login
app.get("/login", (req, res) => {
    res.render("login", { erro: null });
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {

        const resultado = await BD.query(`
            select id, nome, email from usuarios
            where email = $1 and
                  senha = $2 and
                  situacao = 1
            `, [email, senha]);

        if (resultado.rows.length === 0) {
            return res.render('login', {
                erro: 'E-mail ou senha inválido!'
            });
        }

        req.session.usuario = resultado.rows[0];
        res.redirect('/admin');

    } catch (erro) {
        console.log('Erro: ' + erro);
        res.status(500).send('Erro no servidor!');
    }
});

function exigirLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
};

//Rota Administrativa
app.get("/admin", exigirLogin, (req, res) => {
    res.render("admin",{usuario: req.session.usuario});
});

//Rotas Categorias
const categoriasRoutes =
    require('./Routes/categoriasRoutes');
app.use("/categorias", exigirLogin, categoriasRoutes);

//Rotas Participantes
const participantesRoutes =
    require('./Routes/participantesRoutes');
app.use("/participantes", exigirLogin, participantesRoutes);

//Rotas Eventos
const eventosRoutes =
    require('./Routes/eventosRoutes');
app.use("/eventos", exigirLogin, eventosRoutes);

//Rotas Usuarios
const usuariosRoutes =
    require('./Routes/usuariosRoutes');
app.use("/usuarios", exigirLogin, usuariosRoutes);

//Rotas Inscricao
const inscricaoRoutes =
    require('./Routes/inscricaoRoutes');
app.use("/inscricao", exigirLogin, inscricaoRoutes);

//logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

//Execução
const porta = 3001;
app.listen(porta, () => {
    console.log(`Servidor: http://localhost:${porta}`);
});