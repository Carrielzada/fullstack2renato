export default class ItemPedido {
    #maquinario;
    #quantidade;
    #precoUnitario;
    #subtotal; 
    
    constructor(maquinario, quantidade, precoUnitario,subtotal) {
        this.#maquinario = maquinario;
        this.#quantidade = quantidade;
        this.#precoUnitario = precoUnitario;
        this.#subtotal = quantidade * precoUnitario;
    }

    // Métodos de acesso (get) e modificação (set)
    get maquinario() {
        return this.#maquinario;
    }

    set maquinario(novoMaquinario) {
        this.#maquinario = novoMaquinario;
    }

    get quantidade() {
        return this.#quantidade;
    }

    set quantidade(novaQuantidade) {
        this.#quantidade = novaQuantidade;
    }
    
    get precoUnitario() {
        return this.#precoUnitario;
    }

    set precoUnitario(novoPrecoUnitario) {
        this.#precoUnitario = novoPrecoUnitario;
    }
    // Maquinario Nome
    
    get subtotal() {
        this.#subtotal = this.#quantidade * this.#precoUnitario;
        return this.#subtotal;
    }

    
    // JSON
    toJSON() {
        return {
            'maquinario': this.#maquinario,
            'quantidade': this.#quantidade,
            'precoUnitario': this.#precoUnitario,
            'subtotal': this.#subtotal
        };
    }
}

