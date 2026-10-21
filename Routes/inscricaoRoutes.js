const express = require('express');
const router = express.Router();
const BD = require('../db');


// ======================================================
// LISTAR INSCRIÇÕES
// ======================================================

router.get('/', async (req, res) => {

    try {

        const resultado = await BD.query(`
            SELECT
                i.id,
                i.participante_id,
                i.evento_id,
                i.data_inscricao,
                i.status,
                i.presente,
                p.nome AS participante,
                e.titulo AS evento

            FROM inscricoes i

            INNER JOIN participantes p
                ON i.participante_id = p.id

            INNER JOIN eventos e
                ON i.evento_id = e.id

            ORDER BY i.id
        `);

        res.render('inscricoes/index', {
            inscricoes: resultado.rows
        });

    } catch (erro) {

        console.log(
            'Erro ao listar inscrições: ' + erro
        );

        res.status(500).send(
            'Erro ao carregar inscrições'
        );

    }

});


// ======================================================
// ABRIR TELA NOVA INSCRIÇÃO
// ======================================================

router.get('/novo', async (req, res) => {

    try {

        const participantes = await BD.query(`
            SELECT *
            FROM participantes
            ORDER BY nome
        `);

        const eventos = await BD.query(`
            SELECT *
            FROM eventos
            ORDER BY titulo
        `);

        res.render('inscricoes/novo', {

            participantes: participantes.rows,
            eventos: eventos.rows

        });

    } catch (erro) {

        console.log(
            'Erro ao abrir cadastro de inscrição: ' + erro
        );

        res.status(500).send(
            'Erro ao abrir cadastro de inscrição'
        );

    }

});


// ======================================================
// CADASTRAR INSCRIÇÃO
// ======================================================

router.post('/novo', async (req, res) => {

    try {

        const {
            participante_id,
            evento_id,
            status
        } = req.body;

        const presente =
            req.body.presente === 'true';


        await BD.query(`
            INSERT INTO inscricoes
            (
                participante_id,
                evento_id,
                status,
                presente
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
            participante_id,
            evento_id,
            status,
            presente
        ]);


        res.redirect('/inscricoes');

    } catch (erro) {

        console.log(
            'Erro ao cadastrar inscrição: ' + erro
        );

        res.status(500).send(
            'Erro ao cadastrar inscrição'
        );

    }

});


// ======================================================
// ABRIR TELA EDITAR
// ======================================================

router.get('/editar/:id', async (req, res) => {

    try {

        const id = req.params.id;


        const inscricao = await BD.query(`
            SELECT *
            FROM inscricoes
            WHERE id = $1
        `,
        [
            id
        ]);


        if (inscricao.rows.length === 0) {

            return res.status(404).send(
                'Inscrição não encontrada'
            );

        }


        const participantes = await BD.query(`
            SELECT *
            FROM participantes
            ORDER BY nome
        `);


        const eventos = await BD.query(`
            SELECT *
            FROM eventos
            ORDER BY titulo
        `);


        res.render('inscricoes/editar', {

            inscricao: inscricao.rows[0],
            participantes: participantes.rows,
            eventos: eventos.rows

        });

    } catch (erro) {

        console.log(
            'Erro ao carregar inscrição: ' + erro
        );

        res.status(500).send(
            'Erro ao carregar inscrição'
        );

    }

});


// ======================================================
// ATUALIZAR INSCRIÇÃO
// ======================================================

router.post('/editar/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const {
            participante_id,
            evento_id,
            status
        } = req.body;

        const presente =
            req.body.presente === 'true';


        await BD.query(`
            UPDATE inscricoes

            SET
                participante_id = $1,
                evento_id = $2,
                status = $3,
                presente = $4

            WHERE id = $5
        `,
        [
            participante_id,
            evento_id,
            status,
            presente,
            id
        ]);


        res.redirect('/inscricoes');

    } catch (erro) {

        console.log(
            'Erro ao atualizar inscrição: ' + erro
        );

        res.status(500).send(
            'Erro ao atualizar inscrição'
        );

    }

});


// ======================================================
// EXCLUIR INSCRIÇÃO
// ======================================================

router.post('/excluir/:id', async (req, res) => {

    try {

        const id = req.params.id;


        await BD.query(`
            DELETE FROM inscricoes
            WHERE id = $1
        `,
        [
            id
        ]);


        res.redirect('/inscricoes');

    } catch (erro) {

        console.log(
            'Erro ao excluir inscrição: ' + erro
        );

        res.status(500).send(
            'Erro ao excluir inscrição'
        );

    }

});


module.exports = router;