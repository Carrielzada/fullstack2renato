import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import CaixaSelecao from '../../busca/CaixaSelecao';
import { useState, useContext } from 'react';
import { ContextoUsuarioLogado } from '../../../App';
import { alterar, gravar } from '../../../servicos/maquinarioService';

export default function FormCadMaquinarios(props) {

    const contextoUsuario = useContext(ContextoUsuarioLogado);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(props.maquinarioSelecionado.categoria);
    const [maquinario, setMaquinario] = useState(props.maquinarioSelecionado);
    const [validado, setValidado] = useState(false);

    function manipularMudanca(evento){
        setMaquinario({
            ...maquinario,
            [evento.target.name]: evento.target.value
        });
    }

    function manipularSubmissao(evento){
        const token = contextoUsuario.usuarioLogado.token;
        const formulario = evento.currentTarget;
        if(formulario.checkValidity()){
            const dados = { ...maquinario, categoria: categoriaSelecionada };
            if(!props.modoEdicao){
                gravar(dados, token).then((resposta) => {
                    alert(resposta.mensagem);
                    if (resposta.status) {
                        props.setExibirTabela(true);    
                    }
                }).catch((erro) => {
                    alert("Erro ao enviar a requisição: " + erro.message);
                });
                
            }
            else{
                alterar(dados, token).then((resposta) => {
                    alert(resposta.mensagem);
                    props.setModoEdicao(false);
                    setMaquinario({
                        codigo: 0,
                        descricao: "",
                        precoCusto: 0,
                        precoVenda: 0,
                        categoria: {
                            codigo: 0,
                            descricao: ""
                        },
                        qtdEstoque: 0})
                    props.setMaquinarioSelecionado({ codigo: 0,
                        descricao: "",
                        precoCusto: 0,
                        precoVenda: 0,
                        categoria: {
                            codigo: 0,
                            descricao: ""
                        },
                        qtdEstoque: 0});
                }).catch((erro) => {
                    alert("Erro ao enviar a requisição: " + erro.message);
                });
            }
            setValidado(false);
        }
        else{
            setValidado(true);
        }
        evento.stopPropagation();
        evento.preventDefault();    
    }

    return (
        <Form noValidate validated={validado} onSubmit={manipularSubmissao}>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Código</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="codigo"
                        name="codigo"
                        value={maquinario.codigo}
                        onChange={manipularMudanca}
                        disabled
                    />
                    <Form.Control.Feedback type='invalid'>Por favor, informe o código do maquinario!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="descricao"
                        name="descricao"
                        value={maquinario.descricao}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe a descrição do maquinario!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Preço de Custo:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="precoCusto">R$</InputGroup.Text>
                        <Form.Control
                            type="text"
                            id="precoCusto"
                            name="precoCusto"
                            aria-describedby="precoCusto"
                            onChange={manipularMudanca}
                            value={maquinario.precoCusto}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe o preço de custo!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <Form.Label>Preço de Venda:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="precoVenda">R$</InputGroup.Text>
                        <Form.Control
                            type="text"
                            id="precoVenda"
                            name="precoVenda"
                            aria-describedby="precoVenda"
                            onChange={manipularMudanca}
                            value={maquinario.precoVenda}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe o preço de venda!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4" >
                    <Form.Label>Qtd em estoque:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="qtdEstoque">+</InputGroup.Text>
                        <Form.Control
                            type="text"
                            id="qtdEstoque"
                            name="qtdEstoque"
                            aria-describedby="qtdEstoque"
                            onChange={manipularMudanca}
                            value={maquinario.qtdEstoque}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe a quantidade em estoque!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Col md={8}>
                    <Form.Label>Categoria:</Form.Label>
                    <CaixaSelecao enderecoFonteDados={"http://localhost:4000/categoria"} 
                                  campoChave={"codigo"}
                                  campoExibicao={"descricao"}
                                  funcaoSelecao={setCategoriaSelecionada}
                                  localLista={"listaCategorias"}
                                  tokenAcesso={contextoUsuario.usuarioLogado.token}/>
                </Col>
            </Row>
            <Row className='mt-2 mb-2'>
                <Col md={1}>
                    <Button type="submit">{props.modoEdicao ? 'Alterar' : 'Cadastrar'}</Button>
                </Col>
                <Col md={{offset:1}}>
                    <Button onClick={()=>{
                        props.setExibirTabela(true);
                    }}>Voltar</Button>
                </Col>
            </Row>
        </Form>

    );
}