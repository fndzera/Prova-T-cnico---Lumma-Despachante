// Importa as bibliotecas necessárias
const puppeteer = require("puppeteer"); // Biblioteca para automação de navegadores
const XLSX = require("xlsx"); // Biblioteca para manipulação de arquivos Excel
const readline = require("readline"); // Biblioteca para leitura de entrada do usuário
const path = require("path"); // Biblioteca para manipulação de caminhos de arquivos
const fs = require("fs"); // Biblioteca para manipulação do sistema de arquivos

// Função para iniciar o navegador e abrir uma nova página
async function initializeBrowser() {
  // Lança o navegador em modo não headless (visível)
  const browser = await puppeteer.launch({ headless: false });
  // Cria uma nova página no navegador
  const page = await browser.newPage();
  return { browser, page }; // Retorna o navegador e a página criada
}

// Função para realizar a pesquisa no site do New York Times
async function searchArticles(page, searchQuery) {
  // Navega até a página inicial do NYTimes
  await page.goto("https://www.nytimes.com/", { waitUntil: "networkidle2" });

  // Fechar o banner de cookies se ele estiver presente
  const cookieButtonSelector = 'button[data-testid="Accept all-btn"]';
  const cookieButton = await page.$(cookieButtonSelector);
  if (cookieButton) {
    await cookieButton.click();
    console.log("Banner de cookies fechado"); // Log de confirmação
  }

  // Clicar no botão de menu para abrir a barra de pesquisa
  const menuButtonSelector = "button.css-kptjhk";
  await page.waitForSelector(menuButtonSelector, { visible: true });
  await page.click(menuButtonSelector);

  // Clicar na barra de pesquisa e preencher com a consulta fornecida pelo usuário
  await page.waitForSelector('input[data-testid="search-input"]', {
    visible: true,
  });
  await page.click('input[data-testid="search-input"]');
  await page.type('input[data-testid="search-input"]', searchQuery);

  // Clicar no botão de busca para iniciar a pesquisa
  const searchButtonSelector = 'button[data-testid="search-submit"]';
  await page.waitForSelector(searchButtonSelector, { visible: true });
  await page.click(searchButtonSelector);

  // Esperar que os resultados da pesquisa apareçam na página
  await page.waitForSelector("ol > li", { timeout: 60000 });
}

// Função para rolar a página até o final para garantir que todos os resultados sejam carregados
async function scrollToEnd(page) {
  await page.evaluate(async () => {
    let lastHeight = document.body.scrollHeight; // Altura inicial da página
    while (true) {
      window.scrollBy(0, window.innerHeight); // Rola para baixo uma altura de viewport
      await new Promise((resolve) => setTimeout(resolve, 500)); // Aguarda 500ms para permitir carregamento
      const newHeight = document.body.scrollHeight; // Nova altura da página após rolagem
      if (newHeight === lastHeight) break; // Se a altura não mudar, significa que o final da página foi alcançado
      lastHeight = newHeight; // Atualiza a altura
    }
  });
}

// Função para extrair dados das notícias visíveis na página
async function extractArticleData(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll("ol > li")).map((item) => {
      // Seletores para diferentes partes da notícia
      const titleElement = item.querySelector("h4.css-nsjm9t");
      const descriptionElement = item.querySelector("p.css-16nhkrn");
      const dateElement = item.querySelector("span.css-17ubb9w");
      const imageElement = item.querySelector(
        'div[data-testid="imageContainer-children-Image"] img'
      );

      return {
        // Extrai o texto/atribui um valor padrão caso não esteja presente
        title: titleElement ? titleElement.innerText.trim() : "Sem título",
        description: descriptionElement
          ? descriptionElement.innerText.trim()
          : "Sem descrição",
        date: dateElement ? dateElement.innerText.trim() : "Sem data",
        imageUrl: imageElement ? imageElement.src : "Sem imagem",
      };
    });
  });
}

// Função para filtrar e salvar os dados em um arquivo Excel
function saveDataToExcel(articles, searchQuery) {
  // Filtra os artigos para remover aqueles que não têm nenhum dado preenchido
  const filteredArticles = articles.filter(
    (article) =>
      article.title !== "Sem título" ||
      article.description !== "Sem descrição" ||
      article.date !== "Sem data" ||
      article.imageUrl !== "Sem imagem"
  );

  // Verifica se há artigos para salvar
  if (filteredArticles.length === 0) {
    console.error("Nenhum artigo com dados válidos para salvar.");
    return;
  }

  // Define o caminho para a pasta onde os arquivos serão salvos
  const folderPath = path.join(__dirname, "dados_de_pesquisas");

  // Verifica se a pasta existe, caso contrário, cria a pasta
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Define o caminho do arquivo Excel a ser salvo
  const filePath = path.join(
    folderPath,
    `NYTimes_Articles_${searchQuery}.xlsx`
  );

  // Cria uma planilha com os dados filtrados
  const worksheet = XLSX.utils.json_to_sheet(filteredArticles);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Artigos");

  // Salva o arquivo Excel no caminho definido
  XLSX.writeFile(workbook, filePath);
  console.log(`Dados extraídos e salvos em ${filePath}`);
}

// Função principal que executa todas as etapas
(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Solicita ao usuário que insira a consulta de pesquisa
  rl.question(
    "Por favor, insira sua consulta de pesquisa: ",
    async (searchQuery) => {
      const { browser, page } = await initializeBrowser();

      try {
        await searchArticles(page, searchQuery); // Realiza a pesquisa
        await scrollToEnd(page); // Rola a página até o final
        const articles = await extractArticleData(page); // Extrai os dados das notícias

        console.log(`Número de artigos extraídos: ${articles.length}`);

        saveDataToExcel(articles, searchQuery); // Salva os dados extraídos em um arquivo Excel
      } catch (error) {
        console.error("Erro ocorrido:", error); // Log de erro, se ocorrer
      } finally {
        await browser.close(); // Fecha o navegador
        rl.close(); // Fecha a interface de leitura de entrada
      }
    }
  );
})();
