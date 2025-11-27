document.addEventListener("DOMContentLoaded", carregarItens);

let itensPendentes = [];

const valorInput = document.getElementById("valor");
if (valorInput) {
    valorInput.addEventListener("input", function(e) {
        let valor = e.target.value.replace(/\D/g, "");
        if (valor) {
            valor = (parseInt(valor) / 100).toFixed(2);
            e.target.value = valor;
        }
    });
}

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
        hexCorFundoPagina: formEstabelecimento.hexCorFundoPagina?.value || "#f5f7fa",
        hexCorFundoCard: formEstabelecimento.hexCorFundoCard?.value || "#ffffff",
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

        const data = await response.json();
        itensPendentes = [];
        
        exibirModalSucesso(data);
        
        formEstabelecimento.reset();
        carregarItens();

    } catch (error) {
        console.error("Erro ao adicionar item:", error);
        alert("Erro ao gerar cardápio. Tente novamente.");
    }
});

function exibirModalSucesso(data) {

    const qrcodeDiv = document.getElementById("qrcode");
    qrcodeDiv.innerHTML = `<img src="${data.qrCodeDataUrl}" alt="QR Code" style="max-width: 250px; border-radius: 8px;">`;
    
    const alertDiv = document.querySelector(".modal-body .alert-info");
    alertDiv.innerHTML = `
        <small>
            <i class="bi bi-link-45deg me-1"></i>
            <a href="${data.cardapioUrl}" target="_blank" style="color: #0c63e4; text-decoration: none; font-weight: 500;">
                ${data.cardapioUrl}
            </a>
        </small>
    `;
    
    window.cardapioUrl = data.cardapioUrl;
    
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

document.getElementById("copyLinkBtn").addEventListener("click", () => {
    if (window.cardapioUrl) {
        navigator.clipboard.writeText(window.cardapioUrl).then(() => {
            alert("Link copiado para a área de transferência!");
        }).catch(err => {
            console.error("Erro ao copiar:", err);
        });
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

    itens.forEach((item, index) => {
        console.log("Renderizando:", item.nome);
        const itemElement = document.createElement("div");
        itemElement.className = "item-card";
        
        if (!item.descricao) {
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.nome}</div>
                    <div class="item-price">R$ ${item.valor.toFixed(2)}</div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removerItem(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            `;
        } else {
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.nome}</div>
                    <small class="text-muted">${item.descricao}</small>
                    <div class="item-price">R$ ${item.valor.toFixed(2)}</div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removerItem(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            `;
        }
        
        ul.appendChild(itemElement);
    });
}

function removerItem(index) {
    itensPendentes.splice(index, 1);
    carregarItens();
}

carregarItens();