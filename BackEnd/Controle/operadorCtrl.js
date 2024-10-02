import Operador from '../Modelo/operador.js';

//esta classe irá manipular/controlar a entidade Operador
export default class OperadorCTRL{

    //método responsável por gravar os dados de um operador
    //das requisições (POST) vindas da internet por meio do protocolo http
    //recupera os dados de um operador (JSON) vindos da requisição
    //Vamos combinar que as respostas estão no formato JSON
    gravar(requisicao, resposta){
        resposta.type("application/json");
        
        if(requisicao.method === "POST" && requisicao.is('application/json')){
            const dados = requisicao.body;
            const cpf = dados.cpf;
            const nome = dados.nome;
            const endereco = dados.endereco;
            const bairro = dados.bairro;
            const cidade = dados.cidade;
            const uf = dados.uf;
            const telefone = dados.telefone;
            const email = dados.email;
            if(cpf && nome && endereco && bairro && cidade && uf && telefone && email)
            {
                //gravar esse operador
                const operador = new Operador(cpf, nome, endereco, bairro, cidade,
                                            uf,telefone,email);
                //método assíncrono gravar que instancia a camada de persistência e
                //grava um operador no banco de dados
                operador.gravar().then(()=>{
                    resposta.status(200).json({
                        status:true,
                        mensagem:"Operador gravado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status:false,
                        mensagem: erro.message
                    })
                });                                   
            }
            else
            {
               resposta.status(400).json({
                    status:false,
                    mensagem:"Informe adequadamente todos os dados de um operador conforme documentação da API!"
               });     
            }
        }
        else{
            //código 400 o erro é do usuário que fez a requisição
            resposta.status(400).json({
                status:false,
                mensagem:"Método não permitido ou operador no formato JSON não fornecido! Consulte a documentação da API"
            });
        }
    }

    //requisição HTTP do tipo PUT
    atualizar(requisicao, resposta){
        resposta.type("application/json");
        
        if(requisicao.method === "PUT" && requisicao.is('application/json')){
            const dados = requisicao.body;
            const cpf = dados.cpf;
            const nome = dados.nome;
            const endereco = dados.endereco;
            const bairro = dados.bairro;
            const cidade = dados.cidade;
            const uf = dados.uf;
            const telefone = dados.telefone;
            const email = dados.email;
            if(cpf && nome && endereco && bairro && cidade && uf && telefone && email)
            {
                //gravar esse operador
                const operador = new Operador(cpf, nome, endereco, bairro, cidade,
                                            uf,telefone,email);
                //método assíncrono gravar que instancia a camada de persistência e
                //grava um operador no banco de dados
                operador.atualizar().then(()=>{
                    resposta.status(200).json({
                        status:true,
                        mensagem:"Operador atualizado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status:false,
                        mensagem: erro.message
                    })
                });                                   
            }
            else
            {
               resposta.status(400).json({
                    status:false,
                    mensagem:"Informe adequadamente todos os dados de um operador conforme documentação da API!"
               });     
            }
        }
        else{
            //código 400 o erro é do usuário que fez a requisição
            resposta.status(400).json({
                status:false,
                mensagem:"Método não permitido ou operador no formato JSON não fornecido! Consulte a documentação da API"
            });
        }
    }

    excluir(requisicao, resposta){
        resposta.type("application/json");
        
        if(requisicao.method === "DELETE" && requisicao.is('application/json')){
            const dados = requisicao.body;
            const cpf = dados.cpf;
            if(cpf)
            {
                //gravar esse operador
                const operador = new Operador(cpf);
                //método assíncrono removerDoBanco que instancia a camada de persistência e
                //grava um operador no banco de dados
                operador.removerDoBancoDados().then(()=>{
                    resposta.status(200).json({
                        status:true,
                        mensagem:"Operador excluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status:false,
                        mensagem: erro.message
                    })
                });                                   
            }
            else
            {
               resposta.status(400).json({
                    status:false,
                    mensagem:"Informe cpf do operador conforme documentação da API!"
               });     
            }
        }
        else{
            //código 400 o erro é do usuário que fez a requisição
            resposta.status(400).json({
                status:false,
                mensagem:"Método não permitido ou operador no formato JSON não fornecido! Consulte a documentação da API"
            });
        }
    }

    consultar(requisicao, resposta){
        resposta.type("application/json");
        
        if(requisicao.method === "GET"){
            const operador = new Operador();
            //método assíncrono que recupera os operadores do banco dados
            operador.consultar('').then((operadores)=>{
                    resposta.status(200).json({
                        status:true,
                        listaOperadores:operadores
                    });
            }).catch((erro) => {
                resposta.status(500).json({
                    status:false,
                    mensagem: erro.message
                })
            });                                   
        }
        else{
            //código 400 o erro é do usuário que fez a requisição
            resposta.status(400).json({
                status:false,
                mensagem:"Método não permitido! Consulte a documentação da API"
            });
        }
    }

    //alguém poderá fazer a seguinte requisição:
    //GET http://localhost:3000/operadores/111.111.111-11
    consultarPeloCPF(requisicao, resposta){
        resposta.type("application/json");
        
        const cpf = requisicao.params['cpf'];
        
        if(requisicao.method === "GET"){
            const operador = new Operador();
            //método assíncrono que recupera os operadores do banco dados
            operador.consultarCPF(cpf).then((operador)=>{
                    resposta.status(200).json({
                        status:true,
                        listaOperadores:operador
                    });
            }).catch((erro) => {
                resposta.status(500).json({
                    status:false,
                    mensagem: erro.message
                })
            });                                   
        }
        else{
            //código 400 o erro é do usuário que fez a requisição
            resposta.status(400).json({
                status:false,
                mensagem:"Método não permitido! Consulte a documentação da API"
            });
        }
    }
}