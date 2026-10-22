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
app.get("/", async (req, res) => {
    try {
        const resultado = await BD.query(
            `
            SELECT
                e.id,
                e.titulo,
                e.descricao,
                e.data_evento,
                TO_CHAR(e.data_evento, 'DD/MM/YYYY') AS data_formatada,
                e.horario,
                TO_CHAR(e.horario, 'HH24:MI') AS horario_formatado,
                e.local,
                e.quantidade_vagas,
                e.imagem_url,
                c.nome AS nome_categoria,
                u.nome AS nome_organizador
            FROM eventos e
            INNER JOIN categorias c
                ON e.categoria_id = c.id
            INNER JOIN usuarios u
                ON e.organizador_id = u.id
                WHERE e.data_evento >= CURRENT_DATE
            ORDER BY e.data_evento ASC
        `
        );
        const eventosAtivos = resultado.rows;

        res.render('landing/index', {
            eventosAtivos
        });
    } catch (erro) {
        console.error('Erro ao buscar eventos:', erro);
        res.render('landing/index', {
            titulo: 'Conecta Eventos',
            eventosAtivos: []
        });
    }
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

//Dashboard
app.get('/dashboard', async (req, res) => {

    try {

        const totalEVentos = await BD.query(`
            select count(*) as total
            from eventos
            `);

        const totalParticipantes = await BD.query(`
            select count(*) as total
            from participantes
            `);

        const totalInscricoes = await BD.query(`
            select count(*) as total
            from inscricoes
            `);

        const usuariosAtivo = await BD.query(`
            select count(*) as total
            from usuarios where situacao = 1
            ,`);

        const inscricaoStatus = await BD.query(`
            select
                status,
                count(*) as total
            from inscricoes
            group by status
            order by status            
        `);

        const eventosCategoria = await BD.query(`
            select
                c.nome as categoria,
                count(*) as total
            from categorias c
            let join eventos e on
                     e.catgoria_id = c.id
            order by c.id, c.nome
            `);
        const eventosMaisInscricao = await
            BD.query(`
                select
                    e.titulo,
                    count(i.id) as total
                from eventos e
                left join inscrioes i 
                    on i.evento_id = e.id4
                group by e.id, e.titulo
                order by total desc limit 5`);

        const proximoEventos = await BD.query(`
                select
                   id,
                   titulo,
                   data_evento,
                   horario,
                   local
                from eventos
                where data_evento >= CURRENT_DATE
                order by
                    data_evento,
                    horario
                limit 5
                `);

            res.render('dashboard', {
                usuario: req.session.usuario,
                totalEventos: 
                    totalEventos.rows[0].total,
                totalParticipantes: 
                    totalParticipantes.rows[0].total,
                totalInscricoes: 
                    totalInscricoes.rows[0].total,
                usuariosAtivos: 
                    usuariosAtivo.rows[0].total,
                inscricaoStatus:
                    inscricaoStatus.rows,
                eventosCategoria: eventosCategoria.rows,
                eventosMaisInscricoes:
                    eventosMaisInscricao.rows,
                proximosEVentos: proximoEventos.rows
            });

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

//Rota Administrativa
app.get("/admin", exigirLogin, (req, res) => {
    res.render("admin", { usuario: req.session.usuario });
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
const inscricaoRoutes = require('./Routes/inscricaoRoutes');
app.use("/inscricoes", exigirLogin, inscricaoRoutes);

//logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//Execução
const porta = 3001;
app.listen(porta, () => {
    console.log(`Servidor: http://localhost:${porta}`);
});