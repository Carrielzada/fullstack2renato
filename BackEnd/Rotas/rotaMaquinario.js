import { Router } from "express";
import MaquinarioCtrl from "../Controle/maquinarioCtrl.js";

const maqCtrl = new MaquinarioCtrl();
const rotaMaquinario = new Router();

rotaMaquinario
.get('/', maqCtrl.consultar)
.get('/:termo', maqCtrl.consultar)
.post('/', maqCtrl.gravar)
.patch('/', maqCtrl.atualizar)
.put('/', maqCtrl.atualizar)
.delete('/', maqCtrl.excluir);

export default rotaMaquinario;