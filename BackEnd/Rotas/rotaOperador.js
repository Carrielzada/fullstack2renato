import { Router } from "express";
import OperadorCTRL from "../Controle/operadorCtrl.js";

const rotaOperador = new Router();
const operadorCTRL = new OperadorCTRL();
//definição de endpoints que serão processadas pela camada de controle
//para um determinado operador

rotaOperador.post('/', operadorCTRL.gravar)
.put('/',operadorCTRL.atualizar)
.delete('/',operadorCTRL.excluir)
.get('/', operadorCTRL.consultar)
.get('/:cpf', operadorCTRL.consultarPeloCPF);

export default rotaOperador;