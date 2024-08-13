AUTOR: *FERNANDO FERREIRA SANCHES*

# NYTimes Scraper

Este projeto é um script de automação que usa Puppeteer para extrair dados do site do New York Times. Foi desenvolvido com o intuito de avaliar as habilidades tecnicas dos participantes pertencentes ao processo seletivo da empresa Lumma Despachante.

## Funcionalidades do Projeto

- Pesquisa automática no site do New York Times.
- Extração de título, descrição, data de publicação e imagem das notícias (sem utilização de XPATH).
- Armazenamento dos dados extraídos em um arquivo Excel (.xlsx).
- Filtragem para garantir que apenas notícias com pelo menos uma informação válida (título, descrição, data ou imagem) sejam salvas.

## Configuração

1. Instale as dependências:
   ```bash
   npm install puppeteer
   npm install xlsx
   
OBS: Os módulos readline, path, e fs são módulos internos do Node.js e não precisam ser instalados separadamente. Eles estão disponíveis por padrão no ambiente Node.js.
