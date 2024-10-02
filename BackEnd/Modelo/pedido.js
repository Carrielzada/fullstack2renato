import PedidoDAO from "../Persistencia/pedidoDAO.js";
export default class Pedido {
    #codigo;
    #operador;
    #data;
    #total;
    #itens;

    constructor(codigo, operador, data,  total, itens) {
        this.#codigo = codigo;
        this.#operador = operador;
        this.#data = data;
        this.#total = total;
        this.#itens = itens;
    }

    // Métodos de acesso (get) e modificação (set)

    // Código
    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        if (novoCodigo === "" || typeof novoCodigo !== "number") {
            console.log("Formato de dado inválido");
        } else {
            this.#codigo = novoCodigo;
        }
    }

    // Código do Operador
    get operador() {
        return this.#operador;
    }

    set operador(novooperador) {
        this.#operador = novooperador;
        
    }

    // Data
    get data() {
        return this.#data;
    }

    set data(novaData) {
        this.#data = novaData;
    }

    // Total do Pedido
    get total() {
        return this.#total;
    }

    set total(novoTotal) {
        this.#total = novoTotal;
    }

    // Maquinarios
    get itens() {
        return this.#itens;
    }

    set maquinarios(novosItens) {
        this.#itens = novosItens;
    }
    // JSON
    toJSON() {
        return {
            'codigo': this.#codigo,
            'operador': this.#operador,
            'data': this.#data,
            'total': this.#total,
            'maquinarios': this.#itens

        };
    }

    async gravar() {
        const pedidoDAO = new PedidoDAO();
        this.codigo = await pedidoDAO.gravar(this);
    }

    async atualizar() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.alterar(this);
    }

    async apagar() {
        const pedidoDAO = new PedidoDAO();
        await pedidoDAO.deletar(this);
    }

    async consultar(termoBusca) {
        const pedidoDAO = new PedidoDAO();
        const listaPedidos = await pedidoDAO.consultar(termoBusca);
        return listaPedidos;
    }
    
}
