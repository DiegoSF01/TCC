// ==========================================
// SCRIPT FEED CORRIGIDO — FUNCIONAL COM FOTOS
// ==========================================

const API_URL = 'http://127.0.0.1:8000/api';
const BASE_URL = 'http://127.0.0.1:8000';

// IMAGENS PADRÃO
const DEFAULT_AVATAR = "https://www.svgrepo.com/show/452030/user.svg";
const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/600x400?text=Sem+Imagem";

// ======== UTILITÁRIOS ========
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

function showToast(m, t = 'info') {
  console.log(`[${t.toUpperCase()}] ${m}`);
}

// ELEMENTOS
const fotosCheckbox = document.getElementById('fotos');
const videosCheckbox = document.getElementById('videos');
const profissionalCheckbox = document.getElementById('profissional');
const empresaCheckbox = document.getElementById('empresa');
const profissaoInput = document.getElementById('profissaoInput');
const keywordsInput = document.getElementById('keywordsInput');
const orderBySelect = document.getElementById('orderBy');
const clearFiltersBtn = document.getElementById('clearFilters');
const buscadorInput = document.getElementById('buscador');

let todasPublicacoes = [];

// BUSCA EM TEMPO REAL
if (buscadorInput) {
  buscadorInput.addEventListener('input', e => {
    const termo = e.target.value.toLowerCase().trim();
    if (!termo) return renderizarPublicacoes(todasPublicacoes);

    const r = todasPublicacoes.filter(pub =>
      (pub.user_nome || '').toLowerCase().includes(termo) ||
      (pub.user_ramo || '').toLowerCase().includes(termo) ||
      (pub.titulo || '').toLowerCase().includes(termo) ||
      (pub.descricao || '').toLowerCase().includes(termo)
    );

    renderizarPublicacoes(r);
  });
}

// LIMPAR FILTROS
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

// EVENTOS FILTRO
[fotosCheckbox, videosCheckbox, profissionalCheckbox, empresaCheckbox,
  profissaoInput, keywordsInput, orderBySelect].forEach(el => {
    if (el) {
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', carregarPublicacoesFeed);
    }
  });

// ========== CARREGAR FEED ==========
async function carregarPublicacoesFeed() {
  console.log("🔵 Carregando publicações...");

  try {
    const token = getAuthToken();
    if (!token) return showToast("Você precisa estar logado", "error");

    const response = await fetch(`${API_URL}/portfolio`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
    });

    console.log("📡 Status da resposta:", response.status);

    if (!response.ok) throw new Error("Erro ao carregar publicações");

    let data = await response.json();
    let publicacoes = data.data || data.portfolios || data;

    todasPublicacoes = Array.isArray(publicacoes) ? publicacoes : [];

    console.log("📊 Total de publicações:", todasPublicacoes.length);
    
    // ✅ LOG DETALHADO para debug
    if (todasPublicacoes.length > 0) {
      console.log("📸 Primeira publicação (exemplo):", {
        id: todasPublicacoes[0].id,
        titulo: todasPublicacoes[0].titulo,
        fotos: todasPublicacoes[0].fotos,
        primeiraFoto: todasPublicacoes[0].fotos?.[0]
      });
    }

    const filtradas = aplicarFiltros([...todasPublicacoes]);

    console.log("📊 Publicações após filtros:", filtradas.length);

    renderizarPublicacoes(filtradas);

  } catch (e) {
    console.error('❌ Erro ao carregar feed:', e);
    showToast("Erro ao carregar publicações", "error");
  }
}

// ========== APLICAR FILTROS ==========
function aplicarFiltros(lista) {
  let r = [...lista];

  const mostrarFotos = fotosCheckbox.checked;
  const mostrarVideos = videosCheckbox.checked;

  // ✅ FILTRO CORRIGIDO - Aceita posts COM ou SEM fotos quando "Fotos" está marcado
  r = r.filter(pub => {
    const arquivos = pub.fotos || [];
    const videos = pub.videos || [];

    const temFoto = arquivos.length > 0;
    const temVideo = videos.length > 0;

    // Se ambos estão desmarcados, não mostra nada
    if (!mostrarFotos && !mostrarVideos) return false;

    // Se só fotos está marcado
    if (mostrarFotos && !mostrarVideos) {
      return true; // ✅ Mostra TODOS (com ou sem foto - placeholder aparece)
    }

    // Se só vídeos está marcado
    if (!mostrarFotos && mostrarVideos) {
      return temVideo;
    }

    // Se ambos estão marcados
    return true;
  });

  // Tipo conta
  r = r.filter(pub => {
    const tipo = pub.user?.tipo_conta || pub.user?.type;
    if (profissionalCheckbox.checked && tipo === "prestador") return true;
    if (empresaCheckbox.checked && tipo === "empresa") return true;
    return false;
  });

  // Profissão
  const profissao = profissaoInput.value.toLowerCase().trim();
  if (profissao) {
    r = r.filter(pub =>
      (pub.user_ramo || '').toLowerCase().includes(profissao)
    );
  }

  // Palavras-chave
  const keys = keywordsInput.value.toLowerCase().trim();
  if (keys) {
    r = r.filter(pub =>
      (pub.titulo || '').toLowerCase().includes(keys) ||
      (pub.descricao || '').toLowerCase().includes(keys)
    );
  }

  // Ordenação
  const ord = orderBySelect.value;
  if (ord === 'recent') r.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  else if (ord === 'oldest') r.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  else if (ord === 'rating') r.sort((a, b) => (b.user?.avaliacao?.media || 0) - (a.user?.avaliacao?.media || 0));

  return r;
}

// ========== RENDERIZAR ==========
function renderizarPublicacoes(lista) {
  const feed = document.querySelector('.feed-grid');
  if (!feed) return;

  if (lista.length === 0) {
    feed.innerHTML = `<p style="padding:40px;text-align:center;color:#777">Nenhuma publicação encontrada</p>`;
    return;
  }

  feed.innerHTML = '';

  lista.forEach(pub => {
    const nome = pub.user_nome || "Usuário";
    const fotoPerfil = pub.user_foto || DEFAULT_AVATAR;

    // ✅ CORREÇÃO: A API já retorna URL completa no campo 'caminho'
    let imagem = DEFAULT_PLACEHOLDER;

    if (pub.fotos && pub.fotos.length > 0 && pub.fotos[0].caminho) {
      imagem = pub.fotos[0].caminho; // ✅ Já vem URL completa do backend
    }

    console.log('🖼️ Renderizando card:', {
      id: pub.id,
      titulo: pub.titulo,
      temFotos: pub.fotos?.length || 0,
      imagemURL: imagem
    });

    const card = document.createElement('div');
    card.classList.add('feed-card');
    card.setAttribute('data-portfolio-id', pub.id);

    card.innerHTML = `
      <div class="feed-card-header">
        <img src="${fotoPerfil}" class="profile-pic" alt="avatar"
             onerror="this.src='${DEFAULT_AVATAR}'">
        <div class="profile-info">
          <h3>${nome}</h3>
          <p>${pub.user_ramo || "Sem categoria"}</p>
        </div>
      </div>

      <div class="feed-card-image">
        <img src="${imagem}" alt="imagem"
             onerror="this.src='${DEFAULT_PLACEHOLDER}'; console.error('❌ Erro ao carregar:', this.src);">
      </div>

      <div class="feed-card-content">
        <h2>${pub.titulo || "Sem título"}</h2>
        <p>${pub.descricao || "Sem descrição"}</p>
      </div>
    `;

    card.addEventListener("click", () => abrirModalPublicacao(pub.id));
    feed.appendChild(card);
  });
}

// ========== MODAL ==========
async function abrirModalPublicacao(id) {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/portfolio/${id}`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
    });

    if (!response.ok) throw new Error('Erro ao carregar publicação');

    const data = await response.json();
    const pub = data.data || data;

    console.log('📖 Dados da publicação no modal:', pub);

    document.getElementById('modalTitle').textContent = pub.titulo || "Sem título";
    document.getElementById('modalDescription').textContent = pub.descricao || "Sem descrição";

    // ✅ A API já retorna URL completa
    let img = DEFAULT_PLACEHOLDER;
    if (pub.fotos && pub.fotos.length > 0 && pub.fotos[0].caminho) {
      img = pub.fotos[0].caminho;
    }

    document.getElementById('modalImage').innerHTML =
      `<img src="${img}" alt="Imagem da publicação" onerror="this.src='${DEFAULT_PLACEHOLDER}'">`;

    document.getElementById('modalPublicacao').classList.add('active');
    document.body.style.overflow = "hidden";

  } catch (e) {
    console.error('❌ Erro ao abrir modal:', e);
    showToast("Erro ao abrir publicação", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => carregarPublicacoesFeed());