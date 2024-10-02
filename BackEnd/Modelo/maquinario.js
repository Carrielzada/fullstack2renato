import MaquinarioDAO from "../Persistencia/maquinarioDAO.js";
import Categoria from "./categoria.js";

export default class Maquinario{
    #codigo;
    #descricao;
    #precoCusto;
    #precoVenda;
    #qtdEstoque;
    #categoria;


    constructor(codigo=0,descricao="", precoCusto=0, 
                precoVenda=0, qtdEstoque=0,
                categoria=null
                ){
        this.#codigo=codigo;
        this.#descricao=descricao;
        this.#precoCusto=precoCusto;
        this.#precoVenda=precoVenda;
        this.#qtdEstoque=qtdEstoque;
        this.#categoria=categoria;
    }

    get codigo(){
        return this.#codigo;
    }
    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(novaDesc){
        this.#descricao=novaDesc;
    }

    get precoCusto(){
        return this.#precoCusto;
    }

    set precoCusto(novoPreco){
        this.#precoCusto = novoPreco
    }

    get precoVenda(){
        return this.#precoVenda;
    }
    
    set precoVenda(novoPreco){
        this.#precoVenda = novoPreco
    }

    get qtdEstoque(){
        return this.#qtdEstoque;
    }

    set qtdEstoque(novaQtd){
        this.#qtdEstoque = novaQtd;
    }

    get categoria(){
        return this.#categoria;
    }

    set categoria(novaCat){   
        if (novaCat instanceof Categoria){
            this.#categoria = novaCat;
        }
    }  


    toJSON(){
        return {
            codigo:this.#codigo,
            descricao:this.#descricao,
            precoCusto:this.#precoCusto,
            precoVenda:this.#precoVenda,
            qtdEstoque:this.#qtdEstoque,
            categoria:this.#categoria
        }
    }

     //camada de modelo acessa a camada de persistencia
     async gravar(){
        const mqDAO = new MaquinarioDAO();
        await mqDAO.gravar(this);
     }
 
     async excluir(){
        const mqDAO = new MaquinarioDAO();
        await mqDAO.excluir(this);
     }
 
     async alterar(){
        const mqDAO = new MaquinarioDAO();
        await mqDAO.atualizar(this);
     }
 
     async consultar(termo){
        const mqDAO = new MaquinarioDAO();
        return await mqDAO.consultar(termo);
     }

}