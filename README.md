# 📊 Excel Analytics Dashboard

> Uma solução leve e modular para transformar planilhas Excel em dashboards interativos e dinâmicos.

![Badge Status](https://img.shields.io/badge/Status-Concluído-success)
![Badge License](https://img.shields.io/badge/License-MIT-blue)

## 📖 Sobre o Projeto

Este projeto é uma ferramenta web desenvolvida para simplificar a visualização de dados corporativos. Ele permite o upload de arquivos `.xlsx` e, automaticamente, renderiza **tabelas dinâmicas** e **gráficos interativos**, eliminando a necessidade de abrir o Excel para análises rápidas.

O foco principal é oferecer uma interface limpa, responsiva e pronta para ser reutilizada em diferentes departamentos, utilizando uma infraestrutura de backend leve (PHP) sem necessidade de banco de dados complexo.

## 🚀 Funcionalidades Principais

* 📂 **Gestão de Arquivos:** Upload, seleção e exclusão de planilhas Excel diretamente na interface.
* ⚡ **Leitura em Tempo Real:** Extração e exibição instantânea de dados de arquivos `.xlsx`.
* 📊 **Visualização de Dados:** Gráficos interativos (Pizza, Barras) gerados automaticamente via *Chart.js*.
* 🔍 **Tabelas Inteligentes:** Ordenação, paginação e pesquisa em tempo real.
* 📥 **Exportação:** Download dos dados processados em PDF, CSV ou Excel.
* 📱 **Design Responsivo:** Layout adaptável para desktop e mobile (Bootstrap 5).

## 🛠️ Tecnologias Utilizadas

### Frontend
* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **HTML5 Semantic**
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **CSS3 / Bootstrap 5**
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **ES6+ Moderno**

### Backend & Processamento
* ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white) **PHP** (Manipulação de arquivos)
* **SimpleXLSX** (Parser de Excel)
* **PapaParse** (Manipulação CSV)

## 📂 Estrutura do Projeto

```bash
/
├── assets/              # Estilos (CSS) e Scripts (JS)
├── data/                # Diretório onde os arquivos .xlsx são salvos
├── deletar.php          # API para remoção de arquivos
├── index.html           # Interface principal (Dashboard)
├── listar-arquivos.php  # API para listar diretório data/
├── upload.php           # API para processar o upload
└── README.md            # Documentação
