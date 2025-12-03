// ==================== VARIÁVEIS GLOBAIS ====================
let itensPendentes = [];
let nomeEstabelecimentoAtual = '';
let estabelecimentoExiste = false;
let timeoutVerificacao = null;
let enviandoFormulario = false;
let ultimoClique = 0;
const intervaloMinimo = 2000; // 2 segundos entre cliques

// ==================== INICIALIZAÇÃO ====================
document.addEventListener("DOMContentLoaded", function() {
    carregarItens();
    inicializarValidacaoNome();
    inicializarFormatacaoValor();
    inicializarFormularioItem();
    inicializarModalSucesso();
});

// ==================== FUNÇÕES DE VALIDAÇÃO DE NOME ====================

// Função para verificar disponibilidade do nome
async function verificarNomeEstabelecimento(nome) {
    if (!nome || nome.trim() === '') {
        return { disponivel: false, motivo: 'Nome vazio' };
    }
    
    const nomeFormatado = nome.trim();
    
    // Se for o mesmo nome que já verificamos, retorna o resultado em cache
    if (nomeFormatado === nomeEstabelecimentoAtual) {
        return { disponivel: !estabelecimentoExiste };
    }
    
    const verificaURL = `https://projetointegrado-kper.onrender.com/cardapio/config/buscar/${encodeURIComponent(nomeFormatado)}`;
    
    try {
        const verificaResponse = await fetch(verificaURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Se o status for 200, o estabelecimento existe
        if (verificaResponse.ok) {
                nomeEstabelecimentoAtual = nomeFormatado;
            estabelecimentoExiste = true;
    
            return { 
                disponivel: false, 
                motivo: 'Estabelecimento já existe'
        };
        } 
        // Se for 404, não existe - disponível
        else if (verificaResponse.status === 404) {
            nomeEstabelecimentoAtual = nomeFormatado;
            estabelecimentoExiste = false;
            return { disponivel: true, motivo: 'Disponível' };
        }
        // Outros erros
        else {
            return { 
                disponivel: false, 
                motivo: `Erro na verificação: ${verificaResponse.status}`
            };
        }
    } catch (error) {
        console.error("Erro ao verificar nome:", error);
        return { disponivel: false, motivo: 'Erro de conexão' };
    }
}

// Função para atualizar o estado do botão
function atualizarBotaoSubmit(disponivel, motivo = '', enviando = false) {
    const botaoSubmit = document.querySelector('#inputFinal button[type="submit"]');
    const mensagemElemento = document.getElementById('mensagem-validacao') || criarElementoMensagem();
    
    if (!botaoSubmit) return;
    
    if (enviando) {
        // Estado de envio em progresso
        botaoSubmit.disabled = true;
        botaoSubmit.style.opacity = '0.7';
        botaoSubmit.style.cursor = 'wait';
        botaoSubmit.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';
        mensagemElemento.textContent = 'Enviando cardápio...';
        mensagemElemento.style.color = '#007bff';
        return;
    }
    
    if (disponivel) {
        botaoSubmit.disabled = false;
        botaoSubmit.style.opacity = '1';
        botaoSubmit.style.cursor = 'pointer';
        botaoSubmit.innerHTML = '<i class="bi bi-check-circle"></i> Gerar Cardápio';
        mensagemElemento.textContent = '✓ Nome disponível';
        mensagemElemento.style.color = '#28a745';
    } else {
        botaoSubmit.disabled = true;
        botaoSubmit.style.opacity = '0.5';
        botaoSubmit.style.cursor = 'not-allowed';
        botaoSubmit.innerHTML = '<i class="bi bi-card-checklist"></i> Gerar Cardápio';
        
        if (motivo) {
            mensagemElemento.textContent = `✗ ${motivo}`;
            mensagemElemento.style.color = '#dc3545';
        }
    }
}

// Cria elemento para mensagens de validação
function criarElementoMensagem() {
    const mensagemElemento = document.createElement('div');
    mensagemElemento.id = 'mensagem-validacao';
    mensagemElemento.style.fontSize = '0.9em';
    mensagemElemento.style.marginTop = '5px';
    mensagemElemento.style.minHeight = '20px';
    
    const nomeInput = document.querySelector('#inputFinal input[name="nomeEstabelecimento"]');
    if (nomeInput && nomeInput.parentNode) {
        nomeInput.parentNode.appendChild(mensagemElemento);
    }
    
    return mensagemElemento;
}

// Inicializa a validação do nome
function inicializarValidacaoNome() {
    const nomeInput = document.querySelector('#inputFinal input[name="nomeEstabelecimento"]');
    
    if (nomeInput) {
        // Cria o elemento de mensagem
        criarElementoMensagem();
        
        // Inicializa o botão como desabilitado
        atualizarBotaoSubmit(false, 'Digite um nome para o estabelecimento');
        
        // Verificação ao digitar (com debounce)
        nomeInput.addEventListener('input', function(e) {
            const nome = e.target.value.trim();
            
            // Limpa timeout anterior
            if (timeoutVerificacao) {
                clearTimeout(timeoutVerificacao);
            }
            
            // Se o campo estiver vazio
            if (!nome) {
                atualizarBotaoSubmit(false, 'Digite um nome para o estabelecimento');
                return;
            }
            
            // Espera 500ms após a última digitação para fazer a requisição
            timeoutVerificacao = setTimeout(async () => {
                atualizarBotaoSubmit(false, 'Verificando disponibilidade...');
                
                const resultado = await verificarNomeEstabelecimento(nome);
                atualizarBotaoSubmit(resultado.disponivel, resultado.motivo);
            }, 500);
        });
        
        // Verificação ao perder o foco (instantânea)
        nomeInput.addEventListener('blur', async function(e) {
            const nome = e.target.value.trim();
            if (nome) {
                const resultado = await verificarNomeEstabelecimento(nome);
                atualizarBotaoSubmit(resultado.disponivel, resultado.motivo);
            }
        });
    }
}

// ==================== FORMULÁRIO FINAL (GERAR CARDÁPIO) ====================

document.getElementById("inputFinal").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Previne múltiplos envios simultâneos
    if (enviandoFormulario) {
        console.log("Formulário já está sendo enviado. Aguarde...");
        return;
    }
    
    // Previne cliques muito rápidos
    const agora = Date.now();
    if (agora - ultimoClique < intervaloMinimo) {
        console.log("Aguarde antes de clicar novamente");
        return;
    }
    ultimoClique = agora;
    
    if (itensPendentes.length === 0) {
        alert("Nenhum item para enviar!");
        return;
    }
    
    const formEstabelecimento = document.getElementById("inputFinal");
    const nomeEstabelecimento = formEstabelecimento.nomeEstabelecimento.value.trim();
    
    // Verificação final (segurança extra)
    if (!nomeEstabelecimento) {
        alert("Por favor, insira um nome para o estabelecimento!");
        return;
    }
    
    // Marca que o formulário está sendo enviado
    enviandoFormulario = true;
    atualizarBotaoSubmit(false, '', true); // Estado de "enviando"
    
    // Verifica uma última vez antes de enviar
    const verificacaoFinal = await verificarNomeEstabelecimento(nomeEstabelecimento);
    if (!verificacaoFinal.disponivel) {
        alert(`Não foi possível criar: ${verificacaoFinal.motivo}`);
        atualizarBotaoSubmit(false, verificacaoFinal.motivo);
        enviandoFormulario = false; // Libera o formulário
        return;
    }
    
    // Se passou por todas as validações, continua com a lógica original
    try {
        const payload = {
            nomeEstabelecimento: nomeEstabelecimento,
            itensCardapio: itensPendentes,
            temaPredefinido: formEstabelecimento.temaPredefinido.value,
        };
        
        const response = await fetch("https://projetointegrado-kper.onrender.com/creator/gerarCardapio", {
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
        
        // Resetar estado após sucesso
        nomeEstabelecimentoAtual = '';
        estabelecimentoExiste = false;
        enviandoFormulario = false; // Libera o formulário
        atualizarBotaoSubmit(false, 'Digite um nome para o estabelecimento');

    } catch (error) {
        console.error("Erro ao gerar cardápio:", error);
        alert("Erro ao gerar cardápio. Tente novamente.");
        
        // Restaura o botão em caso de erro
        enviandoFormulario = false;
        
        // Verifica novamente o estado atual do nome
        const nomeAtual = formEstabelecimento.nomeEstabelecimento.value.trim();
        if (nomeAtual) {
            const resultado = await verificarNomeEstabelecimento(nomeAtual);
            atualizarBotaoSubmit(resultado.disponivel, resultado.motivo);
        } else {
            atualizarBotaoSubmit(false, 'Digite um nome para o estabelecimento');
        }
    }
});

// ==================== FORMATAÇÃO DE VALOR ====================

function inicializarFormatacaoValor() {
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
}

// ==================== FORMULÁRIO DE ITEM ====================

function inicializarFormularioItem() {
    document.getElementById("inputItem").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const dados = {
            nome: form.nome.value,
            valor: parseFloat(form.valor.value),
            descricao: form.descricao.value
        };
        
        // Validação básica
        if (!dados.nome || !dados.valor) {
            alert("Por favor, preencha pelo menos o nome e o valor do item!");
            return;
        }
        
        itensPendentes.push(dados);

        console.log("Item adicionado localmente:", dados);
        console.log("Itens pendentes:", itensPendentes);
        
        carregarItens();
        form.reset();
    });
}

// ==================== MODAL DE SUCESSO ====================

function inicializarModalSucesso() {
    document.getElementById("copyLinkBtn").addEventListener("click", () => {
        if (window.cardapioUrl) {
            navigator.clipboard.writeText(window.cardapioUrl).then(() => {
                // Feedback visual melhorado
                const btn = document.getElementById("copyLinkBtn");
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check"></i> Copiado!';
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-success");
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.classList.remove("btn-success");
                    btn.classList.add("btn-primary");
                }, 2000);
            }).catch(err => {
                console.error("Erro ao copiar:", err);
                alert("Erro ao copiar link. Tente novamente.");
            });
        }
    });
}

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

// ==================== LISTAGEM DE ITENS ====================

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
// Toggle para cores avançadas
document.getElementById('toggleCoresAvancadas')?.addEventListener('change', function(e) {
    const coresAvancadas = document.getElementById('coresAvancadas');
    if (e.target.checked) {
        coresAvancadas.style.display = 'block';
    } else {
        coresAvancadas.style.display = 'none';
    }
});

// Atualizar preview quando tema for selecionado
document.querySelectorAll('input[name="temaPredefinido"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Aqui você pode adicionar lógica para mostrar um preview do tema
        console.log('Tema selecionado:', this.value);
    });
});


function removerItem(index) {
    itensPendentes.splice(index, 1);
    carregarItens();
}