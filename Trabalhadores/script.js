// script.js - Frontend JavaScript Completo
const API_URL = 'http://127.0.0.1:8000/api';

// ========== VARIÁVEIS GLOBAIS ==========
let especialidades = [];
const especialidadeInput = document.getElementById('especialidadeInput');
const addEspecialidadeBtn = document.getElementById('addEspecialidadeBtn');
const especialidadesList = document.getElementById('especialidadesList');

// ========== FUNÇÕES DE API ==========

// Função para buscar e renderizar prestadores
async function carregarPrestadores(filtros = {}) {
  try {
    const cardsContainer = document.querySelector('.home-cards');
    cardsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Carregando...</p>';
    
    let dados;
    
    // Se houver filtros, usa o endpoint de filtragem
    if (Object.keys(filtros).length > 0) {
      const response = await fetch(`${API_URL}/prestadores/filtrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtros)
      });
      dados = await response.json();
    } else {
      const response = await fetch(`${API_URL}/prestadores`);
      dados = await response.json();
    }
    
    if (dados.length === 0) {
      cardsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhum profissional encontrado.</p>';
      return;
    }
    
    // Limpa o container
    cardsContainer.innerHTML = '';
    
    // Renderiza cada prestador
    dados.forEach(prestador => {
      const card = criarCard(prestador);
      cardsContainer.appendChild(card);
    });
    
  } catch (error) {
    console.error('Erro ao carregar prestadores:', error);
    document.querySelector('.home-cards').innerHTML = 
      '<p style="text-align: center; padding: 20px; color: red;">Erro ao carregar dados. Tente novamente.</p>';
  }
}

// Função para criar um card de prestador
function criarCard(prestador) {
  const card = document.createElement('div');
  card.className = 'card';
  
  // Separa os telefones (vêm concatenados do banco)
  const telefones = prestador.telefones ? prestador.telefones.split(',') : [];
  const telefone = telefones[0] || 'Não informado';
  
  // Formata a avaliação
  const avaliacao = prestador.avaliacao || 0;
  const numAvaliacoes = prestador.num_avaliacoes || 0;
  
  card.innerHTML = `
    <div class="top-content-card">
      <div class="TCC-center">
        <div class="foto-perfil"></div>
        <div class="nome-area">
          <h3 class="nome-card">${prestador.nome}</h3>
          <p class="area-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                 fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
                 stroke-linejoin="round" class="lucide lucide-briefcase w-4 h-4">
              <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              <rect width="20" height="14" x="2" y="6" rx="2"></rect>
            </svg>
            ${prestador.tipo_profissao}
          </p>
        </div>
      </div>
      <button class="remover-favorito" onclick="toggleFavorito(${prestador.id})">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
             fill="none" stroke="#ef4343" stroke-width="2" stroke-linecap="round" 
             stroke-linejoin="round" class="lucide lucide-heart w-5 h-5">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>
      </button>
    </div>
    
    <p class="empresa-ou-profissional">Profissional</p>
    
    <div class="avaliacao-content">
      <div class="stars">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
             stroke-linejoin="round" class="star pri">
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
        </svg>
      </div>
      <span class="quant-stars">${avaliacao.toFixed(1)}</span>
      <span class="quant-avaliacoes">(${numAvaliacoes} avaliações)</span>
    </div>
    
    <div class="localizacao">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
           fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
           stroke-linejoin="round" class="lucide lucide-map-pin w-4 h-4">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span class="lc-cidade_estado">${prestador.cidade}, ${prestador.uf}</span>
    </div>
    
    <div class="telefone">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
           fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
           stroke-linejoin="round" class="lucide lucide-phone w-4 h-4">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
      <span class="tl-numero">${telefone}</span>
    </div>
    
    <div class="email">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
           fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
           stroke-linejoin="round" class="lucide lucide-mail w-4 h-4">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>
      <span class="email-text">${prestador.email}</span>
    </div>
    
    <div class="line"></div>
    
    <button class="ver-perfil" onclick="verPerfil(${prestador.id})">Ver Perfil</button>
  `;
  
  return card;
}

// Função para redirecionar ao perfil
function verPerfil(prestadorId) {
  // Salva o ID no localStorage
  localStorage.setItem('prestadorId', prestadorId);
  
  // Redireciona para a página de perfil
  window.location.href = '../Perfil/PróprioTE/PróprioT/index.html';
}

// Função para toggle favorito
function toggleFavorito(prestadorId) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  const index = favoritos.indexOf(prestadorId);
  
  if (index > -1) {
    favoritos.splice(index, 1);
    showToast('Removido dos favoritos', 'success');
  } else {
    favoritos.push(prestadorId);
    showToast('Adicionado aos favoritos', 'success');
  }
  
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// ========== FUNÇÕES DE FILTROS ==========

// Configurar filtros
function configurarFiltros() {
  // Botões de busca nos inputs
  const buscaBtns = document.querySelectorAll('.icon-btn');
  buscaBtns.forEach(btn => {
    btn.addEventListener('click', aplicarFiltros);
  });
  
  // Enter nos inputs de filtro
  document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        aplicarFiltros();
      }
    });
  });
  
  // Botão limpar filtros
  const btnLimpar = document.querySelector('.clear-filters-btn');
  if (btnLimpar) {
    btnLimpar.addEventListener('click', limparFiltros);
  }
  
  // Select de ordenação
  const selectOrdem = document.querySelector('.filter-select');
  if (selectOrdem) {
    selectOrdem.addEventListener('change', aplicarFiltros);
  }
}

// Aplicar filtros
function aplicarFiltros() {
  const cidadeInput = document.querySelector('.filter-input[placeholder*="São Paulo"]');
  const areaProfissionalInput = document.querySelector('.filter-input[placeholder*="Pedreiro"]');
  
  const cidade = cidadeInput ? cidadeInput.value.trim() : '';
  const areaProfissional = areaProfissionalInput ? areaProfissionalInput.value.trim() : '';
  
  // Pega a avaliação mínima selecionada
  const avaliacaoBtn = document.querySelector('.rating-btn.active');
  let avaliacaoMinima = null;
  if (avaliacaoBtn && avaliacaoBtn.textContent.trim() !== 'Todas') {
    avaliacaoMinima = parseFloat(avaliacaoBtn.textContent.trim());
  }
  
  const filtros = {};
  if (cidade) filtros.cidade = cidade;
  if (areaProfissional) filtros.areaProfissional = areaProfissional;
  if (avaliacaoMinima) filtros.avaliacaoMinima = avaliacaoMinima;
  
  carregarPrestadores(filtros);
}

// Limpar filtros
function limparFiltros() {
  document.querySelectorAll('.filter-input').forEach(input => input.value = '');
  document.querySelectorAll('.rating-btn').forEach((btn, idx) => {
    btn.classList.remove('active');
    if (idx === 0) btn.classList.add('active');
  });
  document.querySelectorAll('.availability-btn').forEach(btn => btn.classList.remove('active'));
  
  const selectOrdem = document.querySelector('.filter-select');
  if (selectOrdem) selectOrdem.selectedIndex = 0;
  
  // Recarrega todos os prestadores
  carregarPrestadores();
}

// ========== RATING BUTTONS ==========
const ratingBtns = document.querySelectorAll('.rating-btn');
ratingBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    ratingBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ========== AVAILABILITY BUTTONS ==========
const availabilityBtns = document.querySelectorAll('.availability-btn');
availabilityBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
  });
});

// ========== ESPECIALIDADES ==========

function addEspecialidade() {
  if (!especialidadeInput) return;
  const value = especialidadeInput.value.trim();

  if (value === '') {
    showToast('Digite uma especialidade', 'error');
    return;
  }

  if (especialidades.includes(value)) {
    showToast('Especialidade já adicionada', 'error');
    return;
  }

  especialidades.push(value);
  renderEspecialidades();
  updateHiddenField();
  especialidadeInput.value = '';
  especialidadeInput.focus();
}

function removeEspecialidade(index) {
  especialidades.splice(index, 1);
  renderEspecialidades();
  updateHiddenField();
}

function renderEspecialidades() {
  if (!especialidadesList) return;
  especialidadesList.innerHTML = '';

  especialidades.forEach((especialidade, index) => {
    const tag = document.createElement('div');
    tag.className = 'especialidade-tag';
    tag.innerHTML = `
      <span>${especialidade}</span>
      <button type="button" class="remove-tag-btn" data-index="${index}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    especialidadesList.appendChild(tag);
  });

  const buttons = especialidadesList.querySelectorAll('.remove-tag-btn');
  buttons.forEach(btn => {
    btn.removeEventListener('click', handleRemoveClick);
    btn.addEventListener('click', handleRemoveClick);
  });
}

function handleRemoveClick(e) {
  const idx = Number(e.currentTarget.getAttribute('data-index'));
  if (!isNaN(idx)) removeEspecialidade(idx);
}

function updateHiddenField() {
  // Se você tiver um campo hidden para enviar as especialidades
  const hiddenField = document.getElementById('especialidades-hidden');
  if (hiddenField) {
    hiddenField.value = JSON.stringify(especialidades);
  }
}

// Event listeners para especialidades
if (addEspecialidadeBtn) {
  addEspecialidadeBtn.addEventListener('click', addEspecialidade);
}

if (especialidadeInput) {
  especialidadeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEspecialidade();
    }
  });
}

// ========== FUNÇÃO DE TOAST ==========
function showToast(message, type = 'info') {
  // Cria o toast se não existir
  let toast = document.querySelector('.toast-notification');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.className = `toast-notification toast-${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ========== INICIALIZAÇÃO ==========
function loadMockData() {
  // Carrega dados mock apenas se necessário
  if (especialidadesList && especialidades.length === 0) {
    especialidades = ['Design', 'Branding', 'UI/UX'];
    renderEspecialidades();
    updateHiddenField();
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  // Carrega os prestadores da API
  carregarPrestadores();
  
  // Configura os filtros
  configurarFiltros();
  
  // Carrega dados mock (se necessário)
  loadMockData();
});

// Torna as funções disponíveis globalmente
window.verPerfil = verPerfil;
window.toggleFavorito = toggleFavorito;
window.removeEspecialidade = removeEspecialidade;