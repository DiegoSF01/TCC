// script.js - Prestadores
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
    
    console.log('🔵 Iniciando requisição para prestadores...');
    
    let url = `${API_URL}/usuarios`;
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    
    console.log('🔵 URL completa:', url);
    
    const response = await fetch(url, options);
    
    console.log('📊 Status da resposta:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText.substring(0, 500));
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Resposta não é JSON:', text.substring(0, 500));
      throw new Error('A API não retornou JSON válido');
    }
    
    const dados = await response.json();
    console.log('✅ Dados recebidos:', dados);
    
    // Filtra apenas prestadores
    let prestadores = Array.isArray(dados) ? dados : (dados.data || dados.users || []);
    prestadores = prestadores.filter(user => user.type === 'prestador');
    
    // Aplica filtros se existirem
    if (filtros.cidade) {
      prestadores = prestadores.filter(p => 
        p.prestador?.localidade?.toLowerCase().includes(filtros.cidade.toLowerCase())
      );
    }
    
    if (filtros.areaProfissional) {
      prestadores = prestadores.filter(p => 
        p.ramo?.nome?.toLowerCase().includes(filtros.areaProfissional.toLowerCase())
      );
    }
    
    if (filtros.avaliacaoMinima) {
      prestadores = prestadores.filter(p => 
        (p.avaliacao?.media || 0) >= parseFloat(filtros.avaliacaoMinima)
      );
    }
    
    console.log('✅ Quantidade de prestadores filtrados:', prestadores.length);
    
    if (prestadores.length === 0) {
      cardsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhum profissional encontrado.</p>';
      return;
    }
    
    // Limpa o container e renderiza cards
    cardsContainer.innerHTML = '';
    
    prestadores.forEach((prestador, index) => {
      console.log(`🔵 Renderizando card ${index + 1}:`, prestador);
      const card = criarCard(prestador);
      cardsContainer.appendChild(card);
    });
    
    console.log(`✅ ${prestadores.length} card(s) renderizado(s) com sucesso`);
    
  } catch (error) {
    console.error('❌ ERRO COMPLETO:', error);
    mostrarErro(error);
  }
}

// Função para criar um card de prestador
function criarCard(usuario) {
  const card = document.createElement('div');
  card.className = 'card';
  
  // Extrai dados
  const prestador = usuario.prestador || {};
  const nome = prestador.nome || 'Nome não informado';
  const cidade = prestador.localidade || 'Cidade';
  const uf = prestador.uf || 'UF';
  const email = usuario.email || 'Email não informado';
  const telefone = usuario.contato?.telefone || 'Não informado';
  const tipoProfissao = usuario.ramo?.nome || 'Profissão não informada';
  const avaliacao = usuario.avaliacao?.media || 0;
  const numAvaliacoes = usuario.avaliacao?.total || 0;
  const foto = prestador.foto || null;
  const usuarioId = usuario.id;
  
  card.innerHTML = `
    <div class="top-content-card">
      <div class="TCC-center">
        <div class="foto-perfil" style="${foto ? `background-image: url('${foto}'); background-size: cover; background-position: center;` : 'background-color: #e0e0e0;'}"></div>
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
      <button class="remover-favorito" onclick="toggleFavorito(${usuarioId})">
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
      <span class="quant-stars">${Number(avaliacao).toFixed(1)}</span>
      <span class="quant-avaliacoes">(${numAvaliacoes} avaliações)</span>
    </div>
    
    <div class="localizacao">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
           fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
           stroke-linejoin="round" class="lucide lucide-map-pin w-4 h-4">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span class="lc-cidade_estado">${cidade}, ${uf}</span>
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
      <span class="email-text">${email}</span>
    </div>
    
    <div class="line"></div>
    
    <button class="ver-perfil" onclick="verPerfil(${usuarioId})">Ver Perfil</button>
  `;
  
  return card;
}

// Função para mostrar erro
function mostrarErro(error) {
  const cardsContainer = document.querySelector('.home-cards');
  let mensagemErro = 'Erro ao carregar dados.';
  let detalhes = error.message;
  let sugestoes = [];
  
  if (error.message.includes('Failed to fetch')) {
    mensagemErro = 'Não foi possível conectar à API';
    detalhes = 'Verifique se o servidor está rodando';
    sugestoes = [
      '1. Certifique-se que o Laravel está rodando: php artisan serve',
      '2. Verifique se a porta 8000 está correta',
      '3. Verifique o CORS no Laravel'
    ];
  } else if (error.message.includes('404')) {
    mensagemErro = 'Rota não encontrada';
    detalhes = 'A rota /api/usuarios não existe';
    sugestoes = [
      '1. Verifique routes/api.php',
      '2. Execute: php artisan route:list',
      '3. Limpe o cache: php artisan route:clear'
    ];
  }
  
  cardsContainer.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px;">
      <h3 style="color: #856404; margin-top: 0;">⚠️ ${mensagemErro}</h3>
      <p style="color: #856404; margin: 10px 0;"><strong>Detalhes:</strong> ${detalhes}</p>
      
      ${sugestoes.length > 0 ? `
        <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 4px;">
          <strong style="color: #856404;">Sugestões:</strong>
          <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
            ${sugestoes.map(s => `<li style="margin: 5px 0;">${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      <button onclick="carregarPrestadores()" style="margin-top: 15px; padding: 10px 20px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px;">
        🔄 Tentar Novamente
      </button>
    </div>
  `;
}

// ========== FUNÇÕES DE NAVEGAÇÃO ==========

function verPerfil(prestadorId) {
  console.log('Redirecionando para perfil:', prestadorId);
  localStorage.setItem('usuarioId', prestadorId);
  localStorage.setItem('usuarioTipo', 'prestador');
  window.location.href = '../Perfil/TE/index.html';
}

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

function configurarFiltros() {
  const buscaBtns = document.querySelectorAll('.icon-btn');
  buscaBtns.forEach(btn => {
    btn.addEventListener('click', aplicarFiltros);
  });
  
  document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        aplicarFiltros();
      }
    });
  });
  
  const btnLimpar = document.querySelector('.clear-filters-btn');
  if (btnLimpar) {
    btnLimpar.addEventListener('click', limparFiltros);
  }
}

function aplicarFiltros() {
  const cidadeInput = document.querySelector('.filter-input[placeholder*="São Paulo"]');
  const areaProfissionalInput = document.querySelector('.filter-input[placeholder*="Pedreiro"]');
  
  const cidade = cidadeInput ? cidadeInput.value.trim() : '';
  const areaProfissional = areaProfissionalInput ? areaProfissionalInput.value.trim() : '';
  
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

function limparFiltros() {
  document.querySelectorAll('.filter-input').forEach(input => input.value = '');
  document.querySelectorAll('.rating-btn').forEach((btn, idx) => {
    btn.classList.remove('active');
    if (idx === 0) btn.classList.add('active');
  });
  
  carregarPrestadores();
}

// ========== RATING BUTTONS ==========
const ratingBtns = document.querySelectorAll('.rating-btn');
ratingBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    ratingBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    aplicarFiltros();
  });
});

// ========== FUNÇÃO DE TOAST ==========
function showToast(message, type = 'info') {
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
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Página de Prestadores carregada');
  console.log('🔵 URL da API:', API_URL);
  
  carregarPrestadores();
  configurarFiltros();
});

// Torna as funções disponíveis globalmente
window.verPerfil = verPerfil;
window.toggleFavorito = toggleFavorito;
window.carregarPrestadores = carregarPrestadores;