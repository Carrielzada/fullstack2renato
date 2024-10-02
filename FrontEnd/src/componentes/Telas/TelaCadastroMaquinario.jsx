import { Alert } from "react-bootstrap";
import FormCadMaquinarios from "./Formularios/FormCadMaquinario";
import Pagina from "../Templates/Pagina";
import { useEffect, useState, useContext } from "react";
import TabelaMaquinarios from "./Tabelas/TabelaMaquinarios";
import { consultarTodos } from "../../servicos/maquinarioService";
import { ContextoUsuarioLogado } from "../../App";

export default function TelaCadastroMaquinario(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);
    const [exibirTabela, setExibirTabela] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [maquinarioSelecionado, setMaquinarioSelecionado] = useState({
        codigo: 0,
        descricao: "",
        precoCusto: 0,
        precoVenda: 0,
        categoria: {
            codigo: 0,
            descricao: ""
        },
        urlImagem: "",
        qtdEstoque: 0,
    });
    const [listaDeMaquinarios, setListaDeMaquinarios] = useState([]);

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        consultarTodos(token).then((resposta) => {
            setListaDeMaquinarios(resposta.listaMaquinarios);
        }).catch((erro) => {
            alert("Erro ao enviar a requisição: " + erro.message);
        });
    }, [atualizarTela, exibirTabela]);
   
    return (
        <div>
            <Pagina>
                |<Alert className="mt-02 mb-02 success text-center" variant="success">
                    <h2>
                        Cadastro de Maquinario
                    </h2>
                </Alert>
                {
                    exibirTabela ?
                        <TabelaMaquinarios listaDeMaquinarios={listaDeMaquinarios} 
                                        setExibirTabela={setExibirTabela}
                                        setModoEdicao={setModoEdicao}
                                        setMaquinarioSelecionado={setMaquinarioSelecionado} 
                                        setAtualizarTela={setAtualizarTela}/> :
                        <FormCadMaquinarios setExibirTabela={setExibirTabela}
                                         setModoEdicao={setModoEdicao}
                                         modoEdicao={modoEdicao}
                                         setMaquinarioSelecionado={setMaquinarioSelecionado}
                                         maquinarioSelecionado={maquinarioSelecionado}
                                         setAtualizarTela={setAtualizarTela} />
                }
            </Pagina>
        </div>
    );

}