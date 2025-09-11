// js/detalhe.js

function toSlug(str = "") {
    return String(str)
      .normalize("NFD")
      .replace(/\u0300-\u036f/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  
  function renderNotFound(msg = "Empreendimento não encontrado") {
    const erroBox = document.getElementById("detalheErro") || document.body;
    if (erroBox) {
      const html = `
        <section class="alert alert--error">
          <h3>${msg}</h3>
          <p><a href="empreendimentos.html">← Voltar para a lista</a></p>
        </section>
      `;
      erroBox.insertAdjacentHTML("afterbegin", html);
    }
  }
  
  (async function main() {
    // 1) slug vindo da URL ?p=
    const p = new URLSearchParams(location.search).get("p");
    if (!p) { renderNotFound("Parâmetro ausente."); return; }
  
    try {
      // 2) JSON: resolve com base na página atual (robusto para /subpastas/)
      const jsonURL = new URL("assets/dados/empreendimentos.json", document.baseURI).href;
  
      // dica: log para debug
      console.debug("[detalhe] tentando buscar:", jsonURL, "slug:", p);
  
      const resp = await fetch(jsonURL, { cache: "no-store" });
      if (!resp.ok) throw new Error(`Erro ao carregar JSON: ${resp.status}`);
  
      const lista = await resp.json();
  
      // 3) procurar por slug exato
      let item = lista.find(x => String(x.slug || "").toLowerCase() === String(p).toLowerCase());
  
      // 4) fallback: comparar slug gerado a partir do título
      if (!item) {
        item = lista.find(x => toSlug(x.titulo || "") === String(p).toLowerCase());
      }
  
      // 5) último fallback: título exatamente igual ao p (caso raro)
      if (!item) {
        item = lista.find(x => String(x.titulo || "").toLowerCase() === String(p).toLowerCase());
      }
  
      if (!item) {
        // ajuda no console: quais slugs existem
        console.warn("[detalhe] slug não encontrado:", p, "disponíveis:", lista.map(x => x.slug));
        renderNotFound();
        return;
      }
  
      // 6) Preenche a página
      // SEO
      if (item.seo?.title)  document.title = item.seo.title;
      if (item.seo?.description) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "description";
          document.head.appendChild(meta);
        }
        meta.content = item.seo.description;
      }
  
      // Título
      const h1 = document.querySelector("[data-det='titulo']");
      if (h1) h1.textContent = item.titulo || "Empreendimento";
  
      // Resumo
      const resumo = document.querySelector("[data-det='resumo']");
      if (resumo && item.resumo) resumo.textContent = item.resumo;
  
      // Destaques
      const destaques = document.querySelector("[data-det='destaques']");
      if (destaques && Array.isArray(item.destaques)) {
        destaques.innerHTML = item.destaques.map(d => `<li>${d}</li>`).join("");
      }
  
      // Descrição
      const descricao = document.querySelector("[data-det='descricao']");
      if (descricao && item.descricao) descricao.textContent = item.descricao;
  
      // Galeria
      const galeria = document.querySelector("[data-det='galeria']");
      if (galeria && Array.isArray(item.galeria)) {
        galeria.innerHTML = item.galeria
          .map(src => `<figure class="galeria__item"><img src="${src}" alt="${item.titulo}"></figure>`)
          .join("");
      }
  
      // Plantas
      const plantas = document.querySelector("[data-det='plantas']");
      if (plantas && Array.isArray(item.plantas)) {
        plantas.innerHTML = item.plantas
          .map(p => `<a class="planta" href="${p.arquivo}" target="_blank" rel="noopener">${p.nome}</a>`)
          .join("");
      }
  
      // Localização
      const endereco = document.querySelector("[data-det='endereco']");
      if (endereco && item.localizacao?.endereco) endereco.textContent = item.localizacao.endereco;
  
      const iframe = document.querySelector("[data-det='maps']");
      if (iframe && item.localizacao?.maps) iframe.src = item.localizacao.maps;
  
      // CTA
      const tel = document.querySelector("[data-det='tel']");
      if (tel && item.cta?.telefone) { tel.textContent = item.cta.telefone; tel.href = `tel:${item.cta.telefone.replace(/\s+/g,"")}`; }
  
      const mail = document.querySelector("[data-det='mail']");
      if (mail && item.cta?.email) { mail.textContent = item.cta.email; mail.href = `mailto:${item.cta.email}`; }
  
      const wa = document.querySelector("[data-det='wa']");
      if (wa && item.cta?.whatsapp) { wa.href = item.cta.whatsapp; }
  
      console.debug("[detalhe] renderizado:", item);
    } catch (err) {
      console.error("[detalhe] falha geral:", err);
      renderNotFound("Falha ao carregar os dados.");
    }
  })();