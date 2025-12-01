// ==========================================
// SCRIPT FEED - VERSÃO COMPLETA COM API
// ==========================================

const API_URL = 'http://127.0.0.1:8000/api';
const BASE_URL = 'http://127.0.0.1:8000';

// ========== UTILITÁRIOS ==========
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

function construirUrlCompleta(caminho) {
  if (!caminho) return null;
  if (caminho.startsWith('http')) return caminho;
  
  const caminhoLimpo = caminho.replace(/^public\//, '');
  return `${BASE_URL}/storage/${caminhoLimpo}`;
}

// ========== ELEMENTOS DE FILTRO ==========
const fotosCheckbox = document.getElementById('fotos');
const videosCheckbox = document.getElementById('videos');
const profissionalCheckbox = document.getElementById('profissional');
const empresaCheckbox = document.getElementById('empresa');
const profissaoInput = document.getElementById('profissaoInput');
const keywordsInput = document.getElementById('keywordsInput');
const orderBySelect = document.getElementById('orderBy');
const clearFiltersBtn = document.getElementById('clearFilters');

// ========== LIMPAR FILTROS ==========
clearFiltersBtn?.addEventListener('click', () => {
  fotosCheckbox.checked = true;
  videosCheckbox.checked = false;
  profissionalCheckbox.checked = true;
  empresaCheckbox.checked = true;
  profissaoInput.value = '';
  keywordsInput.value = '';
  orderBySelect.selectedIndex = 0;
  
  carregarPublicacoesFeed();
});

// ========== APLICAR FILTROS ==========
const filters = [
  fotosCheckbox,
  videosCheckbox,
  profissionalCheckbox,
  empresaCheckbox,
  profissaoInput,
  keywordsInput,
  orderBySelect
];

filters.forEach(filter => {
  if (filter) {
    const eventType = filter.type === 'checkbox' || filter.tagName === 'SELECT' ? 'change' : 'input';
    filter.addEventListener(eventType, () => {
      carregarPublicacoesFeed();
    });
  }
});

// ========== CARREGAR PUBLICAÇÕES DO FEED ==========
async function carregarPublicacoesFeed() {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.log('⚠️ Usuário não autenticado');
      return;
    }
    
    console.log('🔵 Carregando publicações do feed...');
    
    const response = await fetch(`${API_URL}/portfolio`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao carregar publicações');
    }
    
    const data = await response.json();
    let publicacoes = data.data || data.portfolios || data;
    
    console.log('✅ Publicações recebidas:', publicacoes);
    
    // Aplicar filtros
    publicacoes = aplicarFiltros(publicacoes);
    
    // Renderizar publicações
    renderizarPublicacoes(publicacoes);
    
  } catch (error) {
    console.error('❌ Erro ao carregar feed:', error);
    const feedContainer = document.querySelector('.feed-list');
    if (feedContainer) {
      feedContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">Erro ao carregar publicações</p>';
    }
  }
}

// ========== APLICAR FILTROS ==========
function aplicarFiltros(publicacoes) {
  let resultado = [...publicacoes];
  
  // Filtro por tipo de mídia
  const mostrarFotos = fotosCheckbox?.checked;
  const mostrarVideos = videosCheckbox?.checked;
  
  if (!mostrarFotos || !mostrarVideos) {
    resultado = resultado.filter(pub => {
      if (!pub.fotos || pub.fotos.length === 0) return false;
      
      const temFoto = pub.fotos.some(foto => {
        const ext = foto.caminho.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
      });
      
      const temVideo = pub.fotos.some(foto => {
        const ext = foto.caminho.toLowerCase().split('.').pop();
        return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
      });
      
      if (mostrarFotos && !mostrarVideos) return temFoto;
      if (!mostrarFotos && mostrarVideos) return temVideo;
      return false;
    });
  }
  
  // Filtro por tipo de conta
  const mostrarProfissional = profissionalCheckbox?.checked;
  const mostrarEmpresa = empresaCheckbox?.checked;
  
  if (!mostrarProfissional || !mostrarEmpresa) {
    resultado = resultado.filter(pub => {
      const tipoConta = pub.usuario?.tipo_conta || pub.user?.tipo_conta;
      if (mostrarProfissional && !mostrarEmpresa) return tipoConta === 'prestador';
      if (!mostrarProfissional && mostrarEmpresa) return tipoConta === 'empresa';
      return false;
    });
  }
  
  // Filtro por profissão
  const profissaoFiltro = profissaoInput?.value.trim().toLowerCase();
  if (profissaoFiltro) {
    resultado = resultado.filter(pub => {
      const ramo = pub.usuario?.ramo?.nome || pub.user?.ramo?.nome || '';
      return ramo.toLowerCase().includes(profissaoFiltro);
    });
  }
  
  // Filtro por palavras-chave
  const palavrasChave = keywordsInput?.value.trim().toLowerCase();
  if (palavrasChave) {
    resultado = resultado.filter(pub => {
      const titulo = (pub.titulo || '').toLowerCase();
      const descricao = (pub.descricao || '').toLowerCase();
      return titulo.includes(palavrasChave) || descricao.includes(palavrasChave);
    });
  }
  
  // Ordenação
  const ordenacao = orderBySelect?.value || 'recente';
  
  if (ordenacao === 'recente') {
    resultado.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (ordenacao === 'antigo') {
    resultado.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (ordenacao === 'avaliacao') {
    resultado.sort((a, b) => {
      const avalA = a.usuario?.avaliacao?.media || a.user?.avaliacao?.media || 0;
      const avalB = b.usuario?.avaliacao?.media || b.user?.avaliacao?.media || 0;
      return avalB - avalA;
    });
  }
  
  return resultado;
}

// ========== RENDERIZAR PUBLICAÇÕES ==========
function renderizarPublicacoes(publicacoes) {
  const feedContainer = document.querySelector('.feed-list');
  
  if (!feedContainer) return;
  
  if (publicacoes.length === 0) {
    feedContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #999; font-style: italic;">Nenhuma publicação encontrada</p>';
    return;
  }
  
  feedContainer.innerHTML = '';
  
  publicacoes.forEach(pub => {
    const usuario = pub.usuario || pub.user;
    if (!usuario) return;
    
    const tipoConta = usuario.tipo_conta;
    const perfilData = tipoConta === 'prestador' ? usuario.prestador : usuario.empresa;
    
    if (!perfilData) return;
    
    const nome = tipoConta === 'prestador' ? perfilData.nome : perfilData.razao_social;
    const foto = construirUrlCompleta(perfilData.foto);
    const ramo = usuario.ramo?.nome || 'Sem categoria';
    const avaliacao = usuario.avaliacao?.media || 0;
    const badge = tipoConta === 'prestador' ? 'Profissional' : 'Empresa';
    const badgeClass = tipoConta === 'prestador' ? 'profissional' : 'empresa';
    
    const imagemUrl = pub.fotos && pub.fotos[0] ? construirUrlCompleta(pub.fotos[0].caminho) : '';
    
    const card = document.createElement('div');
    card.className = 'feed-card';
    card.setAttribute('data-portfolio-id', pub.id);
    
    card.innerHTML = `
      <div class="feed-card-header">
        <img src="${foto || '/assets/default-avatar.png'}" alt="${nome}" class="profile-pic">
        <div class="feed-card-user-info">
          <div class="user-info-top">
            <h3 class="profile-name">${nome}</h3>
            <span class="account-type ${badgeClass}">${badge}</span>
          </div>
          <p class="profile-sector">${ramo}</p>
          <div class="rating">
            ${gerarEstrelas(avaliacao)}
          </div>
        </div>
      </div>
      <div class="feed-card-body">
        <h4 class="feed-title">${pub.titulo || 'Sem título'}</h4>
        <div class="feed-card-image">
          <img src="${imagemUrl}" alt="${pub.titulo || 'Publicação'}">
        </div>
        <p class="feed-description">${pub.descricao || 'Sem descrição'}</p>
      </div>
    `;
    
    feedContainer.appendChild(card);
  });
  
  // Adicionar eventos de clique nos cards
  adicionarEventosCards();
}

// ========== GERAR ESTRELAS ==========
function gerarEstrelas(avaliacao) {
  const estrelasCheias = Math.floor(avaliacao);
  let html = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < estrelasCheias) {
      html += '<span class="star filled">★</span>';
    } else {
      html += '<span class="star">☆</span>';
    }
  }
  
  return html;
}

// ========== MODAL DE PUBLICAÇÃO ==========
window.addEventListener('load', function () {
  const modalHTML = `
    <div class="modal-overlay" id="modalPublicacao">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-user-info">
            <img class="modal-user-avatar" id="modalAvatar" alt="Avatar">
            <div class="modal-user-details">
              <h3 id="modalUserName"></h3>
              <p id="modalUserSector"></p>
              <div class="modal-rating" id="modalRating"></div>
            </div>
            <span class="modal-user-badge" id="modalBadge"></span>
          </div>
          <button class="modal-close" id="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <h3 id="modalTitle"></h3>
          <div class="modal-image" id="modalImage"></div>
          <p class="modal-description" id="modalDescription"></p>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('modalPublicacao');
  const closeModal = document.getElementById('closeModal');

  closeModal.addEventListener('click', fecharModal);
  
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      fecharModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      fecharModal();
    }
  });
  
  function fecharModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// ========== EVENTOS DE CLIQUE NOS CARDS ==========
function adicionarEventosCards() {
  const feedCards = document.querySelectorAll('.feed-card');
  
  feedCards.forEach(card => {
    card.addEventListener('click', async function () {
      const portfolioId = this.getAttribute('data-portfolio-id');
      await abrirModalPublicacao(portfolioId);
    });
  });
}

// ========== ABRIR MODAL COM DADOS DA API ==========
async function abrirModalPublicacao(portfolioId) {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/portfolio/${portfolioId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Erro ao carregar publicação');
    
    const data = await response.json();
    const pub = data.data || data.portfolio || data;
    
    const usuario = pub.usuario || pub.user;
    const tipoConta = usuario.tipo_conta;
    const perfilData = tipoConta === 'prestador' ? usuario.prestador : usuario.empresa;
    
    const nome = tipoConta === 'prestador' ? perfilData.nome : perfilData.razao_social;
    const foto = construirUrlCompleta(perfilData.foto);
    const ramo = usuario.ramo?.nome || 'Sem categoria';
    const avaliacao = usuario.avaliacao?.media || 0;
    const badge = tipoConta === 'prestador' ? 'Profissional' : 'Empresa';
    const badgeClass = tipoConta === 'prestador' ? 'badge-profissional' : 'badge-empresa';
    
    const imagemUrl = pub.fotos && pub.fotos[0] ? construirUrlCompleta(pub.fotos[0].caminho) : '';
    
    // Preencher modal
    document.getElementById('modalAvatar').src = foto || '/assets/default-avatar.png';
    document.getElementById('modalUserName').textContent = nome;
    document.getElementById('modalUserSector').textContent = ramo;
    document.getElementById('modalBadge').textContent = badge;
    document.getElementById('modalBadge').className = `modal-user-badge ${badgeClass}`;
    document.getElementById('modalTitle').textContent = pub.titulo || 'Sem título';
    document.getElementById('modalDescription').textContent = pub.descricao || 'Sem descrição';
    document.getElementById('modalImage').innerHTML = `<img src="${imagemUrl}" alt="${pub.titulo}">`;
    document.getElementById('modalRating').innerHTML = gerarEstrelas(avaliacao);
    
    // Abrir modal
    const modal = document.getElementById('modalPublicacao');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
  } catch (error) {
    console.error('Erro ao abrir modal:', error);
  }
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Feed inicializado');
  carregarPublicacoesFeed();
});