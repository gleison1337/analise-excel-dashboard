document.addEventListener("DOMContentLoaded", function () {
  const modalElement = document.getElementById("uploaderModal");
  const modal = new bootstrap.Modal(modalElement);
  const openBtn = document.getElementById("abrirUploader");
  const lista = document.getElementById("listaArquivos");
  const formUpload = document.getElementById("formUpload");
  const fileInput = document.getElementById("fileInput");

  function carregarArquivos() {
    fetch("listar-arquivos.php")
      .then(res => res.json())
      .then(arquivos => {
        lista.innerHTML = "";
        if (!Array.isArray(arquivos)) {
          lista.innerHTML = "<li class='list-group-item text-danger'>Erro ao carregar lista de arquivos.</li>";
          return;
        }

        if (arquivos.length === 0) {
          lista.innerHTML = "<li class='list-group-item'>Nenhum arquivo encontrado.</li>";
          return;
        }

        arquivos.forEach(nome => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between align-items-center";

          const nomeSpan = document.createElement("span");
          nomeSpan.textContent = nome;

          const btnGroup = document.createElement("div");
          btnGroup.className = "btn-group";

          const btnDeletar = document.createElement("button");
          btnDeletar.className = "btn btn-sm btn-danger";
          btnDeletar.textContent = "🗑️";
          btnDeletar.onclick = () => deletarArquivo(nome);

          const btnSelecionar = document.createElement("button");
          btnSelecionar.className = "btn btn-sm btn-primary";
          btnSelecionar.textContent = "Usar";
          btnSelecionar.onclick = () => selecionarArquivo(nome);

          btnGroup.appendChild(btnSelecionar);
          btnGroup.appendChild(btnDeletar);

          li.appendChild(nomeSpan);
          li.appendChild(btnGroup);
          lista.appendChild(li);
        });
      })
      .catch(error => {
        console.error("Erro ao carregar arquivos:", error);
        lista.innerHTML = "<li class='list-group-item text-danger'>Erro ao buscar arquivos.</li>";
      });
  }

  function deletarArquivo(nome) {
    fetch("deletar.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `filename=${encodeURIComponent(nome)}`
    })
      .then(() => carregarArquivos())
      .catch(error => console.error("Erro ao deletar:", error));
  }

  function selecionarArquivo(nome) {
    localStorage.setItem("arquivoSelecionado", nome);
    location.reload();
  }

  formUpload.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!fileInput.files[0]) {
      alert("Selecione um arquivo XLSX para enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch("upload.php", {
      method: "POST",
      body: formData
    })
      .then(() => {
        carregarArquivos();
        fileInput.value = "";
      })
      .catch(error => console.error("Erro ao enviar arquivo:", error));
  });

  openBtn.addEventListener("click", () => {
    modal.show();
    carregarArquivos();
  });
});
