const express = require('express');
const router = express.Router();
const BD = require('../db');


// ============================================
// LISTAR PARTICIPANTES
// ============================================

router.get('/', async (req, res) => {
    try {
        const busca = String(req.query.busca || '').trim();
        const ordem = String(req.query.ordem || 'nome');
        const ordenacoes = {
            nome: 'p.nome ASC',
            nome_desc: 'p.nome DESC',
            id: 'p.id ASC',
            id_desc: 'p.id DESC'
        };
        const ordenarPor = ordenacoes[ordem] || ordenacoes.nome;
        const paginaRecebida = Number(req.query.pagina);
        let pagina = Number.isSafeInteger(paginaRecebida) && paginaRecebida > 0
            ? paginaRecebida : 1;

        const limite = 5;
        const pesquisa = `%${busca}%`;

        const totalResultado = await BD.query(`
            SELECT COUNT(*) AS total
            FROM participantes p
            WHERE p.nome ILIKE $1
                OR p.email ILIKE $1
                OR COALESCE(p.telefone, '') ILIKE $1
        `, [pesquisa]);

        const totalRegistros = Number(totalResultado.rows[0].total);
        const totalPaginas = Math.max(1, Math.ceil(totalRegistros / limite));
        pagina = Math.min(pagina, totalPaginas);
        const offset = (pagina - 1) * limite;

        const resultado = await BD.query(`
            SELECT p.id, p.nome, p.email, p.telefone, p.criado_em FROM participantes p
            WHERE p.nome ILIKE $1
                OR p.email ILIKE $1
                OR COALESCE(p.telefone, '') ILIKE $1
            ORDER BY ${ordenarPor}, p.id ASC
            LIMIT $2 OFFSET $3
        `, [pesquisa, limite, offset]);

        res.render('participantes/index', {
            participantes: resultado.rows,
            usuario: req.session.usuario,
            busca,
            ordem: ordenacoes[ordem] ? ordem : 'nome',
            pagina,
            totalPaginas,
            totalRegistros
        });
    } catch (erro) {
        console.error('Erro ao listar participantes:', erro);
        res.status(500).send('Erro ao carregar participantes');
    }
});


// ============================================
// ABRIR FORMULÁRIO
// ============================================

router.get('/novo', (req, res) => {

    res.render('participantes/novo', { usuario: req.session.usuario });

});


// ============================================
// CADASTRAR PARTICIPANTE
// ============================================

router.post('/novo', async (req, res) => {

    const {
        nome,
        email,
        telefone
    } = req.body;

    try {

        await BD.query(`
            INSERT INTO participantes
            (
                nome,
                email,
                telefone
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
        `,
            [
                nome,
                email,
                telefone
            ]);

        res.redirect('/participantes');

    }
    catch (erro) {

        console.log(
            'Erro ao cadastrar participante: ' + erro
        );

        res.status(500).send(
            'Erro ao cadastrar participante'
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
            FROM participantes
            WHERE id = $1
        `,
            [
                id
            ]);

        if (resultado.rows.length === 0) {

            return res.status(404).send(
                'Participante não encontrado'
            );

        }

        res.render('participantes/editar', {
            participante: resultado.rows[0],
            usuario: req.session.usuario
        });

    }
    catch (erro) {

        console.log(
            'Erro ao carregar participante: ' + erro
        );

        res.status(500).send(
            'Erro ao carregar participante'
        );

    }

});


// ============================================
// ATUALIZAR PARTICIPANTE
// ============================================

router.post('/editar/:id', async (req, res) => {

    const id = req.params.id;

    const {
        nome,
        email,
        telefone
    } = req.body;

    try {

        await BD.query(`
            UPDATE participantes
            SET
                nome = $1,
                email = $2,
                telefone = $3
            WHERE id = $4
        `,
            [
                nome,
                email,
                telefone,
                id
            ]);

        res.redirect('/participantes');

    }
    catch (erro) {

        console.log(
            'Erro ao atualizar participante: ' + erro
        );

        res.status(500).send(
            'Erro ao atualizar participante'
        );

    }

});


// ============================================
// EXCLUIR PARTICIPANTE
// ============================================

router.get('/excluir/:id', async (req, res) => {

    const id = req.params.id;

    try {

        await BD.query(`
            DELETE FROM participantes
            WHERE id = $1
        `,
            [
                id
            ]);

        res.redirect('/participantes');

    }
    catch (erro) {

        console.log(
            'Erro ao excluir participante: ' + erro
        );

        res.status(500).send(
            'Erro ao excluir participante'
        );

    }

});


module.exports = router;