export async function buscarTodosOperadores(token) {
    try {
        const resposta = await fetch("http://localhost:4000/operador", {
            method: "GET",
            headers: {
                "Authorization": token
            },
            credentials: 'include'
        });

        if (!resposta.ok) {
            console.error("Erro HTTP:", resposta.status);
            return [];
        }

        const dados = await resposta.json();
        console.log("Resposta da API:", dados);

        if (dados.status && Array.isArray(dados.listaOperadores)) {
            return dados.listaOperadores;
        } else {
            console.error("Erro ao buscar operadores:", dados);
            return [];
        }
    } catch (error) {
        console.error("Erro na solicitação de operadores:", error);
        return [];
    }
}
