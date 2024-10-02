import Maquinario from "../Modelo/maquinario.js";
import Categoria from "../Modelo/categoria.js";

export default class MaquinarioCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const descricao = dados.descricao;
            const precoCusto = dados.precoCusto;
            const precoVenda = dados.precoVenda;
            const qtdEstoque = dados.qtdEstoque;
            const cat_codigo = dados.categoria.codigo;

            if (descricao && precoCusto > 0 && precoVenda > 0
                && qtdEstoque >= 0 && cat_codigo > 0) {
                const categoria = new Categoria(cat_codigo);
                const maquinario = new Maquinario(0, descricao, precoCusto,
                    precoVenda, qtdEstoque, categoria
                );
                //resolver a promise
                maquinario.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": maquinario.codigo,
                        "mensagem": "Maquinario incluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar o maquinario:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, os dados do maquinario segundo a documentação da API!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um maquinario!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const descricao = dados.descricao;
            const precoCusto = dados.precoCusto;
            const precoVenda = dados.precoVenda;
            const qtdEstoque = dados.qtdEstoque;
            const cat_codigo = dados.categoria.codigo;
            if (codigo && descricao && precoCusto > 0 && precoVenda > 0
                && qtdEstoque >= 0 && cat_codigo > 0) {
                const categoria = new Categoria(cat_codigo);
                const maquinario = new Maquinario(codigo, descricao, precoCusto,
                    precoVenda, qtdEstoque, categoria);
                //resolver a promise
                maquinario.alterar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Maquinario atualizado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar o maquinario:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do maquinario segundo a documentação da API!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um maquinario!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const maquinario = new Maquinario(codigo);
                //resolver a promise
                maquinario.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Maquinario excluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir o maquinario:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do maquinario!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um maquinario!"
            });
        }
    }


    consultar(requisicao, resposta) {
        resposta.type('application/json');
        //express, por meio do controle de rotas, será
        //preparado para esperar um termo de busca
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = "";
        }
        if (requisicao.method === "GET") {
            const maquinario = new Maquinario();
            maquinario.consultar(termo).then((listaMaquinarios) => {
                resposta.json(
                    {
                        status: true,
                        listaMaquinarios
                    });
            })
                .catch((erro) => {
                    resposta.json(
                        {
                            status: false,
                            mensagem: "Não foi possível obter os maquinarios: " + erro.message
                        }
                    );
                });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar maquinarios!"
            });
        }
    }
}