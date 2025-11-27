
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

        const cardapio = await response.json();
        itensPendentes = [];
        
        // Exibir QR code e link no modal
        exibirQRCodeModal(cardapio);
        
        formEstabelecimento.reset();
        carregarItens();

    } catch (error) {
        console.error("Erro ao adicionar item:", error);
        alert("Erro ao gerar cardápio. Tente novamente.");
    }
});

function exibirQRCodeModal(cardapio) {
    const qrcodeDiv = document.getElementById("qrcode");
    qrcodeDiv.innerHTML = "";
    
    if (cardapio.qrCode) {
        // Exibir imagem do QR code como base64
        const img = document.createElement("img");
        img.src = cardapio.qrCode;
        img.alt = "QR Code do cardápio";
        img.style.maxWidth = "300px";
        qrcodeDiv.appendChild(img);
    }
    
    // Atualizar link do cardápio
    const alertDiv = document.querySelector(".modal-body .alert-info");
    if (cardapio.url) {
        alertDiv.innerHTML = `
            <small>
                <i class="bi bi-link-45deg me-1"></i>
                Link: <strong>${cardapio.url}</strong>
            </small>
        `;
    }
    
    // Configurar botão de copiar link
    const copyBtn = document.getElementById("copyLinkBtn");
    copyBtn.onclick = () => {
        if (cardapio.url) {
            navigator.clipboard.writeText(cardapio.url);
            copyBtn.textContent = "✓ Copiado!";
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="bi bi-link-45deg me-1"></i>Copiar Link';
            }, 2000);
        }
    };
    
    // Mostrar modal
    const successModal = new bootstrap.Modal(document.getElementById("successModal"));
    successModal.show();
}

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
