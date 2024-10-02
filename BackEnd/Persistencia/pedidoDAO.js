import Pedido from "../Modelo/pedido.js";
import Operador from "../Modelo/operador.js";
import Categoria from "../Modelo/categoria.js";
import Maquinario from "../Modelo/maquinario.js";
import ItemPedido from "../Modelo/itemPedido.js";
import conectar from "./conexao.js";

export default class PedidoDao {
    async gravar(pedido) {
        //um pedido no banco de dados grava registro na tabela pedido e também na tabela pedido_maquinario
        if (pedido instanceof Pedido) {
            const conexao = await conectar();
            //garantir a transação das operações para que seja realizada de forma atômica
            await conexao.beginTransaction();
            try {
                //inserir na tabela pedido
                const sql = 'INSERT INTO pedido(operador_codigo, data_pedido, total) VALUES(?,str_to_date(?,"%d/%m/%Y"),?)';
                const parametros = [pedido.operador.cpf, pedido.data, pedido.total];
                const retorno = await conexao.execute(sql, parametros);
                pedido.codigo = retorno[0].insertId;
                //inserir na tabela item pedido
                const sql2 = 'INSERT INTO pedido_maquinario(pedido_codigo, maquinario_codigo, quantidade, preco_unitario) VALUES(?,?,?,?)';
                for (const item of pedido.itens) {
                    let parametros2 = [pedido.codigo, item.maquinario.codigo, item.quantidade, item.precoUnitario];
                    await conexao.execute(sql2, parametros2);
                }
                await conexao.commit(); //se chegou até aqui sem erros, confirmaremos as inclusões
                global.poolConexoes.releaseConnection(conexao);
            }
            catch (error) {
                await conexao.rollback(); //voltar o banco de dados ao estado anterior
                throw error; //throw = lançar
            }
        }

    }

    async alterar(pedido) {

    }

    async excluir(pedido) {
        const conexao = await conectar();
        try {
            await conexao.beginTransaction();
    
            // Excluir primeiro os itens relacionados na tabela pedido_maquinario
            const sql1 = 'DELETE FROM pedido_maquinario WHERE pedido_codigo = ?';
            await conexao.execute(sql1, [pedido.codigo]);
    
            // Excluir o pedido na tabela pedido
            const sql2 = 'DELETE FROM pedido WHERE codigo = ?';
            await conexao.execute(sql2, [pedido.codigo]);
    
            await conexao.commit();
            global.poolConexoes.releaseConnection(conexao);
    
        } catch (error) {
            await conexao.rollback(); // Desfazer as operações caso haja erro
            global.poolConexoes.releaseConnection(conexao);
            throw error;
        }
    }
    

    async consultar(termoBusca) {
        const listaPedidos = [];
        const conexao = await conectar();
        let sql = "";
        let parametros = [];
        
        if (!isNaN(termoBusca)) { // Assegurando que seja um código de pedido do tipo inteiro
            sql = `SELECT p.codigo, p.operador_codigo, p.data_pedido, p.total,
                        c.nome, c.endereco, c.telefone,
                        mq.mq_descricao, mq.mq_precoCusto, mq.mq_precoVenda, mq.mq_qtdEstoque,
                        cat.cat_codigo, cat.cat_descricao,
                        i.maquinario_codigo, i.quantidade, i.preco_unitario, i.quantidade * i.preco_unitario as subtotal
                    FROM pedido as p
                    INNER JOIN operador as c ON p.operador_codigo = c.cpf
                    INNER JOIN pedido_maquinario as i ON i.pedido_codigo = p.codigo
                    INNER JOIN maquinario as mq ON mq.mq_codigo = i.maquinario_codigo
                    INNER JOIN categoria as cat ON mq.cat_codigo = cat.cat_codigo
                    WHERE p.codigo = ?`;
            parametros = [termoBusca];
        } else {
            sql = `SELECT m.codigo, m.operador_codigo, m.data_pedido, m.total,
                        c.nome, c.endereco, c.telefone,
                        mq.mq_descricao, mq.mq_precoCusto, mq.mq_precoVenda, mq.mq_qtdEstoque,
                        cat.cat_codigo, cat.cat_descricao,
                        i.maquinario_codigo, i.quantidade, i.preco_unitario, i.quantidade * i.preco_unitario as subtotal
                    FROM pedido as p
                    INNER JOIN operador as c ON p.operador_codigo = c.cpf
                    INNER JOIN pedido_maquinario as i ON i.pedido_codigo = m.codigo
                    INNER JOIN maquinario as mq ON mq.mq_codigo = i.maquinario_codigo
                    INNER JOIN categoria as cat ON mq.cat_codigo = cat.cat_codigo
                    ORDER BY p.codigo`; // Adicionando ORDER BY para garantir a ordem dos pedidos
        }
    
        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);
    
        if (registros.length > 0) {
            let pedidoAtual = null;
    
            for (const registro of registros) {
                // Verifica se já estamos tratando o pedido atual
                if (!pedidoAtual || pedidoAtual.codigo !== registro.codigo) {
                    // Cria um novo pedido, se o pedido atual for diferente ou nulo
                    const operador = new Operador(
                        registro.operador_codigo, 
                        registro.nome, 
                        registro.telefone, 
                        registro.endereco
                    );
    
                    pedidoAtual = new Pedido(
                        registro.codigo, 
                        operador, 
                        new Date(registro.data_pedido).toLocaleDateString('pt-BR'),
                        registro.total, 
                        []
                    );
    
                    listaPedidos.push(pedidoAtual); // Adiciona o novo pedido à lista
                }
    
                // Adiciona os itens ao pedido atual
                const categoria = new Categoria(registro.cat_codigo, registro.cat_descricao);
                const maquinario = new Maquinario(
                    registro.maquinario_codigo, 
                    registro.mq_descricao, 
                    registro.mq_precoCusto, 
                    registro.mq_precoVenda, 
                    registro.mq_qtdEstoque, 
                    categoria
                );
    
                const itemPedido = new ItemPedido(
                    maquinario, 
                    registro.quantidade, 
                    registro.preco_unitario, 
                    registro.subtotal
                );
    
                pedidoAtual.itens.push(itemPedido); // Adiciona o item ao pedido atual
            }
        }
    
        return listaPedidos;
    }
    
}