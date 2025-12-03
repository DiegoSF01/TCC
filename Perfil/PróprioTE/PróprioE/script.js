// ==========================================
// SCRIPT PERFIL PRÓPRIO - EMPRESA (VERSÃO CORRIGIDA COMPLETA)
// ==========================================

const API_URL = 'http://127.0.0.1:8000/api';
const BASE_URL = 'http://127.0.0.1:8000';

// ========== UTILITÁRIOS ==========
function showToast(message, type = 'success') {
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
      border-radius: 8px;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.style.opacity = '1';
  
  if (type === 'success') toast.style.background = '#28a745';
  else if (type === 'error') toast.style.background = '#dc3545';
  else toast.style.background = '#007bff';
  
  setTimeout(() => toast.style.opacity = '0', 3000);
}

function getAuthToken() {
  return localStorage.getItem('auth_token');
}

function getUserId() {
  return localStorage.getItem('userId');
}

function getUserType() {
  return localStorage.getItem('userType');
}

function construirUrlCompleta(caminho) {
  if (!caminho || caminho === 'null') return null;
  if (caminho.startsWith('http')) return caminho;
  
  const caminhoLimpo = caminho.replace(/^public\//, '');
  return `${BASE_URL}/storage/${caminhoLimpo}`;
}

// ========== DEBUG: CARREGAR MEU PERFIL ==========
async function carregarMeuPerfil() {
  try {
    const userId = getUserId();
    const userType = getUserType();
    const token = getAuthToken();
    
    console.log('🔍 DEBUG - Iniciando carregamento:', { userId, userType, token: token ? 'presente' : 'ausente' });
    
    if (!userId || !token) {
      console.error('❌ Usuário não autenticado');
      showToast('Você precisa estar logado', 'error');
      setTimeout(() => window.location.href = '/Login/index.html', 2000);
      return;
    }
    
    if (userType !== 'empresa') {
      console.error('❌ Tipo de usuário incorreto:', userType);
      showToast('Acesso negado', 'error');
      setTimeout(() => window.location.href = '/Login/index.html', 2000);
      return;
    }
    
    console.log('📡 Fazendo requisição para:', `${API_URL}/usuarios/${userId}`);
    
    const response = await fetch(`${API_URL}/usuarios/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    console.log('📥 Status da resposta:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      throw new Error('Erro ao carregar perfil');
    }
    
    const data = await response.json();
    console.log('✅ Dados brutos recebidos:', JSON.stringify(data, null, 2));
    
    const usuario = data.user || data.data || data;
    console.log('📦 Objeto usuario extraído:', usuario);
    
    // DEBUG: Verificar estrutura
    console.log('🔍 Verificando empresa:', usuario.empresa);
    console.log('🔍 Verificando categoria:', usuario.empresa?.categoria);
    console.log('🔍 Verificando contato:', usuario.contato);
    console.log('🔍 Verificando avaliacao:', usuario.avaliacao);
    
    preencherPerfil(usuario);
    
  } catch (error) {
    console.error('❌ Erro completo:', error);
    console.error('Stack trace:', error.stack);
    showToast('Erro ao carregar perfil', 'error');
  }
}

// ========== PREENCHER PERFIL (CORRIGIDO COM FALLBACKS) ==========
function preencherPerfil(usuario) {
  console.log('🎨 Iniciando preenchimento do perfil');
  console.log('📦 Dados recebidos:', usuario);
  
  if (!usuario.empresa) {
    console.error('❌ ERRO: dados da empresa não encontrados');
    showToast('Erro: dados da empresa não encontrados', 'error');
    return;
  }
  
  const empresa = usuario.empresa;
  const contato = usuario.contato || {};
  
  console.log('🏢 Dados da empresa:', empresa);
  console.log('📞 Dados de contato:', contato);
  
  // ===== NOME E CATEGORIA =====
  const nomePerfil = document.querySelector('.nome-perfil');
  if (nomePerfil) {
    nomePerfil.textContent = empresa.razao_social || 'Empresa não informada';
    console.log('✅ Nome preenchido:', nomePerfil.textContent);
  }
  
  // CORRIGIDO: buscar categoria de múltiplas fontes
  const profissao = document.querySelector('.profissao');
  if (profissao) {
    const categoria = empresa.categoria?.nome || 
                     usuario.categoria?.nome || 
                     empresa.ramo?.nome ||
                     usuario.ramo?.nome ||
                     'Categoria não informada';
    profissao.textContent = categoria;
    console.log('✅ Categoria preenchida:', categoria);
  }
  
  // ===== LOCALIZAÇÃO =====
  const lcCidade = document.querySelector('.lc-cidade');
  if (lcCidade) {
    lcCidade.textContent = empresa.localidade || 'Cidade não informada';
    console.log('✅ Cidade:', lcCidade.textContent);
  }
  
  const lcEstado = document.querySelector('.lc-estado');
  if (lcEstado) {
    lcEstado.textContent = empresa.uf || 'UF';
    console.log('✅ Estado:', lcEstado.textContent);
  }
  
  // ===== FOTO DE PERFIL (CORRIGIDO) =====
  const fotoPerfil = document.querySelector('.foto-perfil');
  if (fotoPerfil) {
    if (empresa.foto && empresa.foto !== 'null') {
      const fotoUrl = construirUrlCompleta(empresa.foto);
      console.log('🖼️ URL da foto:', fotoUrl);
      fotoPerfil.style.backgroundImage = `url('${fotoUrl}')`;
      fotoPerfil.style.backgroundSize = 'cover';
      fotoPerfil.style.backgroundPosition = 'center';
      fotoPerfil.innerHTML = '';
    } else {
      console.log('ℹ️ Sem foto, usando inicial');
      fotoPerfil.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      fotoPerfil.innerHTML = `<span style="color: white; font-size: 48px; font-weight: bold;">${empresa.razao_social.charAt(0).toUpperCase()}</span>`;
      fotoPerfil.style.display = 'flex';
      fotoPerfil.style.alignItems = 'center';
      fotoPerfil.style.justifyContent = 'center';
    }
  }
  
  // ===== CAPA (CORRIGIDO) =====
  const imgFundo = document.querySelector('.img-fundo');
  if (imgFundo) {
    if (empresa.capa && empresa.capa !== 'null') {
      const capaUrl = construirUrlCompleta(empresa.capa);
      console.log('🎨 URL da capa:', capaUrl);
      imgFundo.style.backgroundImage = `url('${capaUrl}')`;
      imgFundo.style.backgroundSize = 'cover';
      imgFundo.style.backgroundPosition = 'center';
    } else {
      console.log('ℹ️ Sem capa, usando gradiente');
      imgFundo.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }
  
  // ===== PROJETOS CONCLUÍDOS (CORRIGIDO - SEMPRE VISÍVEL) =====
  const projetosConcluidos = document.querySelector('.projetos_concluidos');
  if (projetosConcluidos) {
    const textElement = projetosConcluidos.querySelector('.projetos_concluidos-text');
    projetosConcluidos.style.display = 'flex';
    
    if (empresa.projetos_concluidos !== null && empresa.projetos_concluidos !== undefined) {
      if (textElement) textElement.textContent = empresa.projetos_concluidos;
      console.log('✅ Projetos concluídos:', empresa.projetos_concluidos);
    } else {
      if (textElement) textElement.textContent = 'Não editado';
      textElement.style.color = '#999';
      textElement.style.fontStyle = 'italic';
      console.log('ℹ️ Projetos concluídos: não editado');
    }
  }
  
  // ===== IDADE DA EMPRESA (CORRIGIDO - SEMPRE VISÍVEL) =====
  const idadeEmpresa = document.querySelector('.idade_empresa');
  if (idadeEmpresa) {
    const textElement = idadeEmpresa.querySelector('.idade_empresa-text');
    idadeEmpresa.style.display = 'flex';
    
    if (empresa.tempo_experiencia !== null && empresa.tempo_experiencia !== undefined) {
      const anos = empresa.tempo_experiencia;
      if (textElement) textElement.textContent = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
      console.log('✅ Idade da empresa:', anos);
    } else {
      if (textElement) textElement.textContent = 'Não editado';
      textElement.style.color = '#999';
      textElement.style.fontStyle = 'italic';
      console.log('ℹ️ Idade da empresa: não editado');
    }
  }
  
  // ===== AVALIAÇÃO (CORRIGIDO) =====
  const avaliacaoObj = usuario.avaliacao || {};
  const avaliacao = avaliacaoObj.media || 0;
  const numAvaliacoes = avaliacaoObj.total || 0;
  
  console.log('⭐ Avaliação:', { media: avaliacao, total: numAvaliacoes });
  
  // Atualizar todos os elementos de avaliação
  document.querySelectorAll('.quant-stars').forEach(el => {
    el.textContent = avaliacao.toFixed(1);
  });
  
  document.querySelectorAll('.quant-avaliacoes').forEach(el => {
    el.textContent = numAvaliacoes;
  });
  
  document.querySelectorAll('.quant_avaliacoes-text').forEach(el => {
    el.textContent = numAvaliacoes === 1 ? 'avaliação' : 'avaliações';
  });
  
  const avaliacaoBCC = document.querySelector('.avaliacao-BCC-text');
  if (avaliacaoBCC) {
    avaliacaoBCC.textContent = `${avaliacao.toFixed(1)}/5.0`;
  }
  
  // Preencher estrelas
  const estrelas = document.querySelectorAll('.avaliacao-TCC .star, .avaliacao-BCC .star, .top-sess_avali .star');
  estrelas.forEach((star, index) => {
    if (index < Math.floor(avaliacao)) {
      star.style.fill = 'currentColor';
    } else {
      star.style.fill = 'none';
    }
  });
  
  // ===== CONTATOS =====
  // Telefone
  document.querySelectorAll('.tl-numero, .telefone-numero').forEach(el => {
    if (contato.telefone) {
      el.textContent = contato.telefone;
      el.closest('.telefone, .button-telefone')?.style.setProperty('display', 'flex', 'important');
      console.log('✅ Telefone:', contato.telefone);
    } else {
      el.closest('.telefone, .button-telefone')?.style.setProperty('display', 'none', 'important');
    }
  });
  
  // Email
  document.querySelectorAll('.email-text').forEach(el => {
    el.textContent = usuario.email || 'Email não informado';
  });
  
  // Instagram
  const instagram = document.querySelector('.instagram');
  if (instagram) {
    const nomeIns = instagram.querySelector('.name_perfil-x');
    if (contato.instagram) {
      instagram.style.display = 'flex';
      if (nomeIns) nomeIns.textContent = contato.instagram;
      console.log('✅ Instagram:', contato.instagram);
    } else {
      instagram.style.display = 'none';
    }
  }
  
  // ===== SOBRE A EMPRESA =====
  const sobreEmpresa = document.querySelector('.sobre_profissional');
  if (sobreEmpresa) {
    const paragrafo = sobreEmpresa.querySelector('p');
    const titulo = sobreEmpresa.querySelector('h3');
    
    if (titulo) titulo.textContent = 'Sobre a Empresa';
    
    sobreEmpresa.style.display = 'block';
    if (paragrafo) {
      if (empresa.descricao) {
        paragrafo.textContent = empresa.descricao;
        paragrafo.style.color = '';
        paragrafo.style.fontStyle = '';
        console.log('✅ Descrição presente');
      } else {
        paragrafo.textContent = 'Você ainda não adicionou uma descrição. Clique em "Editar Perfil" para adicionar.';
        paragrafo.style.color = '#999';
        paragrafo.style.fontStyle = 'italic';
        console.log('ℹ️ Sem descrição');
      }
    }
  }
  
  // ===== ESPECIALIDADES =====
  const especialidadesContainer = document.querySelector('.especialidades');
  if (especialidadesContainer) {
    if (empresa.skills && empresa.skills.length > 0) {
      especialidadesContainer.style.display = 'block';
      especialidadesContainer.innerHTML = '<h3>Especialidades</h3>';
      
      empresa.skills.forEach(skill => {
        const spanDiv = document.createElement('div');
        spanDiv.className = 'span-esp_op';
        spanDiv.innerHTML = `<span class="especialidade-op">${skill.nome || skill.name || skill}</span>`;
        especialidadesContainer.appendChild(spanDiv);
      });
      console.log('✅ Especialidades:', empresa.skills.length);
    } else {
      especialidadesContainer.style.display = 'none';
      console.log('ℹ️ Sem especialidades');
    }
  }
  
  // ===== PUBLICAÇÕES =====
  if (usuario.portfolios && usuario.portfolios.length > 0) {
    console.log('📸 Carregando', usuario.portfolios.length, 'publicações');
    carregarPublicacoes(usuario.portfolios);
  } else {
    console.log('ℹ️ Sem publicações');
    const publicacoesContainer = document.querySelector('.home-cards-post');
    if (publicacoesContainer) {
      publicacoesContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #999; font-style: italic;">Você ainda não possui publicações. Clique em "Nova publicação" para adicionar.</p>';
    }
  }
  
  console.log('✅ Perfil preenchido com sucesso');
}

// ========== CARREGAR PUBLICAÇÕES ==========
function carregarPublicacoes(portfolios) {
  const publicacoesContainer = document.querySelector('.home-cards-post');
  if (!publicacoesContainer) return;
  
  publicacoesContainer.innerHTML = '';
  
  portfolios.forEach(portfolio => {
    const card = document.createElement('div');
    card.className = 'card-publicacoes';
    
    let imagemUrl = '';
    if (portfolio.fotos && portfolio.fotos.length > 0 && portfolio.fotos[0].caminho) {
      imagemUrl = construirUrlCompleta(portfolio.fotos[0].caminho);
    }
    
    card.innerHTML = `
      <div class="img-card_publicacoes" style="background-image: url('${imagemUrl}'); background-size: cover; background-position: center;"></div>
      <div class="mini-informacoes-card_publicacoes">
        <h4>${portfolio.titulo || 'Sem título'}</h4>
        <p>${portfolio.descricao || 'Sem descrição'}</p>
      </div>
    `;
    
    publicacoesContainer.appendChild(card);
  });
}

// ========== MODAL ADICIONAR PUBLICAÇÃO ==========
const btnAddPost = document.querySelector('.btn-add-post');
const modalAddPost = document.getElementById('modalAddPub');
const btnFecharAddPub = document.getElementById('fecharAddPub');
const btnCancelarAddPub = document.getElementById('cancelarAddPub');
const btnConfirmarAddPub = document.getElementById('confirmarAddPub');
const inputMidias = document.getElementById('pubMidias');
const previewContainer = document.getElementById('previewContainer');

let selectedFiles = [];

if (btnAddPost && modalAddPost) {
  btnAddPost.addEventListener('click', () => {
    modalAddPost.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

function fecharModalPublicacao() {
  modalAddPost.classList.remove('active');
  document.body.style.overflow = 'auto';
  limparFormularioPublicacao();
}

if (btnFecharAddPub) btnFecharAddPub.addEventListener('click', fecharModalPublicacao);
if (btnCancelarAddPub) btnCancelarAddPub.addEventListener('click', fecharModalPublicacao);

function limparFormularioPublicacao() {
  const titulo = document.getElementById('pubTitulo');
  const descricao = document.getElementById('pubDescricao');
  
  if (titulo) titulo.value = '';
  if (descricao) descricao.value = '';
  if (inputMidias) inputMidias.value = '';
  if (previewContainer) previewContainer.innerHTML = '';
  
  selectedFiles = [];
}

// ========== PREVIEW DE ARQUIVOS ==========
if (inputMidias && previewContainer) {
  inputMidias.addEventListener('change', (e) => {
    const newFiles = Array.from(e.target.files);
    selectedFiles = [...selectedFiles, ...newFiles];
    atualizarPreview();
  });
}

function atualizarPreview() {
  previewContainer.innerHTML = '';
  
  if (selectedFiles.length === 0) return;
  
  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const preview = document.createElement('div');
      preview.className = 'preview-item';
      preview.style.cssText = 'position: relative; width: 150px; height: 150px; border-radius: 8px; overflow: hidden; margin: 5px;';
      
      if (file.type.startsWith('image/')) {
        preview.innerHTML = `
          <img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
          <button class="remove-btn" data-index="${index}" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
        `;
      } else if (file.type.startsWith('video/')) {
        preview.innerHTML = `
          <video src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;"></video>
          <button class="remove-btn" data-index="${index}" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
        `;
      }
      
      previewContainer.appendChild(preview);
      
      const removeBtn = preview.querySelector('.remove-btn');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removerArquivo(index);
      });
    };
    
    reader.readAsDataURL(file);
  });
}

function removerArquivo(index) {
  selectedFiles.splice(index, 1);
  atualizarPreview();
}

// ========== CONFIRMAR PUBLICAÇÃO (DEBUG COMPLETO) ==========
if (btnConfirmarAddPub) {
  btnConfirmarAddPub.addEventListener('click', async () => {
    try {
      const titulo = document.getElementById('pubTitulo')?.value.trim();
      const descricao = document.getElementById('pubDescricao')?.value.trim();
      
      console.log('📤 DEBUG - Dados da publicação:', { titulo, descricao, arquivos: selectedFiles.length });
      
      // Validações
      if (!titulo) {
        showToast('Digite um título para a publicação', 'error');
        return;
      }
      
      if (!descricao) {
        showToast('Digite uma descrição para a publicação', 'error');
        return;
      }
      
      if (selectedFiles.length === 0) {
        showToast('Adicione pelo menos uma imagem ou vídeo', 'error');
        return;
      }
      
      // Criar FormData
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('descricao', descricao);
      
      // Adicionar arquivos
      selectedFiles.forEach((file) => {
        if (file.type.startsWith('image/')) {
          formData.append('imagens[]', file);
          console.log('🖼️ Adicionando imagem:', file.name);
        } else if (file.type.startsWith('video/')) {
          formData.append('videos[]', file);
          console.log('🎥 Adicionando vídeo:', file.name);
        }
      });
      
      // Debug: ver conteúdo do FormData
      console.log('📦 Conteúdo do FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }
      
      const token = getAuthToken();
      const url = `${API_URL}/portfolio/cadastro`;
      
      console.log('🌐 URL da requisição:', url);
      console.log('🔑 Token presente:', !!token);
      
      showToast('Criando publicação...', 'info');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });
      
      console.log('📡 Status da resposta:', response.status);
      console.log('📡 Headers da resposta:', [...response.headers.entries()]);
      
      const responseText = await response.text();
      console.log('📥 Resposta bruta:', responseText);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText };
        }
        console.error('❌ Erro na API:', errorData);
        throw new Error(errorData.message || 'Erro ao criar publicação');
      }
      
      const result = JSON.parse(responseText);
      console.log('✅ Publicação criada:', result);
      
      showToast('Publicação criada com sucesso!', 'success');
      fecharModalPublicacao();
      
      // Recarregar perfil
      await carregarMeuPerfil();
      
    } catch (error) {
      console.error('❌ Erro completo:', error);
      console.error('Stack trace:', error.stack);
      showToast(error.message || 'Erro ao criar publicação', 'error');
    }
  });
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Página de Perfil Próprio (Empresa) vaiii carregada');
  console.log('🔍 LocalStorage:', {
    userId: getUserId(),
    userType: getUserType(),
    token: getAuthToken() ? 'presente' : 'ausente'
  });
  
  carregarMeuPerfil();
});