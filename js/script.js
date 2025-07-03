const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
});


const phrases = [
  "Construções de Alto Padrão",
  "Excelência em Cada Detalhe",
  "Arquitetura com Propósito"
];

const typedText = document.querySelector(".typed-text");
const cursor = document.querySelector(".cursor");

let phraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function type() {
  const currentPhrase = phrases[phraseIndex];
  const visibleText = currentPhrase.substring(0, letterIndex);
  typedText.textContent = visibleText;

  if (!isDeleting) {
    if (letterIndex < currentPhrase.length) {
      letterIndex++;
    } else {
      isDeleting = true;
      setTimeout(type, 1500); // pausa no final da frase
      return;
    }
  } else {
    if (letterIndex > 0) {
      letterIndex--;
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(type, isDeleting ? 50 : 100);
}

type();

let indiceAtual = 0;

function mostrarSlide(index) {
  const slides = document.querySelectorAll(".card-carrossel");

  if (index >= slides.length) indiceAtual = 0;
  else if (index < 0) indiceAtual = slides.length - 1;
  else indiceAtual = index;

  slides.forEach((slide, i) => {
    slide.classList.remove("ativo");
  });

  slides[indiceAtual].classList.add("ativo");
}

function mudarSlide(direcao) {
  mostrarSlide(indiceAtual + direcao);
}

mostrarSlide(indiceAtual);



// Fade-in animation ao rolar
const blocos = document.querySelectorAll('.essencia-container .bloco');

function animarBlocos() {
  blocos.forEach((bloco) => {
    const blocoTop = bloco.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (blocoTop < windowHeight - 100) {
      const delay = bloco.dataset.delay || 0;
      setTimeout(() => {
        bloco.style.opacity = '1';
        bloco.style.transform = 'translateY(0)';
      }, delay);
    }
  });
}

window.addEventListener('scroll', animarBlocos);
window.addEventListener('load', animarBlocos);


let indiceLanc = 0;

function mostrarSlideLanc(index) {
  const slides = document.querySelectorAll(".card-lanc");

  if (index >= slides.length) indiceLanc = 0;
  else if (index < 0) indiceLanc = slides.length - 1;
  else indiceLanc = index;

  slides.forEach((slide) => slide.classList.remove("ativo"));
  slides[indiceLanc].classList.add("ativo");
}

function mudarSlideLanc(direcao) {
  mostrarSlideLanc(indiceLanc + direcao);
}

mostrarSlideLanc(indiceLanc);


