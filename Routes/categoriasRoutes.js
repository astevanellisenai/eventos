const express = require('express');
const router = express.Router();
const BD = require('../db');


// ============================================
// LISTAR CATEGORIAS
// ============================================

router.get('/', async (req, res) => {
    try {
        const busca = String(req.query.busca || '').trim();
        const ordem = String(req.query.ordem || 'nome');

        const opcoesOrdenacao = {
            nome: 'nome ASC',
            nome_desc: 'nome DESC',
            id: 'id ASC',
            id_desc: 'id DESC'
        };
        const ordenarPor = opcoesOrdenacao[ordem] || opcoesOrdenacao.nome;

        const paginaRecebida = Number(req.query.pagina);
        let pagina = Number.isSafeInteger(paginaRecebida) && paginaRecebida > 0
            ? paginaRecebida
            : 1;

        const limite = 5;
        const pesquisa = `%${busca}%`;

        const totalResultado = await BD.query(`
            SELECT COUNT(*) AS total
            FROM categorias
            WHERE nome ILIKE $1
               OR COALESCE(descricao, '') ILIKE $1
        `, [pesquisa]);

        const totalRegistros = Number(totalResultado.rows[0].total);
        const totalPaginas = Math.max(1, Math.ceil(totalRegistros / limite));
        pagina = Math.min(pagina, totalPaginas);
        const offset = (pagina - 1) * limite;

        const resultado = await BD.query(`
            SELECT *
            FROM categorias
            WHERE nome ILIKE $1
               OR COALESCE(descricao, '') ILIKE $1
            ORDER BY ${ordenarPor}, id ASC
            LIMIT $2 OFFSET $3
        `, [pesquisa, limite, offset]);

        res.render('categorias/index', {
            categorias: resultado.rows,
            usuario: req.session.usuario,
            busca,
            ordem: opcoesOrdenacao[ordem] ? ordem : 'nome',
            pagina,
            totalPaginas,
            totalRegistros
        });
    } catch (erro) {
        console.log('Erro ao listar categorias:', erro);
        res.status(500).send('Erro ao carregar categorias');
    }
});


// ============================================
// ABRIR TELA NOVA CATEGORIA
// ============================================

router.get('/novo', (req, res) => {
    res.render('categorias/novo', {usuario: req.session.usuario});
});


// ============================================
// CADASTRAR CATEGORIA
// ============================================

router.post('/novo', async (req, res) => {
    const {nome,descricao} = req.body;
    try {
        await BD.query(`
            INSERT INTO categorias
            (nome,descricao)
            VALUES
            ($1,$2)
        `,
        [nome,descricao]);
        res.redirect('/categorias');
    }
    catch (erro) {
        console.log('Erro ao cadastrar categoria: ' + erro);
        res.status(500).send('Erro ao cadastrar categoria');
    }
});


// ============================================
// ABRIR TELA EDITAR CATEGORIA
// ============================================

router.get('/editar/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const resultado = await BD.query(`
            SELECT * FROM categorias
            WHERE id = $1
        `,[id]);
        if (resultado.rows.length === 0) {
            return res.status(404).send(
                'Categoria não encontrada'
            );
        }
        res.render('categorias/editar', {
            categoria: resultado.rows[0],
            usuario: req.session.usuario
        });
    }
    catch (erro) {
        console.log('Erro ao carregar categoria: ' + erro);
        res.status(500).send('Erro ao carregar categoria');
    }
});


// ============================================
// ATUALIZAR CATEGORIA
// ============================================

router.post('/editar/:id', async (req, res) => {
    const id = req.params.id;
    const {nome,descricao} = req.body;
    try {
        await BD.query(`
            UPDATE categorias
            SET
                nome = $1,
                descricao = $2
            WHERE id = $3
        `,
        [nome,descricao,id]);
        res.redirect('/categorias');
    }
    catch (erro) {
        console.log('Erro ao atualizar categoria: ' + erro);
        res.status(500).send('Erro ao atualizar categoria');
    }
});


// ============================================
// EXCLUIR CATEGORIA
// ============================================
router.post('/excluir/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await BD.query(`
            DELETE FROM categorias
            WHERE id = $1
        `,[id]);
        res.redirect('/categorias');
    }
    catch (erro) {
        console.log('Erro ao excluir categoria: ' + erro);
        res.status(500).send('Erro ao excluir categoria');
    }
});

module.exports = router;