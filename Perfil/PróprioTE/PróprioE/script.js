// ==========================================
// SCRIPT PERFIL PRÓPRIO - EMPRESA (VERSÃO CORRIGIDA)
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
  if (!caminho) return null;
  if (caminho.startsWith('http')) return caminho;
  
  const caminhoLimpo = caminho.replace(/^public\//, '');
  return `${BASE_URL}/storage/${caminhoLimpo}`;
}

// ========== NAVEGAÇÃO ENTRE ABAS ==========
const btn_sobre = document.getElementById('btn_navperfil-sobre');
const btn_postagens = document.getElementById('btn_navperfil-postagens');
const btn_avaliacao = document.getElementById('btn_navperfil-avaliacao');

const sessao_sobre = document.querySelector('.sobre');
const sessao_publicacoes = document.querySelector('.publicacoes');
const sessao_avaliacao = document.querySelector('.avaliacao');

function clicou_sobre() {
  if (btn_sobre && !btn_sobre.classList.contains('ativo')) {
    document.querySelector('.button-navper.ativo')?.classList.remove('ativo');
    btn_sobre.classList.add('ativo');
    document.querySelector('.sessao')?.classList.remove('sessao');
    sessao_sobre?.classList.add('sessao');
  }
}

function clicou_postagens() {
  if (btn_postagens && !btn_postagens.classList.contains('ativo')) {
    document.querySelector('.button-navper.ativo')?.classList.remove('ativo');
    btn_postagens.classList.add('ativo');
    document.querySelector('.sessao')?.classList.remove('sessao');
    sessao_publicacoes?.classList.add('sessao');
  }
}

function clicou_avaliacao() {
  if (btn_avaliacao && !btn_avaliacao.classList.contains('ativo')) {
    document.querySelector('.button-navper.ativo')?.classList.remove('ativo');
    btn_avaliacao.classList.add('ativo');
    document.querySelector('.sessao')?.classList.remove('sessao');
    sessao_avaliacao?.classList.add('sessao');
  }
}

btn_sobre?.addEventListener('click', clicou_sobre);
btn_postagens?.addEventListener('click', clicou_postagens);
btn_avaliacao?.addEventListener('click', clicou_avaliacao);

// ========== CARREGAR MEU PERFIL ==========
async function carregarMeuPerfil() {
  try {
    const userId = getUserId();
    const userType = getUserType();
    const token = getAuthToken();
    
    if (!userId || !token) {
      showToast('Você precisa estar logado', 'error');
      setTimeout(() => window.location.href = '/Login/index.html', 2000);
      return;
    }
    
    if (userType !== 'empresa') {
      showToast('Acesso negado', 'error');
      setTimeout(() => window.location.href = '/Login/index.html', 2000);
      return;
    }
    
    console.log('🔵 Carregando perfil empresa:', { userId, userType });
    
    const response = await fetch(`${API_URL}/usuarios/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Erro ao carregar perfil');
    
    const data = await response.json();
    const usuario = data.user || data.data || data;
    
    console.log('✅ Dados recebidos:', usuario);
    preencherPerfil(usuario);
    
  } catch (error) {
    console.error('❌ Erro ao carregar perfil:', error);
    showToast('Erro ao carregar perfil', 'error');
  }
}

// ========== PREENCHER PERFIL ==========
function preencherPerfil(usuario) {
  console.log('🔵 Preenchendo perfil empresa:', usuario);
  
  if (!usuario.empresa) {
    showToast('Erro: dados da empresa não encontrados', 'error');
    return;
  }
  
  const empresa = usuario.empresa;
  const contato = usuario.contato || {};
  
  // Nome e dados básicos
  const nomePerfil = document.querySelector('.nome-perfil');
  if (nomePerfil) nomePerfil.textContent = empresa.razao_social || 'Empresa não informada';
  
  const profissao = document.querySelector('.profissao');
  if (profissao) profissao.textContent = empresa.categoria?.nome || 'Categoria não informada';
  
  const lcCidade = document.querySelector('.lc-cidade');
  if (lcCidade) lcCidade.textContent = empresa.localidade || 'Cidade não informada';
  
  const lcEstado = document.querySelector('.lc-estado');
  if (lcEstado) lcEstado.textContent = empresa.uf || 'UF';
  
  // Foto de perfil
  const fotoPerfil = document.querySelector('.foto-perfil');
  if (fotoPerfil) {
    if (empresa.foto) {
      const fotoUrl = construirUrlCompleta(empresa.foto);
      fotoPerfil.style.backgroundImage = `url('${fotoUrl}')`;
      fotoPerfil.style.backgroundSize = 'cover';
      fotoPerfil.style.backgroundPosition = 'center';
      fotoPerfil.innerHTML = '';
    } else {
      fotoPerfil.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      fotoPerfil.innerHTML = `<span style="color: white; font-size: 48px; font-weight: bold;">${empresa.razao_social.charAt(0).toUpperCase()}</span>`;
      fotoPerfil.style.display = 'flex';
      fotoPerfil.style.alignItems = 'center';
      fotoPerfil.style.justifyContent = 'center';
    }
  }
  
  // Capa
  const imgFundo = document.querySelector('.img-fundo');
  if (imgFundo) {
    if (empresa.capa) {
      const capaUrl = construirUrlCompleta(empresa.capa);
      imgFundo.style.backgroundImage = `url('${capaUrl}')`;
      imgFundo.style.backgroundSize = 'cover';
      imgFundo.style.backgroundPosition = 'center';
    } else {
      imgFundo.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }
  
  // Sobre a empresa
  const sobreEmpresa = document.querySelector('.sobre_profissional');
  if (sobreEmpresa) {
    const paragrafo = sobreEmpresa.querySelector('p');
    const titulo = sobreEmpresa.querySelector('h3');
    
    if (titulo) titulo.textContent = 'Sobre a Empresa';
    
    if (paragrafo) {
      if (empresa.descricao && empresa.descricao.trim()) {
        paragrafo.textContent = empresa.descricao;
        paragrafo.style.color = '';
        paragrafo.style.fontStyle = '';
      } else {
        paragrafo.textContent = 'Você ainda não adicionou uma descrição. Clique em "Editar Perfil" para adicionar.';
        paragrafo.style.color = '#999';
        paragrafo.style.fontStyle = 'italic';
      }
    }
  }
  
  // Telefone
  document.querySelectorAll('.tl-numero, .telefone-numero').forEach(el => {
    if (contato.telefone) {
      el.textContent = contato.telefone;
      el.closest('.telefone, .button-telefone')?.style.setProperty('display', 'flex', 'important');
    } else {
      el.closest('.telefone, .button-telefone')?.style.setProperty('display', 'none', 'important');
    }
  });
  
  // Email
  document.querySelectorAll('.email-text').forEach(el => {
    el.textContent = usuario.email || 'Email não informado';
  });
  
  // Redes sociais
  const instagram = document.querySelector('.instagram');
  if (instagram) {
    if (contato.instagram) {
      instagram.style.display = 'flex';
      const nameEl = instagram.querySelector('.name_perfil-ins, .name_perfil-x');
      if (nameEl) nameEl.textContent = contato.instagram;
    } else {
      instagram.style.display = 'none';
    }
  }
  
  const facebook = document.querySelector('.facebook');
  if (facebook) {
    if (contato.facebook) {
      facebook.style.display = 'flex';
      const nameEl = facebook.querySelector('.name_perfil-fac');
      if (nameEl) nameEl.textContent = contato.facebook;
    } else {
      facebook.style.display = 'none';
    }
  }
  
  const twitter = document.querySelector('.X');
  if (twitter) {
    if (contato.twitter) {
      twitter.style.display = 'flex';
      const nameEl = twitter.querySelector('.name_perfil-x');
      if (nameEl) nameEl.textContent = contato.twitter;
    } else {
      twitter.style.display = 'none';
    }
  }
  
  // Projetos concluídos
  const projetosConcluidos = document.querySelector('.projetos_concluidos');
  if (projetosConcluidos) {
    const textoProjetos = projetosConcluidos.querySelector('.projetos_concluidos-text');
    if (textoProjetos && empresa.projetos_concluidos !== null && empresa.projetos_concluidos !== undefined) {
      projetosConcluidos.style.display = 'flex';
      textoProjetos.textContent = empresa.projetos_concluidos;
    } else {
      projetosConcluidos.style.display = 'none';
    }
  }
  
  // Idade da empresa
  const idadeEmpresa = document.querySelector('.idade_empresa');
  if (idadeEmpresa) {
    const textoIdade = idadeEmpresa.querySelector('.idade_empresa-text');
    if (textoIdade && empresa.idade_empresa !== null && empresa.idade_empresa !== undefined) {
      idadeEmpresa.style.display = 'flex';
      textoIdade.textContent = `${empresa.idade_empresa} ${empresa.idade_empresa == 1 ? 'ano' : 'anos'}`;
    } else {
      idadeEmpresa.style.display = 'none';
    }
  }
  
  // Avaliações
  const avaliacao = usuario.avaliacao?.media || 0;
  const numAvaliacoes = usuario.avaliacao?.total || 0;
  
  document.querySelectorAll('.quant-stars').forEach(el => {
    el.textContent = avaliacao.toFixed(1);
  });
  
  document.querySelectorAll('.quant-avaliacoes').forEach(el => {
    el.textContent = numAvaliacoes;
  });
  
  document.querySelectorAll('.quant_avaliacoes-text').forEach(el => {
    el.textContent = numAvaliacoes === 1 ? 'avaliação' : 'avaliações';
  });
  
  // Especialidades
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
    } else {
      especialidadesContainer.style.display = 'none';
    }
  }
  
  // Carregar publicações
  if (usuario.portfolios && usuario.portfolios.length > 0) {
    carregarPublicacoes(usuario.portfolios);
  } else {
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
    
    const imagemUrl = portfolio.fotos && portfolio.fotos[0] 
      ? construirUrlCompleta(portfolio.fotos[0].caminho)
      : '';
    
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

// ========== MODAL EDITAR PERFIL ==========
const btnEditarPerfil = document.querySelector('.btn-editar-perfil');
const modal = document.getElementById('modalPerfil');

if (btnEditarPerfil && modal) {
  btnEditarPerfil.addEventListener('click', async () => {
    try {
      const userId = getUserId();
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      const usuario = data.user || data.data || data;
      const empresa = usuario.empresa;
      const contato = usuario.contato || {};
      
      // Pré-preencher formulário
      document.getElementById('name').value = empresa.razao_social || '';
      document.getElementById('sobreEmpresa').value = empresa.descricao || '';
      document.getElementById('instagram').value = contato.instagram || '';
      document.getElementById('facebook').value = contato.facebook || '';
      document.getElementById('twitter').value = contato.twitter || '';
      document.getElementById('phone').value = contato.telefone || '';
      document.getElementById('registerEmail').value = usuario.email || '';
      document.getElementById('ProjetosConcluidos').value = empresa.projetos_concluidos || '';
      document.getElementById('TempoExpe').value = empresa.idade_empresa || '';
      
      // Pré-selecionar categoria
      const inputArea = document.getElementById('profission');
      if (inputArea && usuario.empresa.categoria) {
        inputArea.value = usuario.empresa.categoria.nome;
        inputArea.dataset.categoriaId = usuario.empresa.categoria.id;
      }
      
      modal.classList.add('active');
      
    } catch (error) {
      console.error('Erro ao abrir modal:', error);
      showToast('Erro ao carregar dados', 'error');
    }
  });
}

// ========== SALVAR ALTERAÇÕES - CORRIGIDO ==========
const formEditarPerfil = document.getElementById('Form');

if (formEditarPerfil) {
  formEditarPerfil.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const token = getAuthToken();
      const userId = getUserId();
      
      if (!token) {
        showToast('Você precisa estar logado', 'error');
        return;
      }
      
      const formData = new FormData();
      
      // Dados básicos
      const nome = document.getElementById('name')?.value.trim();
      if (nome) formData.append('razao_social', nome);
      
      const descricao = document.getElementById('sobreEmpresa')?.value.trim();
      if (descricao) formData.append('descricao', descricao);
      
      const email = document.getElementById('registerEmail')?.value.trim();
      if (email) formData.append('email', email);
      
      const telefone = document.getElementById('phone')?.value.trim();
      if (telefone) formData.append('telefone', telefone);
      
      const instagram = document.getElementById('instagram')?.value.trim();
      if (instagram) formData.append('instagram', instagram);
      
      const facebook = document.getElementById('facebook')?.value.trim();
      if (facebook) formData.append('facebook', facebook);
      
      const twitter = document.getElementById('twitter')?.value.trim();
      if (twitter) formData.append('twitter', twitter);
      
      const projetos = document.getElementById('ProjetosConcluidos')?.value;
      if (projetos) formData.append('projetos_concluidos', projetos);
      
      const idade = document.getElementById('TempoExpe')?.value;
      if (idade) formData.append('idade_empresa', idade);
      
      // Categoria
      const inputArea = document.getElementById('profission');
      if (inputArea && inputArea.dataset.categoriaId) {
        formData.append('id_categoria', inputArea.dataset.categoriaId);
      }
      
      // Fotos
      const fotoPerfil = document.getElementById('Perfil');
      if (fotoPerfil?.files[0]) {
        formData.append('foto', fotoPerfil.files[0]);
      }
      
      const fotoBanner = document.getElementById('Banner');
      if (fotoBanner?.files[0]) {
        formData.append('capa', fotoBanner.files[0]);
      }
      
      console.log('📤 Enviando dados...');
      
      // 🔥 CORRIGIDO: usar a rota correta /usuario/update com POST
      const response = await fetch(`${API_URL}/usuario/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil');
      }
      
      const result = await response.json();
      console.log('✅ Perfil atualizado:', result);
      
      showToast('Perfil atualizado com sucesso!', 'success');
      
      modal.classList.remove('active');
      await carregarMeuPerfil();
      
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      showToast(error.message || 'Erro ao atualizar perfil', 'error');
    }
  });
}

// ========== PREVIEW DE IMAGENS ==========
const inputPerfil = document.getElementById('Perfil');
const inputBanner = document.getElementById('Banner');
const previewPerfil = document.getElementById('PerfilPreview');
const previewBanner = document.getElementById('BannerPreview');

if (inputPerfil && previewPerfil) {
  inputPerfil.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewPerfil.style.backgroundImage = `url('${event.target.result}')`;
        previewPerfil.style.backgroundSize = 'cover';
        previewPerfil.style.backgroundPosition = 'center';
        previewPerfil.innerHTML = '';
      };
      reader.readAsDataURL(file);
    }
  });
}

if (inputBanner && previewBanner) {
  inputBanner.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewBanner.style.backgroundImage = `url('${event.target.result}')`;
        previewBanner.style.backgroundSize = 'cover';
        previewBanner.style.backgroundPosition = 'center';
        previewBanner.innerHTML = '';
      };
      reader.readAsDataURL(file);
    }
  });
}

// ========== MODAL ADICIONAR PUBLICAÇÃO ==========
const btnAddPost = document.querySelector('.btn-add-post');
const modalAddPost = document.getElementById('modalAddPub');
const btnFecharAddPub = document.getElementById('fecharAddPub');
const btnCancelarAddPub = document.getElementById('cancelarAddPub');
const btnConfirmarAddPub = document.getElementById('confirmarAddPub');

if (btnAddPost && modalAddPost) {
  btnAddPost.addEventListener('click', () => {
    modalAddPost.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

if (btnFecharAddPub && modalAddPost) {
  btnFecharAddPub.addEventListener('click', () => {
    modalAddPost.classList.remove('active');
    document.body.style.overflow = 'auto';
    limparFormularioPublicacao();
  });
}

if (btnCancelarAddPub && modalAddPost) {
  btnCancelarAddPub.addEventListener('click', () => {
    modalAddPost.classList.remove('active');
    document.body.style.overflow = 'auto';
    limparFormularioPublicacao();
  });
}

function limparFormularioPublicacao() {
  const descricao = document.getElementById('pubDescricao');
  const midias = document.getElementById('pubMidias');
  const preview = document.getElementById('previewContainer');
  
  if (descricao) descricao.value = '';
  if (midias) midias.value = '';
  if (preview) preview.innerHTML = '';
}

// PREVIEW DE MÍDIAS
const inputMidias = document.getElementById('pubMidias');
const previewContainer = document.getElementById('previewContainer');

if (inputMidias && previewContainer) {
  inputMidias.addEventListener('change', (e) => {
    previewContainer.innerHTML = '';
    const files = Array.from(e.target.files);
    
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = document.createElement('div');
        preview.className = 'preview-item';
        preview.style.cssText = 'position: relative; width: 100px; height: 100px; margin: 5px; display: inline-block;';
        
        if (file.type.startsWith('image/')) {
          preview.innerHTML = `<img src="${event.target.result}" alt="Preview ${index + 1}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        } else if (file.type.startsWith('video/')) {
          preview.innerHTML = `<video src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"></video>`;
        }
        
        previewContainer.appendChild(preview);
      };
      reader.readAsDataURL(file);
    });
  });
}

// CONFIRMAR PUBLICAÇÃO - CORRIGIDO
if (btnConfirmarAddPub) {
  btnConfirmarAddPub.addEventListener('click', async () => {
    try {
      const descricao = document.getElementById('pubDescricao')?.value.trim();
      const midias = document.getElementById('pubMidias')?.files;
      
      if (!descricao) {
        showToast('Preencha a descrição', 'error');
        return;
      }
      
      if (!midias || midias.length === 0) {
        showToast('Adicione pelo menos uma mídia', 'error');
        return;
      }
      
      const formData = new FormData();
      formData.append('descricao', descricao);
      
      // Separar imagens e vídeos
      Array.from(midias).forEach((file) => {
        if (file.type.startsWith('image/')) {
          formData.append('imagens[]', file);
        } else if (file.type.startsWith('video/')) {
          formData.append('videos[]', file);
        }
      });
      
      const token = getAuthToken();
      
      showToast('Criando publicação...', 'info');
      
      // 🔥 CORRIGIDO: usar a rota correta /portfolio/cadastro
      const response = await fetch(`${API_URL}/portfolio/cadastro`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar publicação');
      }
      
      const result = await response.json();
      console.log('✅ Publicação criada:', result);
      
      showToast('Publicação criada com sucesso!', 'success');
      modalAddPost.classList.remove('active');
      document.body.style.overflow = 'auto';
      limparFormularioPublicacao();
      
      // Recarregar perfil para mostrar nova publicação
      await carregarMeuPerfil();
      
    } catch (error) {
      console.error('Erro ao criar publicação:', error);
      showToast(error.message || 'Erro ao criar publicação', 'error');
    }
  });
}

// ========== CANCELAR EDIÇÃO ==========
const btnCancelarEdit = document.getElementById('cancelBtn');

if (btnCancelarEdit) {
  btnCancelarEdit.addEventListener('click', () => {
    modal.classList.remove('active');
    formEditarPerfil.reset();
  });
}

// ========== SAIR DA CONTA ==========
const btnSair = document.getElementById('SairConta');

if (btnSair) {
  btnSair.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (confirm('Deseja realmente sair da sua conta?')) {
      localStorage.clear();
      showToast('Saindo...', 'success');
      setTimeout(() => window.location.href = '/Login/index.html', 1000);
    }
  });
}

// ========== EXCLUIR CONTA ==========
const btnExcluir = document.getElementById('excluirConta');

if (btnExcluir) {
  btnExcluir.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (!confirm('⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nDeseja realmente excluir sua conta permanentemente?')) {
      return;
    }
    
    try {
      const userId = getUserId();
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showToast('Conta excluída com sucesso', 'success');
        localStorage.clear();
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        throw new Error('Erro ao excluir conta');
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      showToast('Erro ao excluir conta', 'error');
    }
  });
}



// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Página de Perfil Próprio (Empresa) carregada');
  carregarMeuPerfil();
});
