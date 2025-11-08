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
document.getElementById("gerarCardapio").addEventListener("click", async () => {
  if (itensPendentes.length === 0) {
    alert("Nenhum item para enviar!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/item/adicionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(itensPendentes)
    });

    if (!response.ok) {
      throw new Error("Erro na requisição: " + response.status);
    }

    await response.json();
  
    itensPendentes = [];
  
    alert("Cardápio gerado com sucesso!")
 

    
    carregarItens();

  } catch (error) {
    console.error("Erro ao adicionar item:", error);
  }
});



async function carregarItens() {
  const itens = itensPendentes;

  const ul = document.getElementById("itensCriados");
  ul.innerHTML = "";

  itens.forEach(item => {
    console.log("Renderizando:", item.nome);
    const li = document.createElement("li");
    if (item.descricao == null){
      li.innerHTML = `<strong>${item.nome}</strong> - R$ ${item.valor.toFixed(2)}<br>
    `;
    }else{
      li.innerHTML = `<strong>${item.nome}</strong> - R$ ${item.valor.toFixed(2)}<br>
      <small>${item.descricao}</small>
    `;
    }

    ul.appendChild(li);

  });
 
}
carregarItens();