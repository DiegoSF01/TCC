// script.js - Empresas 2(CORRIGIDO)
const API_URL = 'http://127.0.0.1:8000/api';

async function carregarEmpresas(filtros = {}) {
  try {
    const cardsContainer = document.querySelector('.home-cards');
    cardsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Carregando...</p>';
    
    console.log('🔵 Iniciando requisição para empresas...');
    
    let url = `${API_URL}/usuarios`;
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    
    const dados = await response.json();
    console.log('✅ Dados recebidos:', dados);
    
    // Filtra apenas empresas
    let empresas = Array.isArray(dados) ? dados : (dados.data || dados.users || []);
    empresas = empresas.filter(user => user.type === 'empresa');
    
    // Aplica filtros
    if (filtros.cidade) {
      empresas = empresas.filter(e => 
        e.empresa?.localidade?.toLowerCase().includes(filtros.cidade.toLowerCase())
      );
    }
    
    if (filtros.categoria) {
      empresas = empresas.filter(e => 
        e.categoria?.nome?.toLowerCase().includes(filtros.categoria.toLowerCase())
      );
    }
    
    if (filtros.avaliacaoMinima) {
      empresas = empresas.filter(e => 
        (e.avaliacao?.media || 0) >= parseFloat(filtros.avaliacaoMinima)
      );
    }
    
    console.log('✅ Quantidade de empresas filtradas:', empresas.length);
    
    if (empresas.length === 0) {
      cardsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhuma empresa encontrada.</p>';
      return;
    }
    
    cardsContainer.innerHTML = '';
    
    empresas.forEach((empresa, index) => {
      console.log(`🔵 Renderizando card ${index + 1}:`, empresa);
      const card = criarCardEmpresa(empresa);
      cardsContainer.appendChild(card);
    });
    
    console.log(`✅ ${empresas.length} card(s) renderizado(s)`);
    
  } catch (error) {
    console.error('❌ ERRO:', error);
    mostrarErro(error);
  }
}

function criarCardEmpresa(usuario) {
  const card = document.createElement('div');
  card.className = 'card';
  
  const empresa = usuario.empresa || {};
  const razaoSocial = empresa.razao_social || 'Empresa não informada';
  const cidade = empresa.localidade || 'Cidade';
  const uf = empresa.uf || 'UF';
  const email = usuario.email || 'Email não informado';
  const telefone = usuario.contato?.telefone || 'Não informado';
  const categoria = usuario.categoria?.nome || 'Categoria não informada';
  const avaliacao = usuario.avaliacao?.media || 0;
  const numAvaliacoes = usuario.avaliacao?.total || 0;
  const usuarioId = usuario.id;
  
  // 🔥 CORREÇÃO: A API já retorna URL completa, NÃO adicione prefixo
  const foto = empresa.foto || null;
  
  console.log('🖼️ URL da foto empresa:', foto);
  
  // Verifica se está nos favoritos
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  const isFavorito = favoritos.includes(usuarioId);
  
  card.innerHTML = `
    <div class="top-content-card">
      <div class="TCC-center">
        <div class="foto-perfil" style="${foto ? `background-image: url('${foto}'); background-size: cover; background-position: center;` : 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);'}"></div>
        <div class="nome-area">
          <h3 class="nome-card">${razaoSocial}</h3>
          <p class="area-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                 fill="none" stroke="#6d6c7f" stroke-width="2" stroke-linecap="round" 
                 stroke-linejoin="round" class="lucide lucide-building w-4 h-4">
              <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
              <path d="M9 22v-4h6v4"></path>
              <path d="M8 6h.01"></path>
              <path d="M16 6h.01"></path>
              <path d="M12 6h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 10h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 10h.01"></path>
              <path d="M8 14h.01"></path>
            </svg>
            ${categoria}
          </p>
        </div>
      </div>
      <button class="remover-favorito" onclick="toggleFavorito(${usuarioId})" data-favorito="${isFavorito}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
             fill="${isFavorito ? '#ef4343' : 'none'}" stroke="#ef4343" stroke-width="2" stroke-linecap="round" 
             stroke-linejoin="round" class="lucide lucide-heart w-5 h-5">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>
      </button>
    </div>
    
    <p class="empresa-ou-profissional">Empresa</p>
    
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
    
    <button class="ver-perfil" onclick="verPerfil(${usuarioId}, 'empresa')">Ver Perfil</button>
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

function mostrarErro(error) {
  const cardsContainer = document.querySelector('.home-cards');
  cardsContainer.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px;">
      <h3 style="color: #856404; margin-top: 0;">⚠️ Erro ao carregar empresas</h3>
      <p style="color: #856404;">${error.message}</p>
      <button onclick="carregarEmpresas()" style="margin-top: 15px; padding: 10px 20px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px;">
        🔄 Tentar Novamente
      </button>
    </div>
  `;
}

// 🔥 CORREÇÃO: Não sobrescrever userId do usuário logado
async function verPerfil(empresaId, tipo) {
  console.log('🔵 Abrindo perfil:', empresaId, tipo);
  
  try {
    // Buscar dados completos do usuário
    const response = await fetch(`${API_URL}/usuarios/${empresaId}`);
    if (!response.ok) throw new Error('Erro ao buscar dados');
    
    const data = await response.json();
    const usuario = data.user || data;
    
    // Salvar dados completos no localStorage
    localStorage.setItem('perfilVisitado', JSON.stringify(usuario));
    
    console.log('✅ Dados salvos, redirecionando...');
    
    // Redirecionar para página de perfil
    window.location.href = '../Perfil/Acessando/TE/index.html';
    
  } catch (error) {
    console.error('❌ Erro ao carregar perfil:', error);
    showToast('Erro ao carregar perfil', 'error');
  }
}

function toggleFavorito(empresaId) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  const index = favoritos.indexOf(empresaId);
  
  const btn = document.querySelector(`button[onclick="toggleFavorito(${empresaId})"]`);
  const svg = btn?.querySelector('svg');
  
  if (index > -1) {
    favoritos.splice(index, 1);
    if (svg) svg.setAttribute('fill', 'none');
    showToast('Removido dos favoritos', 'success');
  } else {
    favoritos.push(empresaId);
    if (svg) svg.setAttribute('fill', '#ef4343');
    showToast('Adicionado aos favoritos', 'success');
  }
  
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

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
  const cidadeInput = document.querySelector('.filter-input[placeholder*="cidade"]');
  const categoriaInput = document.querySelector('.filter-input[placeholder*="categoria"]');
  
  const filtros = {};
  if (cidadeInput?.value.trim()) filtros.cidade = cidadeInput.value.trim();
  if (categoriaInput?.value.trim()) filtros.categoria = categoriaInput.value.trim();
  
  const avaliacaoBtn = document.querySelector('.rating-btn.active');
  if (avaliacaoBtn && avaliacaoBtn.textContent.trim() !== 'Todas') {
    filtros.avaliacaoMinima = parseFloat(avaliacaoBtn.textContent.trim());
  }
  
  carregarEmpresas(filtros);
}

function limparFiltros() {
  document.querySelectorAll('.filter-input').forEach(input => input.value = '');
  document.querySelectorAll('.rating-btn').forEach((btn, idx) => {
    btn.classList.remove('active');
    if (idx === 0) btn.classList.add('active');
  });
  
  carregarEmpresas();
}

const ratingBtns = document.querySelectorAll('.rating-btn');
ratingBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    ratingBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    aplicarFiltros();
  });
});

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

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Página de Empresas carregada');
  carregarEmpresas();
  configurarFiltros();
});

window.verPerfil = verPerfil;
window.toggleFavorito = toggleFavorito;
window.carregarEmpresas = carregarEmpresas;