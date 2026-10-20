const express = require('express');
const router = express.Router();
const BD = require('../db');

router.get('/', async (req, res) => {

    try {
        const resultado = 
        await BD.query('select * from categorias');
        res.render('categorias/index', {
            categorias: resultado.rows
        });
    }
    catch (erro) {
        console.log(erro);
    }

});

//Create 
router.get('/novo', (req, res) => {
    res.render('categoria/novo');
});

router.post('/novo', async (req, res) => {

    try {
        const {nome, descricao} = req.body;

        await BD.query(`insert into categorias
            (nome, descricao) values 
        ($1, $2)`, [nome, descricao]);

        res.redirect('/categorias');
    }
    catch (erro) {
        console.log(erro);
    }
});

module.exports = router;