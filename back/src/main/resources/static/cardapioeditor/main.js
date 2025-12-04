document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioBusca");
    const inicial = document.getElementById("buscaConteudo");
    const final = document.getElementById("conteudo");
    const naoEncontrado = document.getElementById("cardapioNaoEncontrado");
    const tentarNovamente = document.getElementById("tentarNovamente");
    const cardapiosList = document.getElementById("cardapiosList");
    const nomeBuscaInput = document.getElementById("nomeBusca");
    
    let itensPendentes = [];
    let todosCardapios = [];
    let cardapioCompleto = {};
    let nomeEstabelecimentoOriginal = "";
    let temaPredefinidoOriginal = "";
    
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
            
            const response = await fetch("https://projetointegrado-kper.onrender.com/cardapio/config/retornar");
            
            if (response.ok) {
                const cardapios = await response.json();
                todosCardapios = cardapios;
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
    window.filtrarCardapios = function() {
        const termoBusca = nomeBuscaInput.value.trim().toLowerCase();
        
        if (termoBusca === '') {
            exibirListaCardapios(todosCardapios);
            return;
        }
        
        const cardapiosFiltrados = todosCardapios.filter(cardapio => 
            cardapio.nomeEstabelecimento.toLowerCase().startsWith(termoBusca)
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
            const item = document.createElement("div");
            item.className = "list-group-item list-group-item-action";
            item.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div class="flex-grow-1" style="cursor: pointer;" data-cardapio-nome="${cardapio.nomeEstabelecimento}">
                        <h6 class="mb-0">
                            <i class="bi bi-journal-text me-2"></i>${cardapio.nomeEstabelecimento}
                        </h6>
                        <small class="text-muted">${cardapio.itensCardapio?.length || 0} itens</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirCardapio('${cardapio.nomeEstabelecimento}')" title="Excluir cardápio">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            
            const cardapioArea = item.querySelector('[data-cardapio-nome]');
            cardapioArea.addEventListener("click", () => {
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
    
    // Buscar cardápio específico
    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const nomeBusca = nomeBuscaInput.value.trim();
        
        if (!nomeBusca) {
            alert("Por favor, digite um nome para buscar.");
            return;
        }
        
        filtrarCardapios();
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

    // SALVAR ALTERAÇÕES - NOVO ENDPOINT COM nomeAntigo
    document.getElementById("inputFinal").addEventListener("submit", async (e) => {
        e.preventDefault();

        if (itensPendentes.length === 0) {
            alert("Nenhum item para salvar!");
            return;
        }

        const nomeEstabelecimento = document.getElementById("nomeEstabelecimento").value;

        if (!nomeEstabelecimento) {
            alert("Nome do estabelecimento é obrigatório!");
            return;
        }

        // Se não temos um nome original, não podemos atualizar
        if (!nomeEstabelecimentoOriginal) {
            alert("Erro: Não foi possível identificar o cardápio original.");
            return;
        }

        // Monta o payload com TODOS os campos necessários
        const payload = {
            nomeEstabelecimento: nomeEstabelecimento, // NOVO nome
            itensCardapio: itensPendentes,
            temaPredefinido: temaPredefinidoOriginal, // ← Sempre envia o tema
            hexFundo: cardapioCompleto.hexFundo || "",
            hexTexto: cardapioCompleto.hexTexto || "",
            url: cardapioCompleto.url || "",
            hexCorFundoPagina: cardapioCompleto.hexCorFundoPagina || "",
            hexCorFundoCard: cardapioCompleto.hexCorFundoCard || ""
        };

        console.log("Enviando payload:", JSON.stringify(payload, null, 2));
        console.log("Nome antigo (para buscar):", nomeEstabelecimentoOriginal);
        console.log("Novo nome:", nomeEstabelecimento);
        
        try {
            // NOVO ENDPOINT: usa nomeAntigo como path variable
            // Exemplo: PUT /creator/atualizarCardapio/Restaurante%20Teste
            const response = await fetch(`https://projetointegrado-kper.onrender.com/creator/atualizarCardapio/${encodeURIComponent(nomeEstabelecimentoOriginal)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            alert("Cardápio atualizado com sucesso!");
            console.log("Resposta do servidor:", result);
            
            // Atualiza as variáveis
            cardapioCompleto = result;
            nomeEstabelecimentoOriginal = nomeEstabelecimento; // Agora o novo nome é o "original"
            temaPredefinidoOriginal = result.temaPredefinido || temaPredefinidoOriginal;
            
            // Atualiza também o campo de entrada (já está com o novo nome)
            
            // Recarrega a lista para mostrar as mudanças
            carregarListaCardapios();

        } catch (error) {
            console.error("Erro ao atualizar cardápio:", error);
            alert("Erro ao atualizar cardápio: " + error.message);
            
            // Se for erro 404, oferece criar um novo
            if (error.message.includes("404")) {
                if (confirm("Cardápio não encontrado. O cardápio pode ter sido excluído.\n\nDeseja criar um novo cardápio com este nome?")) {
                    criarNovoCardapio(nomeEstabelecimento);
                }
            }
        }
    });

    // Função auxiliar para criar novo cardápio (fallback)
    async function criarNovoCardapio(nomeEstabelecimento) {
        const payload = {
            nomeEstabelecimento: nomeEstabelecimento,
            itensCardapio: itensPendentes,
            temaPredefinido: temaPredefinidoOriginal || "classico"
        };
        
        try {
            const response = await fetch("https://projetointegrado-kper.onrender.com/cardapio/config/criar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                const result = await response.json();
                alert("Novo cardápio criado com sucesso!");
                
                // Atualiza as variáveis
                cardapioCompleto = result;
                nomeEstabelecimentoOriginal = nomeEstabelecimento;
                temaPredefinidoOriginal = result.temaPredefinido || temaPredefinidoOriginal;
                
                carregarListaCardapios();
            } else {
                throw new Error("Erro ao criar cardápio");
            }
        } catch (error) {
            console.error("Erro ao criar cardápio:", error);
            alert("Erro ao criar cardápio: " + error.message);
        }
    }

    // Função para carregar dados do cardápio
    function carregarDadosCardapio(cardapio) {
        // Guarda TODO o objeto cardápio
        cardapioCompleto = cardapio;
        nomeEstabelecimentoOriginal = cardapio.nomeEstabelecimento || "";
        temaPredefinidoOriginal = cardapio.temaPredefinido || "";
        
        document.getElementById("nomeEstabelecimento").value = nomeEstabelecimentoOriginal;
        
        itensPendentes = cardapio.itensCardapio || cardapio.itens || [];
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
    
    // Função para excluir cardápio
    window.excluirCardapio = async function(nomeEstabelecimento) {
        if (!confirm(`Tem certeza que deseja excluir o cardápio "${nomeEstabelecimento}"?`)) {
            return;
        }
        
        try {
            const response = await fetch(`https://projetointegrado-kper.onrender.com/cardapio/config/excluir?nome=${encodeURIComponent(nomeEstabelecimento)}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Cardápio excluído com sucesso!');
                
                // Se está editando o cardápio que foi excluído, limpa tudo
                if (nomeEstabelecimento === nomeEstabelecimentoOriginal) {
                    cardapioCompleto = {};
                    nomeEstabelecimentoOriginal = "";
                    temaPredefinidoOriginal = "";
                    itensPendentes = [];
                    
                    // Volta para a tela inicial
                    inicial.classList.remove("hidden");
                    final.classList.add("hidden");
                    document.getElementById("nomeEstabelecimento").value = "";
                    carregarItens();
                }
                
                carregarListaCardapios();
            } else {
                throw new Error('Erro ao excluir cardápio');
            }
        } catch (error) {
            console.error('Erro ao excluir cardápio:', error);
            alert('Erro ao excluir cardápio. Tente novamente.');
        }
    }
    
    const btnIrParaCardapio = document.getElementById("irParaCardapio");
    if (btnIrParaCardapio) {
        btnIrParaCardapio.addEventListener("click", function() {
            const nomeEstabelecimento = document.getElementById("nomeEstabelecimento").value;
            if (nomeEstabelecimento) {
                const nomeFormatado = nomeEstabelecimento.replace(/ /g, "-");
                window.open(`/cardapio/${nomeFormatado}`, '_blank');
            } else {
                alert("Por favor, salve o cardápio primeiro!");
            }
        });
    }

    carregarItens();
});