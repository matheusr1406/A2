// === MENU MOBILE ===
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const navbar = document.getElementById("navbar");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });
}

// === CARROSSEL: DESTAQUES (card-carrossel) ===
// 1) DECLARE o índice ANTES de usar
let indiceAtual = 0;

function mostrarSlide(index) {
  const slides = document.querySelectorAll(".card-carrossel");
  const total = slides.length;
  if (!total) return; // nada a fazer se não houver slides

  // 2) normaliza o índice com wrap-around
  if (index >= total) indiceAtual = 0;
  else if (index < 0) indiceAtual = total - 1;
  else indiceAtual = index;

  slides.forEach((slide) => slide.classList.remove("ativo"));
  slides[indiceAtual].classList.add("ativo");
}

function mudarSlide(direcao) {
  mostrarSlide(indiceAtual + direcao);
}

// 3) inicializa após o DOM pronto (garante que os slides existam)
document.addEventListener("DOMContentLoaded", () => {
  mostrarSlide(0);
});


// === FADE-IN "ESSÊNCIA" (só se a seção existir) ===
const blocos = document.querySelectorAll(".essencia-container .bloco");

function animarBlocos() {
  // se não há blocos, não faz nada
  if (!blocos.length) return;

  blocos.forEach((bloco) => {
    const blocoTop = bloco.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (blocoTop < windowHeight - 100) {
      const delay = bloco.dataset.delay || 0;
      setTimeout(() => {
        bloco.style.opacity = "1";
        bloco.style.transform = "translateY(0)";
      }, delay);
    }
  });
}

// registra listeners só se houver blocos
if (blocos.length) {
  window.addEventListener("scroll", animarBlocos, { passive: true });
  window.addEventListener("load", animarBlocos);
}


// === CARROSSEL: LANÇAMENTOS (card-lanc) ===
let indiceLanc = 0;

function mostrarSlideLanc(index) {
  const slides = document.querySelectorAll(".card-lanc");
  const total = slides.length;
  if (!total) return;

  if (index >= total) indiceLanc = 0;
  else if (index < 0) indiceLanc = total - 1;
  else indiceLanc = index;

  slides.forEach((slide) => slide.classList.remove("ativo"));
  slides[indiceLanc].classList.add("ativo");
}

function mudarSlideLanc(direcao) {
  mostrarSlideLanc(indiceLanc + direcao);
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarSlideLanc(0);
});