const express = require('express');
const router = express.Router();
const BD = require('../db');


// ============================================
// LISTAR USUÁRIOS
// ============================================

router.get('/', async (req, res) => {
    try {
        const busca = String(req.query.busca || '').trim();
        const ordem = String(req.query.ordem || 'nome');
        const ordenacoes = {
            nome: 'u.nome ASC',
            nome_desc: 'u.nome DESC',
            id: 'u.id ASC',
            id_desc: 'u.id DESC',
            situacao: 'u.situacao DESC'
        };
        const ordenarPor = ordenacoes[ordem] || ordenacoes.nome;
        const paginaRecebida = Number(req.query.pagina);
        let pagina = Number.isSafeInteger(paginaRecebida) && paginaRecebida > 0
            ? paginaRecebida : 1;

        const limite = 5;
        const pesquisa = `%${busca}%`;

        const totalResultado = await BD.query(`
            SELECT COUNT(*) AS total
            FROM usuarios u
            WHERE u.nome ILIKE $1
                OR u.email ILIKE $1
        `, [pesquisa]);

        const totalRegistros = Number(totalResultado.rows[0].total);
        const totalPaginas = Math.max(1, Math.ceil(totalRegistros / limite));
        pagina = Math.min(pagina, totalPaginas);
        const offset = (pagina - 1) * limite;

        const resultado = await BD.query(`
            SELECT u.id, u.nome, u.email, u.situacao, u.criado_em FROM usuarios u
            WHERE u.nome ILIKE $1
                OR u.email ILIKE $1
            ORDER BY ${ordenarPor}, u.id ASC
            LIMIT $2 OFFSET $3
        `, [pesquisa, limite, offset]);

        res.render('usuarios/index', {
            usuarios: resultado.rows,
            usuario: req.session.usuario,
            busca,
            ordem: ordenacoes[ordem] ? ordem : 'nome',
            pagina,
            totalPaginas,
            totalRegistros
        });
    } catch (erro) {
        console.error('Erro ao listar usuarios:', erro);
        res.status(500).send('Erro ao carregar usuarios');
    }
});


// ============================================
// ABRIR FORMULÁRIO
// ============================================

router.get('/novo', (req, res) => {
    res.render('usuarios/novo', { usuario: req.session.usuario });

});


// ============================================
// CADASTRAR USUÁRIO
// ============================================

router.post('/novo', async (req, res) => {

    const {
        nome,
        email,
        senha,
        situacao
    } = req.body;

    try {

        await BD.query(`
            INSERT INTO usuarios
            (
                nome,
                email,
                senha,
                situacao
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
        `,
        [
            nome,
            email,
            senha,
            situacao
        ]);

        res.redirect('/usuarios');

    }
    catch (erro) {

        console.log(
            'Erro ao cadastrar usuário: ' + erro
        );

        res.status(500).send(
            'Erro ao cadastrar usuário'
        );

    }

});


// ============================================
// ABRIR TELA EDITAR
// ============================================

router.get('/editar/:id', async (req, res) => {

    const id = req.params.id;

    try {

        const resultado = await BD.query(`
            SELECT *
            FROM usuarios
            WHERE id = $1
        `,
        [
            id
        ]);

        if (resultado.rows.length === 0) {

            return res.status(404).send(
                'Usuário não encontrado'
            );

        }

        res.render('usuarios/editar', {
            usuarioEditado: resultado.rows[0],
            usuario: req.session.usuario
        });

    }
    catch (erro) {

        console.log(
            'Erro ao carregar usuário: ' + erro
        );

        res.status(500).send(
            'Erro ao carregar usuário'
        );

    }

});


// ============================================
// ATUALIZAR USUÁRIO
// ============================================

router.post('/editar/:id', async (req, res) => {

    const id = req.params.id;

    const {
        nome,
        email,
        senha,
        situacao
    } = req.body;

    try {

        await BD.query(`
            UPDATE usuarios
            SET
                nome = $1,
                email = $2,
                senha = $3,
                situacao = $4
            WHERE id = $5
        `,
        [
            nome,
            email,
            senha,
            situacao,
            id
        ]);

        res.redirect('/usuarios');

    }
    catch (erro) {

        console.log(
            'Erro ao atualizar usuário: ' + erro
        );

        res.status(500).send(
            'Erro ao atualizar usuário'
        );

    }

});


// ============================================
// EXCLUIR USUÁRIO
// ============================================

router.get('/excluir/:id', async (req, res) => {

    const id = req.params.id;

    try {

        await BD.query(`
            DELETE FROM usuarios
            WHERE id = $1
        `,
        [
            id
        ]);

        res.redirect('/usuarios');

    }
    catch (erro) {

        console.log(
            'Erro ao excluir usuário: ' + erro
        );

        res.status(500).send(
            'Erro ao excluir usuário'
        );

    }

});


module.exports = router;