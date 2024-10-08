import Operador from "../Modelo/operador.js";
import Pedido from "../Modelo/pedido.js";
import Maquinario from "../Modelo/maquinario.js";
import ItemPedido from "../Modelo/itemPedido.js";

export default class PedidoCtrl{
    gravar(requisicao, resposta){
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')){
            const dados = requisicao.body;
            //extraindo dados de um novo pedido
            const operador = dados.operador;
            const dataPedido = new Date(dados.dataPedido).toLocaleDateString();
            const totalPedido = dados.totalPedido;
            const itensPedido = dados.itens;
            //instanciando um objeto do tipo Pedido
            const objOperador = new Operador(operador.cpf);
            //instanciando uma lista de objetos do tipo ItensPedido
            let itens = [];
            for (const item of itensPedido){
                //instanciando um objeto do tipo Maquinario
                const maquinario = new Maquinario(item.codigo);
                //instanciando um objeto do tipo ItemPedido
                const objItem = new ItemPedido(maquinario, item.quantidade, item.precoUnitario);
                itens.push(objItem);
            }
            const pedido = new Pedido(0,objOperador, dataPedido, totalPedido, itens);
            //resolver a promise
            pedido.gravar().then(() => {
                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Pedido registrado com sucesso!",
                    "codigo": pedido.codigo
                });
            })
            .catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao registrar o pedido: " + erro.message
                });
            });
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida!"
            })
        }
        
    }

    consultar(requisicao, resposta){
        resposta.type('application/json');  
        if (requisicao.method === 'GET'){
            //tentar obter o código do pedido a partir dos parâmetros da URL 
            let termo = requisicao.params.termo;
            /*if (!isNaN(termo)){*/
            const pedido = new Pedido(0);
            pedido.consultar(termo).then((listaPedidos)=>{
                resposta.status(200).json({
                    "status": true,
                    "listaPedidos": listaPedidos
                })
            })
            .catch((erro)=>{
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar o pedido: " + erro.message
                });
            });
            /*}
            else{
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe um códido de pedido válido!"
                });
            }*/
        }
        else{
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida!"
            })
        }     
    }
    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE') {
            const pedidoId = requisicao.params.id; // Capturando o ID do pedido da URL
            
            if (pedidoId) {
                const pedido = new Pedido(pedidoId);
                
                // Chamando o método excluir do modelo Pedido
                pedido.excluir().then(() => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: `Pedido com código ${pedidoId} excluído com sucesso!`
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: `Erro ao excluir o pedido: ${erro.message}`
                    });
                });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "ID do pedido não foi fornecido!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método de requisição inválido!"
            });
        }
    }
}
