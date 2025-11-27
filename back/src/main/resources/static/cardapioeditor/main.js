document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioBusca");
    const inicial = document.getElementById("buscaConteudo");
    const final = document.getElementById("conteudo");
    const naoEncontrado = document.getElementById("cardapioNaoEncontrado");
    const tentarNovamente = document.getElementById("tentarNovamente");
    const cardapiosList = document.getElementById("cardapiosList");
    const nomeBuscaInput = document.getElementById("nomeBusca");
    
    let itensPendentes = [];
    let todosCardapios = []; // Array para armazenar todos os cardápios
    
    carregarListaCardapios();
    
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
    
    // Função para carregar lista de cardápios
    async function carregarListaCardapios() {
        try {
            cardapiosList.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <small class="text-muted ms-2">Carregando cardápios...</small>
                </div>
            `;
            
            const response = await fetch("http://localhost:8080/cardapio/config/retornar");
            
            if (response.ok) {
                const cardapios = await response.json();
                todosCardapios = cardapios; // Armazena todos os cardápios
                exibirListaCardapios(cardapios);
            } else {
                cardapiosList.innerHTML = '<p class="text-muted text-center">Nenhum cardápio disponível</p>';
            }
        } catch (error) {
            console.error("Erro ao carregar cardápios:", error);
            cardapiosList.innerHTML = '<p class="text-danger text-center">Erro ao carregar cardápios</p>';
        }
    }
    
    // Função para filtrar cardápios em tempo real
    function filtrarCardapios() {
        const termoBusca = nomeBuscaInput.value.trim().toLowerCase();
        
        if (termoBusca === '') {
            // Se o campo estiver vazio, mostrar todos os cardápios
            exibirListaCardapios(todosCardapios);
            return;
        }
        
        // Filtrar cardápios pelo nome do estabelecimento
        const cardapiosFiltrados = todosCardapios.filter(cardapio => 
            cardapio.nomeEstabelecimento.toLowerCase().includes(termoBusca)
        );
        
        exibirListaCardapios(cardapiosFiltrados);
    }
    
    // Função para exibir lista de cardápios
    function exibirListaCardapios(cardapios) {
        cardapiosList.innerHTML = "";
        
        if (cardapios.length === 0) {
            cardapiosList.innerHTML = `
                <div class="text-center py-3">
                    <i class="bi bi-search display-6 text-muted mb-2"></i>
                    <p class="text-muted mb-0">Nenhum cardápio encontrado</p>
                    <small class="text-muted">Tente buscar com outro termo</small>
                </div>
            `;
            return;
        }
        
        cardapios.forEach(cardapio => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "list-group-item list-group-item-action text-start";
            item.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <h6 class="mb-0">
                        <i class="bi bi-bookmark me-2"></i>${cardapio.nomeEstabelecimento}
                    </h6>
                    <small class="text-muted">${cardapio.itensCardapio?.length || 0} itens</small>
                </div>
                ${cardapio.descricao ? `<small class="text-muted">${cardapio.descricao}</small>` : ''}
            `;
            item.addEventListener("click", () => {
                carregarCardapioParaEdicao(cardapio);
            });
            cardapiosList.appendChild(item);
        });
    }
    
    // Função para carregar cardápio para edição
    function carregarCardapioParaEdicao(cardapio) {
        inicial.classList.add("hidden");
        final.classList.remove("hidden");
        final.classList.add("fade-in");
        carregarDadosCardapio(cardapio);
    }
    
    // Buscar cardápio específico (para o formulário de submit)
    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const nomeBusca = nomeBuscaInput.value.trim();
        
        if (!nomeBusca) {
            alert("Por favor, digite um nome para buscar.");
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:8080/cardapio/config/buscar?nome=${encodeURIComponent(nomeBusca)}`);
            
            if (response.ok) {
                const cardapio = await response.json();
                if (cardapio && cardapio.nomeEstabelecimento) {
                    // Redirecionar para o cardápio
                    const nomeFormatado = cardapio.nomeEstabelecimento.replace(/ /g, "-");
                    window.location.href = `/pages/cardapio/${nomeFormatado}`;
                } else {
                    // Cardápio nulo
                    exibirNaoEncontrado();
                }
            } else if (response.status === 404) {
                exibirNaoEncontrado();
            } else {
                throw new Error(`Erro na busca: ${response.status}`);
            }
            
        } catch (error) {
            console.error("Erro ao buscar cardápio:", error);
            alert("Erro ao buscar cardápio. Tente novamente.");
        }
    });
    
    // Função para exibir "não encontrado"
    function exibirNaoEncontrado() {
        inicial.classList.add("hidden");
        naoEncontrado.classList.remove("hidden");
        naoEncontrado.classList.add("fade-in");
    }
    
    // Tentar novamente
    tentarNovamente.addEventListener("click", function() {
        naoEncontrado.classList.add("hidden");
        inicial.classList.remove("hidden");
        nomeBuscaInput.value = "";
        nomeBuscaInput.focus();
        // Recarregar lista completa
        exibirListaCardapios(todosCardapios);
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
    document.getElementById("inputFinal").addEventListener("submit", async (e) => {
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
            hexCorFundoPagina: formEstabelecimento.hexCorFundoPagina?.value || "#f5f7fa",
            hexCorFundoCard: formEstabelecimento.hexCorFundoCard?.value || "#ffffff",
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
        document.getElementById("nomeEstabelecimento").value = cardapio.nomeEstabelecimento || "";
        
        // Ajuste conforme a estrutura real da sua API
        itensPendentes = cardapio.itensCardapio || cardapio.itens || [];
        
        // Se a API retornar cores, preencha os campos
        if (cardapio.hexFundo) {
            document.getElementById("hexFundo").value = cardapio.hexFundo;
        }
        if (cardapio.hexTexto) {
            document.getElementById("hexTexto").value = cardapio.hexTexto;
        }
        if (cardapio.hexCorFundoPagina) {
            document.getElementById("hexCorFundoPagina").value = cardapio.hexCorFundoPagina;
        }
        if (cardapio.hexCorFundoCard) {
            document.getElementById("hexCorFundoCard").value = cardapio.hexCorFundoCard;
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
            itemElement.className = "item-card";
            
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

    window.removerItem = function(index) {
        itensPendentes.splice(index, 1);
        carregarItens();
    }

    // Inicializar
    carregarItens();
});