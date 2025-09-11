// Estado de filtros
let state = { cat:'todos', tipo:'todos', local:'todas' };

const grid   = document.getElementById('gridEmp');
const cards  = () => Array.from(grid.querySelectorAll('.card'));
const tabs   = Array.from(document.querySelectorAll('.tab'));
const tipo   = document.getElementById('filterTipo');
const local  = document.getElementById('filterLocal');
const clear  = document.getElementById('btnClear');

function applyFilters(){
  cards().forEach(card => {
    const cat   = card.dataset.cat;   // residencial / corporativo
    const loc   = card.dataset.local; // cidade

    const okTab  = state.cat  === 'todos' || state.cat  === cat;
    const okTipo = state.tipo === 'todos' || state.tipo === cat; // aqui tipo == cat
    const okLoc  = state.local=== 'todas' || state.local=== loc;

    card.style.display = (okTab && okTipo && okLoc) ? '' : 'none';
  });
}

tabs.forEach(t => {
  t.addEventListener('click', () => {
    tabs.forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-selected','false'); });
    t.classList.add('is-active'); t.setAttribute('aria-selected','true');
    state.cat = t.dataset.cat;
    applyFilters();
  });
});

tipo.addEventListener('change', e => { state.tipo = e.target.value; applyFilters(); });
local.addEventListener('change', e => { state.local = e.target.value; applyFilters(); });

clear.addEventListener('click', () => {
  state = { cat:'todos', tipo:'todos', local:'todas' };
  tipo.value  = 'todos';
  local.value = 'todas';
  tabs.forEach(x => {
    const active = x.dataset.cat === 'todos';
    x.classList.toggle('is-active', active);
    x.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  applyFilters();
});

applyFilters();