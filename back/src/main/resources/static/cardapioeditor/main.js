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
    window.filtrarCardapios = function() {
        const termoBusca = nomeBuscaInput.value.trim().toLowerCase();
        
        if (termoBusca === '') {
            // Se o campo estiver vazio, mostrar todos os cardápios
            exibirListaCardapios(todosCardapios);
            return;
        }
        
        // Filtrar cardápios que começam com o termo buscado
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
            
            // Adicionar evento de clique apenas na área do nome
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
    
    // Buscar cardápio específico (para o formulário de submit)
    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const nomeBusca = nomeBuscaInput.value.trim();
        
        if (!nomeBusca) {
            alert("Por favor, digite um nome para buscar.");
            return;
        }
        
        // Apenas filtrar a lista, não redirecionar
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

    // Salvar alterações - CORRIGIDO
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

        // ESTRATÉGIA: Tentar atualizar normalmente primeiro
        const payload = {
            nomeEstabelecimento: nomeEstabelecimento,
            itensCardapio: itensPendentes,
            temaPredefinido: temaPredefinidoOriginal // Mantém o tema original
        };

        console.log("Tentando atualizar cardápio:", JSON.stringify(payload, null, 2));
        
        try {
            const response = await fetch("https://projetointegrado-kper.onrender.com/creator/atualizarCardapio", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // SUCESSO: O nome não mudou ou o backend aceitou a mudança
                const result = await response.json();
                alert("Cardápio atualizado com sucesso!");
                console.log("Resposta do servidor:", result);
                
                // Atualiza o nome original
                nomeEstabelecimentoOriginal = nomeEstabelecimento;
                return;
            }
            
            // Se deu erro 404, pode ser porque o nome mudou
            if (response.status === 404) {
                // ESTRATÉGIA: O nome mudou, precisa recriar o cardápio
                
                // Primeiro exclui o cardápio antigo
                try {
                    await fetch(`https://projetointegrado-kper.onrender.com/cardapio/config/excluir?nome=${encodeURIComponent(nomeEstabelecimentoOriginal)}`, {
                        method: 'DELETE'
                    });
                    console.log("Cardápio antigo excluído:", nomeEstabelecimentoOriginal);
                } catch (deleteError) {
                    console.warn("Não foi possível excluir cardápio antigo:", deleteError);
                }
                
                // Cria um novo cardápio com o novo nome
                const criarResponse = await fetch("https://projetointegrado-kper.onrender.com/cardapio/config/criar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                
                if (criarResponse.ok) {
                    const result = await criarResponse.json();
                    alert("Cardápio recriado com sucesso! (Nome alterado)");
                    console.log("Novo cardápio criado:", result);
                    
                    // Atualiza o nome original
                    nomeEstabelecimentoOriginal = nomeEstabelecimento;
                    
                    // Recarrega a lista de cardápios
                    carregarListaCardapios();
                } else {
                    throw new Error("Erro ao criar novo cardápio: " + criarResponse.status);
                }
                
            } else {
                // Outro tipo de erro
                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }

        } catch (error) {
            console.error("Erro ao atualizar cardápio:", error);
            
            // Tentar uma abordagem mais simples - criar novo diretamente
            if (confirm("Não foi possível atualizar o cardápio. Deseja criar um novo cardápio com estes dados?")) {
                try {
                    const criarResponse = await fetch("https://projetointegrado-kper.onrender.com/cardapio/config/criar", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    if (criarResponse.ok) {
                        alert("Novo cardápio criado com sucesso!");
                        nomeEstabelecimentoOriginal = nomeEstabelecimento;
                        carregarListaCardapios();
                    } else {
                        throw new Error("Erro ao criar cardápio: " + criarResponse.status);
                    }
                } catch (criarError) {
                    alert("Erro ao criar cardápio: " + criarError.message);
                }
            }
        }
    });

    // Função para carregar dados do cardápio - CORRIGIDA
    function carregarDadosCardapio(cardapio) {
        // Guarda o nome original E o tema original
        nomeEstabelecimentoOriginal = cardapio.nomeEstabelecimento || "";
        temaPredefinidoOriginal = cardapio.temaPredefinido || "";
        
        document.getElementById("nomeEstabelecimento").value = nomeEstabelecimentoOriginal;
        
        // Ajuste conforme a estrutura real da sua API
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
    
    // Função para excluir cardápio - CORRIGIDA
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
                
                // Se está editando o cardápio que foi excluído, limpa as variáveis
                if (nomeEstabelecimento === nomeEstabelecimentoOriginal) {
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