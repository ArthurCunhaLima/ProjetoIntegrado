
document.getElementById("Inputs").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const dados = {
        nome: form.nome.value,
        valor: parseFloat(form.valor.value)
    };

    const response = await fetch("http://localhost:8080/item/adicionar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
  if (!response.ok) {
    throw new Error("Erro na requisição: " + response.status);
  }
  return response.json()
})
});