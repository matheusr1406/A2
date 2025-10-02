// === MENU MOBILE ===
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });
}

// ===================================================
// === CARROSSEL: DESTAQUES (card-carrossel) ===
// ===================================================
let indiceAtual = 0;
let slideInterval;

function iniciarIntervaloDestaques() {
  slideInterval = setInterval(() => mudarSlide(1), 5000);
}

function reiniciarIntervaloDestaques() {
  clearInterval(slideInterval);
  iniciarIntervaloDestaques();
}

function mostrarSlide(index) {
  const slides = document.querySelectorAll(".card-carrossel");
  if (!slides.length) return;
  const total = slides.length;

  if (index >= total) indiceAtual = 0;
  else if (index < 0) indiceAtual = total - 1;
  else indiceAtual = index;

  slides.forEach((slide) => slide.classList.remove("ativo"));
  slides[indiceAtual].classList.add("ativo");
}

function mudarSlide(direcao) {
  mostrarSlide(indiceAtual + direcao);
  reiniciarIntervaloDestaques();
}

// ===================================================
// === CARROSSEL: LANÇAMENTOS (card-lanc) ===
// ===================================================
let indiceLanc = 0;
let lancInterval;

function iniciarIntervaloLanc() {
  lancInterval = setInterval(() => mudarSlideLanc(1), 5000);
}

function reiniciarIntervaloLanc() {
  clearInterval(lancInterval);
  iniciarIntervaloLanc();
}

function mostrarSlideLanc(index) {
  const slides = document.querySelectorAll(".card-lanc");
  if (!slides.length) return;
  const total = slides.length;

  if (index >= total) indiceLanc = 0;
  else if (index < 0) indiceLanc = total - 1;
  else indiceLanc = index;

  slides.forEach((slide) => slide.classList.remove("ativo"));
  slides[indiceLanc].classList.add("ativo");
}

function mudarSlideLanc(direcao) {
  mostrarSlideLanc(indiceLanc + direcao);
  reiniciarIntervaloLanc();
}

// ===================================================
// === INICIALIZAÇÃO GERAL QUANDO A PÁGINA CARREGA ===
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  // --- Lógica para a PÁGINA HOME ---
  const carrosselDestaques = document.querySelector(".card-carrossel");
  if (carrosselDestaques) {
    mostrarSlide(0);
    iniciarIntervaloDestaques();
  }

  const carrosselLancamentos = document.querySelector(".card-lanc");
  if (carrosselLancamentos) {
    mostrarSlideLanc(0);
    iniciarIntervaloLanc();
  }

  // --- Lógica do Carrossel de Vídeos (PÁGINA HOME) ---
  const videoPlayer = document.getElementById("video-player");
  const videoInfoContainer = document.getElementById("video-info");

  if (videoPlayer && videoInfoContainer) {
    const videoData = [
      {
        src: "assets/video/video1.mp4",
        title: "Casa Gravatai",
        description:
          "Um oásis de tranquilidade e sofisticação no coração da cidade.",
        link: "#",
      },
      {
        src: "assets/video/video2.mp4",
        title: "Casa Ecoville",
        description:
          "Viva nas alturas com uma vista panorâmica e design arrojado.",
        link: "#",
      },
      {
        src: "assets/video/video3.mp4",
        title: "Casa Alphaville",
        description:
          "Conforto, segurança e lazer completo para toda a família.",
        link: "#",
      },
    ];
    let currentVideoIndex = 0;

    function updateVideoInfo(index) {
      const data = videoData[index];
      videoInfoContainer.innerHTML = `<h3>${data.title}</h3><p>${data.description}</p><a href="${data.link}">Saiba mais</a>`;
    }

    function changeVideo() {
      currentVideoIndex = (currentVideoIndex + 1) % videoData.length;
      videoPlayer.src = videoData[currentVideoIndex].src;
      videoPlayer.play();
      updateVideoInfo(currentVideoIndex);
    }

    updateVideoInfo(currentVideoIndex);
    videoPlayer.addEventListener("ended", changeVideo);
  }

  // --- Lógica da Animação de Scroll (GERAL PARA TODAS AS PÁGINAS) ---
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    animatedElements.forEach((element) => observer.observe(element));
  }

  // --- Lógica da Animação Interna (ESPECÍFICO PARA A PÁGINA SOBRE) ---
  const qsCard = document.querySelector(".qs-card");
  if (qsCard) {
    qsCard.addEventListener("animationend", () => {
      const internalElements = document.querySelectorAll(".animate-internal");
      internalElements.forEach((el, index) => {
        el.style.transition = `opacity 0.5s ease ${
          index * 0.15
        }s, transform 0.5s ease ${index * 0.15}s`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  }
});
