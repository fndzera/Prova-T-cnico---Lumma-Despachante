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

##Instruções

- Após as instalações das dependaências necessárias, abra um novo terminal em seu editor de código fonte
- Digite:
  ```bash
   node index.js

- Após iniciar a execução do projeto, será solicitado no terminal que o usuário insira o termo que será pesquisado no site New York Times.
- Digite um tema que deseja pesquisar (Por exemplo: Brazil)
- Após a digitação o projeto seguirá atuando de forma independente, gerando assim um arquivo Excel (.xlsx) com as informações (Título da notícia, Descrição da notícia, Data da publicação e Link da imagem da notícia) da noticia dentro da pasta "dados_de_pesquisas", pois caso deseje consultar novas noticias todas elas serão direcionada para essa pasta com o prefixo "NYTimes_Articles_${respectivo nome que o usuário pesquisou}".

  Obs: Vale salientar que, para executar essa automação, o usuário deverá estar utilizando uma internet estável (sem perdas de pacote no momento que a automação está sendo executada).
