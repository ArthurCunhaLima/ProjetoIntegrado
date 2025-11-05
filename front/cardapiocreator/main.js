document.addEventListener("DOMContentLoaded", carregarItens);

let itensPendentes = [];

document.getElementById("Inputs").addEventListener("submit", async (e) => {
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

  form.reset();
  try {
    const response = await fetch("http://localhost:8080/item/adicionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      throw new Error("Erro na requisição: " + response.status);
    }

    await response.json();


 

    
    carregarItens();

  } catch (error) {
    console.error("Erro ao adicionar item:", error);
  }
});



async function carregarItens() {
  const response = await fetch("http://localhost:8080/item/retornar")
  const itens = await response.json();

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