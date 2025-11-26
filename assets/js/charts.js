document.addEventListener("DOMContentLoaded", function () {
  const arquivo = localStorage.getItem("arquivoSelecionado") || "dados.xlsx";

  fetch("data/" + arquivo)
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

      const statusCount = {};
      const baseDcheck = {};

      // Após carregar os dados do XLSX:
let allData = data; // Referência para exportações

// Função para exportar CSV
function exportCSV(data, filename) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Função para exportar XLSX
function exportXLSX(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Planilha");
  XLSX.writeFile(wb, filename);
}

// Função para exportar PDF (somente dados simples da tabela)
function exportPDF(data, filename) {
  const doc = new jspdf.jsPDF();
  const headers = Object.keys(data[0] || {});
  const rows = data.map(obj => headers.map(h => String(obj[h] || "")));
  doc.autoTable({ head: [headers], body: rows });
  doc.save(filename);
}

// Função auxiliar para obter apenas a página exibida do DataTable
function getCurrentPageData() {
  return $('#tabelaDados').DataTable().rows({ search: 'applied', page: 'current' }).data().toArray();
}

// Eventos dos botões do dropdown
document.getElementById("export-pdf-view").addEventListener("click", () => {
  exportPDF(getCurrentPageData(), "pagina_exibida.pdf");
});
document.getElementById("export-csv-view").addEventListener("click", () => {
  exportCSV(getCurrentPageData(), "pagina_exibida.csv");
});
document.getElementById("export-xlsx-view").addEventListener("click", () => {
  exportXLSX(getCurrentPageData(), "pagina_exibida.xlsx");
});

document.getElementById("export-pdf-full").addEventListener("click", () => {
  exportPDF(allData, "dados_completos.pdf");
});
document.getElementById("export-csv-full").addEventListener("click", () => {
  exportCSV(allData, "dados_completos.csv");
});
document.getElementById("export-xlsx-full").addEventListener("click", () => {
  exportXLSX(allData, "dados_completos.xlsx");
});


      data.forEach(row => {
        // Contagem de Status (Gráfico de Pizza)
        const status = row["Status"]?.trim() || "Não informado";
        statusCount[status] = (statusCount[status] || 0) + 1;

        // Detectar automaticamente a coluna DCheck (ignora maiúsculas/minúsculas/acentos)
        const dcheckKey = Object.keys(row).find(k => k.trim().toLowerCase().replace(/[^a-z]/gi, "") === "dcheck");
        const dcheck = row[dcheckKey]?.trim() || "Não informado";

        // Identificar a base a partir do campo "Nome"
        const nomeCampo = row["Nome"] || "";
        const baseMatch = nomeCampo.match(/Base:\s*([A-Z]+)/i);
        const base = baseMatch ? baseMatch[1] : "Não informado";

        if (!baseDcheck[base]) baseDcheck[base] = { Sim: 0, Não: 0, "Não informado": 0 };
        baseDcheck[base][dcheck] = (baseDcheck[base][dcheck] || 0) + 1;
      });

      // GRÁFICO DE STATUS (Pizza)
      new Chart(document.getElementById("chartStatus"), {
        type: "pie",
        data: {
          labels: Object.keys(statusCount),
          datasets: [{
            data: Object.values(statusCount),
            backgroundColor: ["#4CAF50", "#FF9800", "#f44336", "#9E9E9E"]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });

      // GRÁFICO DE BASE x DCheck (Barras Empilhadas)
      const labels = Object.keys(baseDcheck);
      const sim = labels.map(base => baseDcheck[base]["Sim"] || 0);
      const nao = labels.map(base => baseDcheck[base]["Não"] || 0);
      const naoInf = labels.map(base => baseDcheck[base]["Não informado"] || 0);

      new Chart(document.getElementById("chartBase"), {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Sim",
              data: sim,
              backgroundColor: "#4CAF50"
            },
            {
              label: "Não",
              data: nao,
              backgroundColor: "#FF9800"
            },
            {
              label: "Não informado",
              data: naoInf,
              backgroundColor: "#9E9E9E"
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
          }
        }
      });
    })
    .catch(err => {
      console.error("Erro ao carregar XLSX para gráficos:", err);
    });
});
