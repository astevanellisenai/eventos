const express = require('express');
const router = express.Router();
const BD = require('../db');

//Listar
router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query(`
            select
                e.id,
                e.titulo,
                e.descricao,
                e.horario,
                e.local,
                e.quantidade_vagas,
                c.nome as categoria,
                u.nome as organizador
            from eventos e
            inner join categorias c
                       e.categoria_id = c.id
            inner join usuarios u
                       e.organizador_id = u.id
            order by e.id
            `);

        res.render('eventos/index', {
            eventos: resultado.rows
        });

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

//Create
router.get('/', async (req, res) => {
    try {
        const categorias = await BD.query(`
            select * from categorias 
            order by nome;`);

        const usuarios = await BD.query(`
            select * from usuarios 
            order by nome;`);

        res.render('eventos/novo', {
            categorias: categorias.rows,
            usuarios: usuarios.rows
        });

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

router.post('/', async (req, res) => {
    try {

        const { titulo,
            descricao,
            data_evento,
            horario,
            local,
            quantidade_vagas,
            imagem_url,
            categoria_id,
            organizador_id } = req.body;

        await BD.query(`
        insert into eventos
        (
        titulo, descricao, data_evento,
        horario, local, quantidade_vagas,
        imagem_url, categoria_id,
        organizador_id
        ) values 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9
        )
        `, [descricao, data_evento,
            horario, local, quantidade_vagas,
            imagem_url, categoria_id,
            organizador_id]);

        res.redirect('/eventos');

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

//editar
router.get('/editar/:id', async (req, res) => {

    try {

        const id = req.params.id;
        const eventos = BD.query(`
            select * from eventos where id = $1`,
            [id]
        );
        const categorias = await BD.query(`
            select * from categorias 
            order by nome;`);
        const usuarios = await BD.query(`
            select * from usuarios 
            order by nome;`);

        res.render('eventos/editar', {
            eventos: eventos.rows[0],
            categorias: categorias.rows,
            usuarios: usuarios.rows
        });

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

router.post('editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {
            titulo, descricao,
            data_evento, horario,
            local, quantidade_vagas,
            imagem_url, categoria_id,
            organizador_id
        } = req.body;

        await BD.query(`update eventos set
            titulo = $1,
            descricao = $2,
            data_evento = $3,
            horario = $4,
            local = $5,
            quantidade_vaga = $6,
            imagem_url = $7,
            categoria_id = $8,
            organizador_id = $9
            where id = $10
            `, [titulo, descricao,
            data_evento, horario,
            local, quantidade_vagas,
            imagem_url, categoria_id,
            organizador_id, id]);

        res.redirect('/eventos');

    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

//delete
router.post(';excluir/:id', async (req, res) => {
    try {

        const id = req.params.id;
        await BD.query(`delete from eventos 
                        where id = $1`,[id]);
        res.redirect('/eventos');
    } catch (erro) {
        console.log('Erro: ' + erro);
    }
});

module.exports = router;