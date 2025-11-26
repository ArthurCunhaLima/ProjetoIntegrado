    
    document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formularioBusca");
    const inicial = document.getElementById("buscaConteudo");
    const final = document.getElementById("conteudo");

    formulario.addEventListener("submit", function(event){
        event.preventDefault(); 

        inicial.style.display = "none";


        final.classList.remove("conteudoEscondido");
        carregarItens();
      });

    });

