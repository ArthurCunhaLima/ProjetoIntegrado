document.getElementById("valor").addEventListener("input", function() {
  this.value = this.value.replace(",", ".");
});
document.getElementById("Inputs").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const dados = {
        nome: form.nome.value,
        valor: form.valor.value
    };

    await fetch(`http://localhost:8080/item/adicionar?nome=${dados.nome}&valor=${dados.valor}`, {
        method: "POST"
    });

    alert("Item enviado com sucesso!");
});
