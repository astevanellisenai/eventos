const BD = require('./db');

async function testarConexao() {

    try {

        const resultado = await BD.query(
            'select now();'
        );

        console.log('conexão bem sucedida!');
        console.log(resultado.rows);

    } catch (erro) {
        console.log('Erro ao conectar:' + 
            erro.message);
    } finally {
        await BD.end();
    }
}
testarConexao();