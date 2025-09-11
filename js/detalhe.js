// js/detalhe.js (Versão Final Corrigida com Diagnósticos)

// Utilitário para gerar um "slug" a partir de um texto (usado como fallback)
function toSlug(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")      // remove pontuação
    .replace(/\s+/g, "-")          // espaços -> hífen
    .replace(/-+/g, "-");          // hífens duplos -> simples
}

// Função para carregar o arquivo JSON de forma segura
async function carregaJSON() {
  // Usando apenas o caminho absoluto a partir da raiz do site.
  // É a forma mais garantida de funcionar no Live Server e no Netlify.
  const url = "/dados/empreendimentos.json";
  console.log(`🔄 Tentando carregar dados de: ${url}`);

  try {
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) {
      throw new Error(`Erro HTTP ${resp.status} - Não foi possível encontrar o arquivo.`);
    }
    const data = await resp.json();
    console.log("✅ Arquivo JSON carregado com sucesso!");
    return data;
  } catch (err) {
    console.error("❌ Falha crítica ao carregar ou processar o arquivo JSON:", err);
    // Propaga o erro para o bloco catch principal
    throw err;
  }
}

// Função principal que executa a página
(async function main() {
  console.log("✅ Script detalhe.js iniciado.");
  const erroBox = document.getElementById("detalheErro");

  try {
    // 1. Pega o 'slug' (identificador) da URL
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("p");

    if (!slug) {
      throw new Error("Parâmetro 'p' (com o slug do empreendimento) não foi encontrado na URL.");
    }
    console.log(`🔎 Buscando empreendimento com slug: "${slug}"`);

    // 2. Carrega a lista de empreendimentos
    const lista = await carregaJSON();

    // 3. Procura pelo item correspondente no JSON
    let item =
      lista.find(x => String(x.slug || "").toLowerCase() === slug.toLowerCase()) ||
      lista.find(x => toSlug(x.titulo || "") === slug.toLowerCase());

    if (!item) {
      throw new Error(`Empreendimento com slug "${slug}" não foi encontrado dentro do arquivo JSON.`);
    }
    console.log("✅ Empreendimento encontrado:", item);

    // 4. Preenche a página com os dados
    console.log("✏️ Iniciando preenchimento do HTML...");

    // Funções auxiliares para preencher o HTML de forma segura
    const preencher = (seletor, valor) => {
      const el = document.querySelector(`[data-det='${seletor}']`);
      if (el && valor) el.textContent = valor;
    };
    const preencherHref = (seletor, url) => {
        const el = document.querySelector(`[data-det='${seletor}']`);
        if (el && url) el.href = url;
    };

    // SEO e Título da Página
    document.title = item.seo?.title || item.titulo || "Detalhes do Empreendimento";
    
    // Preenchendo os dados principais
    preencher("titulo", item.titulo);
    preencher("cidade", item.cidade);
    preencher("resumo", item.resumo);
    preencher("descricao", item.descricao);
    preencher("endereco", item.localizacao?.endereco);

    // Destaques (lista)
    const destaquesEl = document.querySelector("[data-det='destaques']");
    if (destaquesEl && Array.isArray(item.destaques)) {
      destaquesEl.innerHTML = item.destaques.map(d => `<li>${d}</li>`).join("");
    }

    // Galeria de imagens
    const galeriaEl = document.querySelector("[data-det='galeria']");
    if (galeriaEl && Array.isArray(item.galeria)) {
      galeriaEl.innerHTML = item.galeria.map(src => `<figure class="galeria__item"><img src="${src}" alt="Imagem de ${item.titulo}"></figure>`).join("");
    }

    // Seções Opcionais: Plantas e Mapa
    const plantasSec = document.getElementById("detPlantasSec");
    if (plantasSec && item.plantas?.length > 0) {
      plantasSec.hidden = false; // Mostra a seção
      plantasSec.querySelector("[data-det='plantas']").innerHTML = item.plantas.map(p => `<a class="planta" href="${p.arquivo}" target="_blank" rel="noopener">${p.nome}</a>`).join("");
    }
    
    const mapaSec = document.getElementById("detMapaSec");
    if (mapaSec && item.localizacao?.maps) {
      mapaSec.hidden = false; // Mostra a seção
      mapaSec.querySelector("[data-det='maps']").src = item.localizacao.maps;
    }

    // Botões de Contato (CTA)
    preencherHref("wa", item.cta?.whatsapp);
    preencherHref("tel", `tel:${(item.cta?.telefone || "").replace(/\D/g, "")}`);
    preencher("tel", "Ligar");
    preencherHref("mail", `mailto:${item.cta?.email}`);
    preencher("mail", "E-mail");
    
    console.log("✅ Preenchimento do HTML concluído!");

  } catch (err) {
    console.error("❌ ERRO GRAVE:", err);
    if (erroBox) {
        erroBox.innerHTML = `<p style="color:red; text-align:center; padding: 2rem;"><b>Ocorreu um erro:</b><br>${err.message}</p>`;
    }
  }
})();

// js/detalhe.js (Versão Final com Lightbox Integrado)

// ----- FUNÇÕES DO LIGHTBOX (CARROSSEL DE IMAGENS) -----

let lightboxImages = []; // Array para guardar as imagens da galeria
let currentImageIndex = 0; // Índice da imagem atual no lightbox

// Cria os elementos do lightbox (só na primeira vez)
function createLightbox() {
  if (document.querySelector('.lightbox-overlay')) return; // Já existe, não recria

  const lightboxHTML = `
    <div class="lightbox-overlay">
      <div class="lightbox-container">
        <button class="lightbox-btn lightbox-close" aria-label="Fechar">&times;</button>
        <button class="lightbox-btn lightbox-prev" aria-label="Anterior">&lsaquo;</button>
        <img src="" class="lightbox-image" alt="Imagem do empreendimento">
        <button class="lightbox-btn lightbox-next" aria-label="Próximo">&rsaquo;</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  // Adiciona os eventos de clique aos botões
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox(); // Fecha se clicar no fundo
  });
  document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
  document.querySelector('.lightbox-next').addEventListener('click', showNextImage);
  
  // Adiciona navegação pelo teclado
  document.addEventListener('keydown', (e) => {
    if (!document.querySelector('.lightbox-overlay.active')) return; // Apenas se o lightbox estiver ativo
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'Escape') closeLightbox();
  });
}

// Abre o lightbox e mostra uma imagem específica
function openLightbox(index) {
  currentImageIndex = index;
  const overlay = document.querySelector('.lightbox-overlay');
  const imageEl = document.querySelector('.lightbox-image');
  
  imageEl.src = lightboxImages[currentImageIndex]; // Define a imagem atual
  overlay.classList.add('active'); // Ativa a visibilidade do lightbox

  // Esconde/mostra setas de navegação
  document.querySelector('.lightbox-prev').style.display = (currentImageIndex === 0) ? 'none' : 'block';
  document.querySelector('.lightbox-next').style.display = (currentImageIndex === lightboxImages.length - 1) ? 'none' : 'block';
}

// Fecha o lightbox
function closeLightbox() {
  document.querySelector('.lightbox-overlay').classList.remove('active');
}

// Funções para navegar
function showNextImage() {
  if (currentImageIndex < lightboxImages.length - 1) {
    openLightbox(currentImageIndex + 1);
  }
}
function showPrevImage() {
  if (currentImageIndex > 0) {
    openLightbox(currentImageIndex - 1);
  }
}


// ----- LÓGICA PRINCIPAL DA PÁGINA DE DETALHES -----

async function carregaJSON() {
  const url = "/dados/empreendimentos.json";
  try {
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`Erro HTTP ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.error("Falha ao carregar JSON:", err);
    throw err;
  }
}

(async function main() {
  const erroBox = document.getElementById("detalheErro");
  try {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("p");
    if (!slug) throw new Error("Parâmetro 'p' não encontrado na URL.");

    const lista = await carregaJSON();
    const item = lista.find(x => (x.slug || "").toLowerCase() === slug.toLowerCase());
    if (!item) throw new Error(`Empreendimento com slug "${slug}" não encontrado.`);

    // Preenche a página
    document.title = item.seo?.title || item.titulo;
    const preencher = (seletor, valor) => {
      const el = document.querySelector(`[data-det='${seletor}']`);
      if (el && valor) el.textContent = valor;
    };
    const preencherHref = (seletor, url) => {
        const el = document.querySelector(`[data-det='${seletor}']`);
        if (el && url) el.href = url;
    };
    
    preencher("titulo", item.titulo);
    preencher("cidade", item.cidade);
    preencher("resumo", item.resumo);
    preencher("descricao", item.descricao);
    preencher("endereco", item.localizacao?.endereco);

    const destaquesEl = document.querySelector("[data-det='destaques']");
    if (destaquesEl && Array.isArray(item.destaques)) {
      destaquesEl.innerHTML = item.destaques.map(d => `<li>${d}</li>`).join("");
    }

    // --- GALERIA COM LIGHTBOX ---
    const galeriaEl = document.querySelector("[data-det='galeria']");
    if (galeriaEl && Array.isArray(item.galeria) && item.galeria.length > 0) {
      lightboxImages = item.galeria; // Guarda as imagens para o lightbox
      
      galeriaEl.innerHTML = lightboxImages.map((src, index) => `
        <figure class="galeria__item">
          <img src="${src}" alt="Imagem de ${item.titulo}" data-index="${index}">
        </figure>
      `).join("");

      // Cria os elementos do lightbox no DOM (se ainda não existirem)
      createLightbox();

      // Adiciona o evento de clique na galeria
      galeriaEl.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') { // Garante que clicou em uma imagem
          const index = parseInt(e.target.dataset.index, 10);
          openLightbox(index);
        }
      });
    }

    // Seções Opcionais: Plantas e Mapa
    const plantasSec = document.getElementById("detPlantasSec");
    if (plantasSec) { // Sempre verifica a seção, mesmo que oculta
      if (item.plantas?.length > 0) {
        plantasSec.hidden = false; // Mostra a seção
        plantasSec.querySelector("[data-det='plantas']").innerHTML = item.plantas.map(p => `
          <a class="planta" href="${p.arquivo}" target="_blank" rel="noopener">
            <img src="${p.preview || p.arquivo}" alt="Planta ${p.nome || ''}">
            <span>${p.nome || 'Planta'}</span>
          </a>
        `).join("");
      } else {
        plantasSec.hidden = true; // Esconde a seção se não houver plantas
      }
    }
    
    const mapaSec = document.getElementById("detMapaSec");
    if (mapaSec) { // Sempre verifica a seção, mesmo que oculta
      if (item.localizacao?.maps) {
        mapaSec.hidden = false; // Mostra a seção
        mapaSec.querySelector("[data-det='maps']").src = item.localizacao.maps;
      } else {
        mapaSec.hidden = true; // Esconde a seção se não houver mapa
      }
    }

    // Botões de Contato (CTA)
    preencherHref("wa", item.cta?.whatsapp);
    preencherHref("tel", `tel:${(item.cta?.telefone || "").replace(/\D/g, "")}`);
    preencher("tel", "Ligar");
    preencherHref("mail", `mailto:${item.cta?.email}`);
    preencher("mail", "E-mail");
    
  } catch (err) {
    console.error("❌ ERRO GRAVE:", err);
    if (erroBox) erroBox.innerHTML = `<p style="color:red; text-align:center; padding: 2rem;"><b>Ocorreu um erro:</b><br>${err.message}</p>`;
  }
})();