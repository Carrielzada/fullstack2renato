import Operador from '../Modelo/operador.js';
import conectar from "./conexao.js";

export default class OperadorDAO{

    async incluir(operador){

        if (operador instanceof Operador){
            const conexao = await conectar();
            const sql="INSERT INTO operador(cpf,nome,endereco,bairro,cidade, \
                                           estado,telefone, email) \
                                           VALUES(?,?,?,?,?,?,?,?)";
            const valores = [operador.cpf,operador.nome,operador.endereco, 
                             operador.bairro, operador.cidade, operador.uf,
                             operador.telefone, operador.email];                                        
            await conexao.query(sql,valores);
            global.poolConexoes.releaseConnection(conexao);
        }

    }

    async alterar(operador){
        
        if (operador instanceof Operador){
            const conexao = await conectar();
            const sql="UPDATE operador SET nome=?, endereco = ?,bairro = ?, \
                                      cidade = ?, estado = ?,telefone = ?, email = ? \
                       WHERE cpf=?";
            const valores = [operador.nome,operador.endereco, 
                             operador.bairro, operador.cidade, operador.uf,
                             operador.telefone, operador.email, operador.cpf];                                        
            await conexao.query(sql,valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(operador){

        if (operador instanceof Operador){
            const conexao = await conectar();
            const sql="DELETE FROM operador WHERE cpf=?";
            const valores = [operador.cpf];                                        
            await conexao.query(sql,valores);
            global.poolConexoes.releaseConnection(conexao);
        } 

    }

    async consultar(termo){
        const conexao = await conectar();
        const sql = "SELECT * FROM operador WHERE nome LIKE ?";
        const valores = ['%' + termo + '%']
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
        const listaOperadores = [];
        for(const row of rows){
            const operador = new Operador(row['cpf'],row['nome'],
            row['endereco'],row['bairro'],row['cidade'],row['estado'], 
            row['telefone'], row['email']);
            listaOperadores.push(operador);
        }
        return listaOperadores;
    }

    async consultarCPF(cpf){
        const conexao = await conectar();
        const sql = "SELECT * FROM operador WHERE cpf = ?";
        const valores = [cpf]
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
        const listaOperadores = [];
        for(const row of rows){
            const operador = new Operador(row['cpf'],row['nome'],
            row['endereco'],row['bairro'],row['cidade'],row['estado'], 
            row['telefone'], row['email']);
            listaOperadores.push(operador);
        }
        return listaOperadores;
    }
}