// script.js - Favoritos (COMPLETO)
const API_URL = 'http://127.0.0.1:8000/api';

let todosOsFavoritos = [];
let filtroAtivo = 'todos'; // 'todos', 'profissionais', 'empresas'

// ========== NAVEGAÇÃO ENTRE FILTROS ==========
const botao_todos = document.getElementById('btn-todos');
const botao_profi = document.getElementById('btn-profissionais');
const botao_empre = document.getElementById('btn-empresas');

function filtro_T() {
  if (!botao_todos.classList.contains('ativo')) {
    document.querySelector('.button-tab.ativo').classList.remove('ativo');
    botao_todos.classList.add('ativo');
    filtroAtivo = 'todos';
    renderizarFavoritos();
  }
}

function filtro_P() {
  if (!botao_profi.classList.contains('ativo')) {
    document.querySelector('.button-tab.ativo').classList.remove('ativo');
    botao_profi.classList.add('ativo');
    filtroAtivo = 'profissionais';
    renderizarFavoritos();
  }
}

function filtro_E() {
  if (!botao_empre.classList.contains('ativo')) {
    document.querySelector('.button-tab.ativo').classList.remove('ativo');
    botao_empre.classList.add('ativo');
    filtroAtivo = 'empresas';
    renderizarFavoritos();
  }
}

botao_todos.addEventListener("click", filtro_T);
botao_profi.addEventListener("click", filtro_P);
botao_empre.addEventListener("click", filtro_E);

// ========== CARREGAR FAVORITOS ==========
async function carregarFavoritos() {
  try {
    const cardsContainer = document.querySelector('.home-cards');
    cardsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Carregando favoritos...</p>';
    
    // Pega IDs dos favoritos do localStorage
    const favoritosIds = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    if (favoritosIds.length === 0) {
      cardsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" stroke-width="2" style="margin-bottom: 20px;">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          <h3 style="color: #6d6c7f; margin-bottom: 10px;">Nenhum favorito ainda</h3>
          <p style="color: #a0aec0;">Adicione profissionais e empresas aos favoritos para acessá-los rapidamente!</p>
        </div>
      `;
      atualizarContadores(0, 0, 0);
      return;
    }
    
    console.log('🔵 Carregando favoritos:', favoritosIds);
    
    // Busca todos os usuários
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    
    const dados = await response.json();
    let usuarios = Array.isArray(dados) ? dados : (dados.data || dados.users || []);
    
    // Filtra apenas os favoritos
    todosOsFavoritos = usuarios.filter(user => 
      favoritosIds.includes(user.id)
    );
    
    console.log('✅ Favoritos encontrados:', todosOsFavoritos.length);
    
    // Atualiza contadores
    const profissionais = todosOsFavoritos.filter(u => u.type === 'prestador').length;
    const empresas = todosOsFavoritos.filter(u => u.type === 'empresa').length;
    atualizarContadores(todosOsFavoritos.length, profissionais, empresas);
    
    // Renderiza
    renderizarFavoritos();
    
  } catch (error) {
    console.error('❌ Erro ao carregar favoritos:', error);
    mostrarErro(error);
  }
}

function renderizarFavoritos() {
  const cardsContainer = document.querySelector('.home-cards');
  
  // Filtra conforme aba ativa
  let favoritosFiltrados = todosOsFavoritos;
  
  if (filtroAtivo === 'profissionais') {
    favoritosFiltrados = todosOsFavoritos.filter(u => u.type === 'prestador');
  } else if (filtroAtivo === 'empresas') {
    favoritosFiltrados = todosOsFavoritos.filter(u => u.type === 'empresa');
  }
  
  // Aplica ordenação
  const ordenacao = document.getElementById('ord-select').value;
  favoritosFiltrados = ordenarFavoritos(favoritosFiltrados, ordenacao);
  
  if (favoritosFiltrados.length === 0) {
    cardsContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <p style="color: #6d6c7f; font-size: 18px;">Nenhum ${filtroAtivo === 'profissionais' ? 'profissional' : filtroAtivo === 'empresas' ? 'empresa' : 'favorito'} encontrado.</p>
      </div>
    `;
    return;
  }
  
  cardsContainer.innerHTML = '';
  
  favoritosFiltrados.forEach(usuario => {
    const card = criarCard(usuario);
    cardsContainer.appendChild(card);
  });
  
  console.log(`✅ ${favoritosFiltrados.length} favorito(s) renderizado(s)`);
}

function ordenarFavoritos(favoritos, criterio) {
  const copia = [...favoritos];
  
  switch (criterio) {
    case 'recente':
      return copia.reverse(); // Assume que os mais recentes vêm por último
    case 'antigo':
      return copia;
    case 'nome':
      return copia.sort((a, b) => {
        const nomeA = a.prestador?.nome || a.empresa?.razao_social || '';
        const nomeB = b.prestador?.nome || b.empresa?.razao_social || '';
        return nomeA.localeCompare(nomeB);
      });
    case 'avaliacao':
      return copia.sort((a, b) => {
        const avalA = a.avaliacao?.media || 0;
        const avalB = b.avaliacao?.media || 0;
        return avalB - avalA; // Maior primeiro
      });
    default:
      return copia;
  }
}

function atualizarContadores(todos, profissionais, empresas) {
  const spanTodos = document.getElementById('span-todos');
  const spanProfi = document.getElementById('span-profissionais');
  const spanEmpre = document.getElementById('span-empresas');
  
  if (spanTodos) spanTodos.textContent = todos;
  if (spanProfi) spanProfi.textContent = profissionais;
  if (spanEmpre) spanEmpre.textContent = empresas;
}

function criarCard(usuario) {
  const card = document.createElement('div');
  card.className = 'card';
  
  let nome, cidade, uf, email, telefone, tipoProfissao, foto, tipo;
  
  if (usuario.type === 'prestador') {
    nome = usuario.prestador?.nome || 'Nome não informado';
    cidade = usuario.prestador?.localidade || 'Cidade';
    uf = usuario.prestador?.uf || 'UF';
    email = usuario.email || 'Email não informado';
    telefone = usuario.contato?.telefone || 'Não informado';
    tipoProfissao = usuario.ramo?.nome || 'Profissão não informada';
    foto = usuario.prestador?.foto;
    tipo = 'Profissional';
  } else {
    nome = usuario.empresa?.razao_social || 'Empresa não informada';
    cidade = usuario.empresa?.localidade || 'Cidade';
    uf = usuario.empresa?.uf || 'UF';
    email = usuario.email || 'Email não informado';
    telefone = usuario.contato?.telefone || 'Não informado';
    tipoProfissao = usuario.categoria?.nome || 'Categoria não informada';
    foto = usuario.empresa?.foto;
    tipo = 'Empresa';
  }
  
  if (foto && !foto.startsWith('http')) {
    foto = `http://127.0.0.1:8000/storage/${foto}`;
  }
  
  const avaliacao = usuario.avaliacao?.media || 0;
  const numAvaliacoes = usuario.avaliacao?.total || 0;
  const usuarioId = usuario.id;
  
  card.innerHTML = `
    <div class="top-content-card">
      <div class="TCC-center">
        <div class="foto-perfil" style="${foto ? `background-image: url('${foto}'); background-size: cover; background-position: center;` : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'}"></div>
        <div class="nome-area">
          <h3 class="nome-card">${nome}</h3>
          <p class="area-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                 fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
                 stroke-linejoin="round" class="lucide lucide-briefcase w-4 h-4">
              <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              <rect width="20" height="14" x="2" y="6" rx="2"></rect>
            </svg>
            ${tipoProfissao}
          </p>
        </div>
      </div>
      <button class="remover-favorito" onclick="removerFavorito(${usuarioId})">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
             fill="#ef4343" stroke="#ef4343" stroke-width="2" stroke-linecap="round" 
             stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>
      </button>
    </div>
    
    <p class="empresa-ou-profissional">${tipo}</p>
    
    <div class="avaliacao-content">
      <div class="stars">
        ${gerarEstrelas(avaliacao)}
      </div>
      <span class="quant-stars">${Number(avaliacao).toFixed(1)}</span>
      <span class="quant-avaliacoes">(${numAvaliacoes} ${numAvaliacoes === 1 ? 'avaliação' : 'avaliações'})</span>
    </div>
    
    <div class="localizacao">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
           fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
           stroke-linejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span class="lc-cidade_estado">${cidade}, ${uf}</span>
    </div>
    
    <div class="telefone">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
           fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
           stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
      <span class="tl-numero">${telefone}</span>
    </div>
    
    <div class="email">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
           fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
           stroke-linejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>
      <span class="email-text">${email}</span>
    </div>
    
    <div class="line"></div>
    
    <button class="ver-perfil" onclick="verPerfil(${usuarioId})">Ver Perfil</button>
  `;
  
  return card;
}

function gerarEstrelas(avaliacao) {
  let estrelas = '';
  for (let i = 1; i <= 5; i++) {
    estrelas += `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
           fill="${i <= avaliacao ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" 
           stroke-linecap="round" stroke-linejoin="round" class="star">
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
      </svg>
    `;
  }
  return estrelas;
}

function removerFavorito(usuarioId) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  const index = favoritos.indexOf(usuarioId);
  
  if (index > -1) {
    favoritos.splice(index, 1);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    showToast('Removido dos favoritos', 'success');
    
    // Recarrega a lista
    carregarFavoritos();
  }
}

function verPerfil(usuarioId) {
  console.log('Redirecionando para perfil:', usuarioId);
  localStorage.setItem('usuarioId', usuarioId);
  
  // Detecta o tipo
  const usuario = todosOsFavoritos.find(u => u.id === usuarioId);
  if (usuario) {
    localStorage.setItem('usuarioTipo', usuario.type);
  }
  
  window.location.href = '../Perfil/Acessando/TE/index.html';
}

function mostrarErro(error) {
  const cardsContainer = document.querySelector('.home-cards');
  cardsContainer.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px;">
      <h3 style="color: #856404; margin-top: 0;">⚠️ Erro ao carregar favoritos</h3>
      <p style="color: #856404;">${error.message}</p>
      <button onclick="carregarFavoritos()" style="margin-top: 15px; padding: 10px 20px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px;">
        🔄 Tentar Novamente
      </button>
    </div>
  `;
}

function showToast(message, type = 'info') {
  let toast = document.querySelector('.toast-notification');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 15px 20px;
      background: #333;
      color: white;
      border-radius: 4px;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.style.opacity = '1';
  
  if (type === 'success') {
    toast.style.background = '#28a745';
  } else if (type === 'error') {
    toast.style.background = '#dc3545';
  }
  
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);
}

// ========== ORDENAÇÃO ==========
const selectOrdenacao = document.getElementById('ord-select');
if (selectOrdenacao) {
  selectOrdenacao.addEventListener('change', renderizarFavoritos);
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Página de Favoritos carregada');
  carregarFavoritos();
});

// Torna funções disponíveis globalmente
window.verPerfil = verPerfil;
window.removerFavorito = removerFavorito;