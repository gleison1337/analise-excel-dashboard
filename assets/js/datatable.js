document.addEventListener("DOMContentLoaded", function () {
  const arquivo = localStorage.getItem("arquivoSelecionado") || "dados.xlsx";

  fetch("data/" + arquivo)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

      if (data.length === 0) {
        console.error("Arquivo XLSX sem dados.");
        return;
      }

      // Lista negra de colunas indesejadas (você pode expandir essa lista se quiser)
      const colunasIndesejadas = ["Solicitação", "Solicitar item"];

      // Detecta todos os possíveis cabeçalhos
      const allHeaders = Object.keys(data[0]);

      // Filtra colunas completamente vazias, com nomes inválidos ou colunas indesejadas
      const headers = allHeaders.filter(header => {
        const nomeValido = header && header.trim() !== "" && !colunasIndesejadas.includes(header.trim());
        const conteudoValido = data.some(row => {
          const valor = row[header];
          return valor && valor.toString().trim() !== "" && valor.toString().trim().toLowerCase() !== "não informado";
        });
        return nomeValido && conteudoValido;
      });

      if (headers.length === 0) {
        console.error("Nenhum cabeçalho válido com dados encontrado.");
        return;
      }

      // Monta o cabeçalho da tabela
      const thead = document.querySelector("#tabelaDados thead");
      const headerRow = document.createElement("tr");
      headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Preenche as linhas da tabela
      const tbody = document.querySelector("#tabelaDados tbody");
      data.forEach(row => {
        const isEmptyRow = headers.every(h => !row[h] || row[h].toString().trim() === "");
        if (isEmptyRow) return;

        const tr = document.createElement("tr");
        headers.forEach(header => {
          const td = document.createElement("td");
          const cellValue = row[header]?.toString().trim();
          td.textContent = cellValue || "Não informado";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      // Inicializa DataTable
      $("#tabelaDados").DataTable({
        pageLength: 10,
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json"
        },
        responsive: true
      });
    })
    .catch(error => {
      console.error("Erro ao carregar arquivo XLSX:", error);
    });
});


  // Ajustar altura da tabela com base na seleção
  const seletorAltura = document.getElementById("alturaTabela");
  const containerTabela = document.getElementById("containerTabela");

  // Aplica a altura padrão do select (inicial)
  if (seletorAltura && containerTabela) {
    containerTabela.style.maxHeight = seletorAltura.value + "px";
    containerTabela.style.overflowY = "auto";

    // Permite alterar dinamicamente a altura
    seletorAltura.addEventListener("change", function () {
      containerTabela.style.maxHeight = this.value + "px";
    });
  }

