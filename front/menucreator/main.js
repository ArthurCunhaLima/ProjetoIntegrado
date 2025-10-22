document.getElementById("valor").addEventListener("input", function() {
  this.value = this.value.replace(",", ".");
});

