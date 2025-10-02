// js/empreendimentos.js (Versão Dinâmica)

// Guarda a lista completa de empreendimentos carregada do JSON
let todosEmpreendimentos = [];

// Elementos do DOM que vamos usar
const grid = document.getElementById("gridEmp");
const filterTipo = document.getElementById("filterTipo");
const filterLocal = document.getElementById("filterLocal");
const btnClear = document.getElementById("btnClear");

// Função para carregar o arquivo JSON de forma segura
async function carregaJSON() {
  try {
    const url = "/dados/empreendimentos.json";
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) {
      throw new Error(`Erro HTTP ${resp.status}`);
    }
    return await resp.json();
  } catch (err) {
    console.error("❌ Falha crítica ao carregar o arquivo JSON:", err);
    grid.innerHTML = `<p class="grid-erro">Não foi possível carregar os empreendimentos. Tente novamente mais tarde.</p>`;
    // Propaga o erro para parar a execução
    throw err;
  }
}

// Função que "desenha" os cards no HTML a partir de uma lista de itens
function renderizarGrid(items) {
  // Se a lista estiver vazia, mostra uma mensagem
  if (items.length === 0) {
    grid.innerHTML = `<p class="grid-erro">Nenhum empreendimento encontrado com os filtros selecionados.</p>`;
    return;
  }

  // Gera o HTML para cada card usando os dados do item
  grid.innerHTML = items
    .map(
      (item) => `
    <article class="card" data-cat="${item.categoria.toLowerCase()}" data-local="${item.cidade}">
      <a class="card__media" href="detalhe.html?p=${item.slug}">
        <img src="${item.galeria[0]}" alt="${item.titulo}" loading="lazy" />
        <span class="badge">${item.cidade}</span>
      </a>
      <div class="card__body">
        <h3 class="card__title">
          <a href="detalhe.html?p=${item.slug}">${item.titulo}</a>
        </h3>
        <p class="card__meta">${item.destaques.join(" • ")}</p>
      </div>
      <div class="card__footer">
        <span class="pill">${item.categoria}</span>
      </div>
    </article>
  `
    )
    .join("");
}

// Função que aplica os filtros e atualiza o grid
function aplicarFiltros() {
  const tipo = filterTipo.value.toLowerCase();
  const local = filterLocal.value;

  // Filtra a lista principal de empreendimentos
  const resultados = todosEmpreendimentos.filter((item) => {
    const okTipo = tipo === "todos" || item.categoria.toLowerCase() === tipo;
    const okLocal = local === "todas" || item.cidade === local;
    return okTipo && okLocal;
  });

  // Renderiza apenas os resultados filtrados
  renderizarGrid(resultados);
}

// Função para limpar todos os filtros
function limparFiltros() {
  filterTipo.value = "todos";
  filterLocal.value = "todas";
  aplicarFiltros();
}

// Função principal que inicia tudo
(async function main() {
  try {
    // 1. Carrega os dados do JSON
    todosEmpreendimentos = await carregaJSON();
    
    // 2. Renderiza o grid inicial com todos os itens
    renderizarGrid(todosEmpreendimentos);

    // 3. Adiciona os eventos aos filtros
    filterTipo.addEventListener("change", aplicarFiltros);
    filterLocal.addEventListener("change", aplicarFiltros);
    btnClear.addEventListener("click", limparFiltros);

  } catch (err) {
    // O erro já foi tratado na função carregaJSON
    console.error("Execução principal interrompida devido a erro.");
  }
})();