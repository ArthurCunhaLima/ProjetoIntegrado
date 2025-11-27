document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioBusca");
    const inicial = document.getElementById("buscaConteudo");
    const final = document.getElementById("conteudo");
    const naoEncontrado = document.getElementById("cardapioNaoEncontrado");
    const tentarNovamente = document.getElementById("tentarNovamente");
    
    let itensPendentes = [];
    
    // Buscar cardápio
    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const nomeBusca = document.getElementById("nomeBusca").value.trim();
        
        if (!nomeBusca) {
            alert("Por favor, digite um nome para buscar.");
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:8080/cardapio/config/retornar?nome=${encodeURIComponent(nomeBusca)}`);
            
            if (response.ok) {
                const cardapio = await response.json();
                inicial.classList.add("hidden");
                final.classList.remove("hidden");
                final.classList.add("fade-in");
                carregarDadosCardapio(cardapio);
            } else if (response.status === 404) {
                inicial.classList.add("hidden");
                naoEncontrado.classList.remove("hidden");
                naoEncontrado.classList.add("fade-in");
            } else {
                throw new Error(`Erro na busca: ${response.status}`);
            }
            
        } catch (error) {
            console.error("Erro ao buscar cardápio:", error);
            alert("Erro ao buscar cardápio. Tente novamente.");
        }
    });
    
    // Tentar novamente
    tentarNovamente.addEventListener("click", function() {
        naoEncontrado.classList.add("hidden");
        inicial.classList.remove("hidden");
        document.getElementById("nomeBusca").value = "";
        document.getElementById("nomeBusca").focus();
    });
    
    // Adicionar item
    document.getElementById("inputItem").addEventListener("submit", async (e) => {
        e.preventDefault();

        const form = e.target;
        const dados = {
            nome: form.nome.value,
            valor: parseFloat(form.valor.value),
            descricao: form.descricao.value
        };

        // Validações
        if (!dados.nome || !dados.valor) {
            alert("Nome e valor são obrigatórios!");
            return;
        }

        if (isNaN(dados.valor) || dados.valor <= 0) {
            alert("Valor deve ser um número positivo!");
            return;
        }

        itensPendentes.push(dados);
        console.log("Item adicionado localmente:", dados);
        
        carregarItens();
        form.reset();
    });

    // Salvar alterações
    document.getElementById("gerarCardapio").addEventListener("click", async (e) => {
        e.preventDefault();

        if (itensPendentes.length === 0) {
            alert("Nenhum item para salvar!");
            return;
        }

        const formEstabelecimento = document.getElementById("inputFinal");
        const nomeEstabelecimento = formEstabelecimento.nomeEstabelecimento.value;

        if (!nomeEstabelecimento) {
            alert("Nome do estabelecimento é obrigatório!");
            return;
        }

        const payload = {
            nomeEstabelecimento: nomeEstabelecimento,
            hexFundo: formEstabelecimento.hexFundo.value || "#ffffff",
            hexTexto: formEstabelecimento.hexTexto.value || "#000000",
            itensCardapio: itensPendentes
        };

        try {
            const response = await fetch("http://localhost:8080/creator/atualizarCardapio", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Erro na requisição: " + response.status);
            }

            const result = await response.json();
            alert("Cardápio atualizado com sucesso!");
            console.log("Resposta do servidor:", result);

        } catch (error) {
            console.error("Erro ao atualizar cardápio:", error);
            alert("Erro ao atualizar cardápio. Tente novamente.");
        }
    });

    // Função para carregar dados do cardápio
    function carregarDadosCardapio(cardapio) {
        document.getElementById("nomeEstabelecimento").value = cardapio.nome || "";
        
        // Ajuste conforme a estrutura real da sua API
        itensPendentes = cardapio.itensCardapio || cardapio.itens || [];
        
        // Se a API retornar cores, preencha os campos
        if (cardapio.hexFundo) {
            document.getElementById("hexFundo").value = cardapio.hexFundo;
        }
        if (cardapio.hexTexto) {
            document.getElementById("hexTexto").value = cardapio.hexTexto;
        }
        
        carregarItens();
    }
    
    // Função para carregar itens na lista
    function carregarItens() {
        const ul = document.getElementById("itensCriados");
        ul.innerHTML = "";

        if (itensPendentes.length === 0) {
            ul.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p class="mb-0">Nenhum item adicionado ainda</p>
                    <small>Adicione itens usando o formulário acima</small>
                </div>
            `;
            return;
        }

        itensPendentes.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className = "card mb-3 item-card";
            
            // Adicionar animação
            itemElement.style.opacity = "0";
            itemElement.style.transform = "translateY(20px)";
            
            setTimeout(() => {
                itemElement.style.transition = "all 0.5s ease";
                itemElement.style.opacity = "1";
                itemElement.style.transform = "translateY(0)";
            }, index * 100);

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

    // Inicializar
    carregarItens();
});
