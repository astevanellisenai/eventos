const express = require('express');
const router = express.Router();
const BD = require('../db');


// ============================================
// LISTAR PARTICIPANTES
// ============================================

router.get('/', async (req, res) => {

    try {

        const resultado = await BD.query(`
            SELECT
                id,
                nome,
                email,
                telefone,
                criado_em
            FROM participantes
            ORDER BY nome
        `);

        res.render('participantes/index', {
            participantes: resultado.rows
        });

    }
    catch (erro) {

        console.log('Erro ao listar participantes: ' + erro);

        res.status(500).send(
            'Erro ao carregar participantes'
        );
    }

});


// ============================================
// ABRIR TELA NOVO PARTICIPANTE
// ============================================

router.get('/novo', (req, res) => {

    res.render('participantes/novo');

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
            participante: resultado.rows[0]
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