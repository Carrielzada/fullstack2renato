import Maquinario from '../Modelo/maquinario.js';
import Categoria from '../Modelo/categoria.js';

import conectar from './conexao.js';

export default class MaquinarioDAO {

    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS maquinario(
                mq_codigo INT NOT NULL AUTO_INCREMENT,
                mq_descricao VARCHAR(100) NOT NULL,
                mq_precoCusto DECIMAL(10,2) NOT NULL DEFAULT 0,
                mq_precoVenda DECIMAL(10,2) NOT NULL DEFAULT 0,
                mq_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
                cat_codigo INT NOT NULL,
                CONSTRAINT pk_maquinario PRIMARY KEY(mq_codigo),
                CONSTRAINT fk_categoria FOREIGN KEY(cat_codigo) REFERENCES categoria(cat_codigo)
            )
        `;
            await conexao.execute(sql);
            global.poolConexoes.releaseConnection(conexao);
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }


    async gravar(maquinario) {
        if (maquinario instanceof Maquinario) {
            const sql = `INSERT INTO maquinario(mq_descricao, mq_precoCusto,
                mq_precoVenda, mq_qtdEstoque, cat_codigo)
                VALUES(?,?,?,?,?)`;
            const parametros = [maquinario.descricao, maquinario.precoCusto, maquinario.precoVenda,
            maquinario.qtdEstoque, maquinario.categoria.codigo];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            maquinario.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    async atualizar(maquinario) {
        if (maquinario instanceof Maquinario) {  
            const sql = `UPDATE maquinario SET mq_descricao = ?, mq_precoCusto = ?,
            mq_precoVenda = ?, mq_qtdEstoque = ?, cat_codigo = ?
            WHERE mq_codigo = ?`;
            const parametros = [maquinario.descricao, maquinario.precoCusto, maquinario.precoVenda,
            maquinario.qtdEstoque, maquinario.categoria.codigo, maquinario.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(maquinario) {
        if (maquinario instanceof Maquinario) {
            const sql = `DELETE FROM maquinario WHERE mq_codigo = ?`;
            const parametros = [maquinario.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        if (!termo){
            termo="";
        }
        //termo é um número
        const conexao = await conectar();
        let listaMaquinarios = [];
        if (!isNaN(parseInt(termo))){
            //consulta pelo código do maquinario
            const sql = `SELECT m.mq_codigo, m.mq_descricao,
                         m.mq_precoCusto, m.mq_precoVenda, 
                         m.mq_qtdEstoque, c.cat_codigo, c.cat_descricao
                         FROM maquinario m 
                         INNER JOIN categoria c ON m.cat_codigo = c.cat_codigo
                         WHERE m.mq_codigo = ?
                         ORDER BY m.mq_descricao;               
            `;
            const parametros=[termo];
            const [registros, campos] = await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
            for (const registro of registros){
                const maquinario = new Maquinario(registro.mq_codigo,registro.mq_descricao,
                                            registro.mq_precoCusto,registro.mq_precoVenda,
                                            registro.mq_qtdEstoque
                                            );
                listaMaquinarios.push(maquinario);
            }
        }
        else
        {
            //consulta pela descrição do maquinario
            const sql = `SELECT m.mq_codigo, m.mq_descricao,
                         m.mq_precoCusto, m.mq_precoVenda, 
                         m.mq_qtdEstoque, c.cat_codigo, c.cat_descricao
                         FROM maquinario m 
                         INNER JOIN categoria c ON m.cat_codigo = c.cat_codigo
                         WHERE m.mq_descricao like ?
                         ORDER BY m.mq_descricao`;
            const parametros=['%'+termo+'%'];
            const [registros, campos] = await conexao.execute(sql,parametros);
            for (const registro of registros){
                const categoria = new Categoria(registro.cat_codigo, registro.cat_descricao);
                const maquinario = new Maquinario(registro.mq_codigo,registro.mq_descricao,
                                            registro.mq_precoCusto,registro.mq_precoVenda,
                                            registro.mq_qtdEstoque,
                                            categoria
                                            );
                listaMaquinarios.push(maquinario);
            }
        }

        return listaMaquinarios;
    }
}