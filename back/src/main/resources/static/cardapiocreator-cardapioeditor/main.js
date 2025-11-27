
document.addEventListener("DOMContentLoaded", carregarItens);

let itensPendentes = [];

document.getElementById("inputItem").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const dados = {
        nome: form.nome.value,
        valor: parseFloat(form.valor.value),
        descricao: form.descricao.value
    };

    itensPendentes.push(dados);

    console.log("Item adicionado localmente:", dados);
    console.log("Itens pendentes:", itensPendentes);

    carregarItens();
    form.reset();
});

document.getElementById("inputFinal").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (itensPendentes.length === 0) {
        alert("Nenhum item para enviar!");
        return;
    }

    const formEstabelecimento = document.getElementById("inputFinal");

    const payload = {
        nomeEstabelecimento: formEstabelecimento.nomeEstabelecimento.value,
        hexFundo: formEstabelecimento.hexFundo.value,
        hexTexto: formEstabelecimento.hexTexto.value,
        itensCardapio: itensPendentes
    };

    try {
        const response = await fetch("http://localhost:8080/creator/gerarCardapio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }

        await response.json();
        itensPendentes = [];
        alert("Cardápio gerado com sucesso!");
        formEstabelecimento.reset();
        carregarItens();

    } catch (error) {
        console.error("Erro ao adicionar item:", error);
        alert("Erro ao gerar cardápio. Tente novamente.");
    }
});

async function carregarItens() {
    const itens = itensPendentes;
    const ul = document.getElementById("itensCriados");
    ul.innerHTML = "";

    if (itens.length === 0) {
        ul.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <p class="mb-0">Nenhum item adicionado ainda</p>
                <small>Adicione itens usando o formulário acima</small>
            </div>
        `;
        return;
    }

    itens.forEach(item => {
        console.log("Renderizando:", item.nome);
        const itemElement = document.createElement("div");
        itemElement.className = "card mb-3 item-card";
        
        if (!item.descricao) {
            itemElement.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">${item.nome}</h5>
                        <span class="badge bg-primary fs-6">R$ ${item.valor.toFixed(2)}</span>
                    </div>
                </div>
            `;
        } else {
            itemElement.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${item.nome}</h5>
                        <span class="badge bg-primary fs-6">R$ ${item.valor.toFixed(2)}</span>
                    </div>
                    <p class="card-text text-muted mb-0">${item.descricao}</p>
                </div>
            `;
        }
        
        ul.appendChild(itemElement);
    });
}


carregarItens();
