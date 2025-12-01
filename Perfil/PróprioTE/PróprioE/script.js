
// SCRIPT PERFIL PRÓPRIO - EMPRESA (CORRIGIDO)
// ==========================================

const API_URL = 'http://127.0.0.1:8000/api';

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
    const usuario = data.user || data;
    
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
  
  // ===== NOME E DADOS BÁSICOS =====
  document.querySelector('.nome-perfil').textContent = empresa.razao_social || 'Empresa não informada';
  document.querySelector('.profissao').textContent = usuario.categoria?.nome || 'Categoria não informada';
  document.querySelector('.lc-cidade').textContent = empresa.localidade || 'Cidade não informada';
  document.querySelector('.lc-estado').textContent = empresa.uf || 'UF';
  
  // ===== FOTO DE PERFIL =====
  const fotoPerfil = document.querySelector('.foto-perfil');
  if (empresa.foto) {
    fotoPerfil.style.backgroundImage = `url('${empresa.foto}')`;
    fotoPerfil.style.backgroundSize = 'cover';
    fotoPerfil.style.backgroundPosition = 'center';
    fotoPerfil.innerHTML = '';
  } else {
    fotoPerfil.style.background = 'linear-gradient(135deg,rgb(32, 1, 36) 0%, #f5576c 100%)';
    fotoPerfil.innerHTML = `<span style="color: white; font-size: 48px; font-weight: bold;">${empresa.razao_social.charAt(0).toUpperCase()}</span>`;
    fotoPerfil.style.display = 'flex';
    fotoPerfil.style.alignItems = 'center';
    fotoPerfil.style.justifyContent = 'center';
  }
  
  // ===== CAPA =====
  const imgFundo = document.querySelector('.img-fundo');
  if (empresa.capa) {
    imgFundo.style.backgroundImage = `url('${empresa.capa}')`;
    imgFundo.style.backgroundSize = 'cover';
    imgFundo.style.backgroundPosition = 'center';
  } else {
    imgFundo.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }
  
  // ===== SOBRE A EMPRESA =====
  const sobreEmpresa = document.querySelector('.sobre_profissional');
  const paragrafo = sobreEmpresa.querySelector('p');
  
  if (empresa.descricao) {
    paragrafo.textContent = empresa.descricao;
    paragrafo.style.color = '';
    paragrafo.style.fontStyle = '';
  } else {
    paragrafo.textContent = 'Você ainda não adicionou uma descrição. Clique em "Editar Perfil" para adicionar.';
    paragrafo.style.color = '#999';
    paragrafo.style.fontStyle = 'italic';
  }
  
  // ===== TELEFONE =====
  const telefoneElements = document.querySelectorAll('.tl-numero, .telefone-numero');
  const telefoneContainers = document.querySelectorAll('.telefone, .button-telefone');
  
  if (contato.telefone) {
    telefoneElements.forEach(el => el.textContent = contato.telefone);
    telefoneContainers.forEach(el => el.style.display = 'flex');
  } else {
    telefoneContainers.forEach(el => el.style.display = 'none');
  }
  
  // ===== EMAIL =====
  document.querySelectorAll('.email-text').forEach(el => {
    el.textContent = usuario.email || 'Email não informado';
  });
  
  // ===== REDES SOCIAIS =====
  const instagram = document.querySelector('.instagram');
  if (contato.instagram) {
    instagram.style.display = 'flex';
    instagram.querySelector('.name_perfil-x').textContent = contato.instagram;
  } else {
    instagram.style.display = 'none';
  }
  
  const facebook = document.querySelector('.facebook');
  if (contato.facebook) {
    facebook.style.display = 'flex';
    facebook.querySelector('.name_perfil-fac').textContent = contato.facebook;
  } else {
    facebook.style.display = 'none';
  }
  
  const twitter = document.querySelector('.X');
  if (contato.twitter) {
    twitter.style.display = 'flex';
    twitter.querySelector('.name_perfil-x').textContent = contato.twitter;
  } else {
    twitter.style.display = 'none';
  }
  
  // ===== PROJETOS CONCLUÍDOS =====
  const projetosConcluidos = document.querySelector('.projetos_concluidos');
  if (empresa.projetos_concluidos !== null && empresa.projetos_concluidos !== undefined) {
    projetosConcluidos.style.display = 'flex';
    projetosConcluidos.querySelector('.projetos_concluidos-text').textContent = empresa.projetos_concluidos;
  } else {
    projetosConcluidos.style.display = 'none';
  }
  
  // ===== IDADE DA EMPRESA =====
  const idadeEmpresa = document.querySelector('.idade_empresa');
  if (empresa.idade_empresa !== null && empresa.idade_empresa !== undefined) {
    idadeEmpresa.style.display = 'flex';
    const textoElement = idadeEmpresa.querySelector('.idade_empresa-text');
    if (textoElement) {
      textoElement.textContent = `${empresa.idade_empresa} ${empresa.idade_empresa === 1 ? 'ano' : 'anos'}`;
    }
  } else {
    idadeEmpresa.style.display = 'none';
  }
  
  // ===== AVALIAÇÕES =====
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
  
  console.log('✅ Perfil preenchido com sucesso');
}

// ========== ABRIR MODAL EDITAR PERFIL ==========
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
      const usuario = data.user;
      const empresa = usuario.empresa;
      const contato = usuario.contato || {};
      
      // PRÉ-PREENCHER FORMULÁRIO
      document.getElementById('name').value = empresa.razao_social || '';
      document.getElementById('sobreEmpresa').value = empresa.descricao || '';
      document.getElementById('instagram').value = contato.instagram || '';
      document.getElementById('facebook').value = contato.facebook || '';
      document.getElementById('twitter').value = contato.twitter || '';
      document.getElementById('phone').value = contato.telefone || '';
      document.getElementById('registerEmail').value = usuario.email || '';
      document.getElementById('ProjetosConcluidos').value = empresa.projetos_concluidos || '';
      document.getElementById('TempoExpe').value = empresa.idade_empresa || '';
      
      // 🔥 CARREGAR CATEGORIAS
      await carregarCategorias();
      
      modal.classList.add('active');
      
    } catch (error) {
      console.error('Erro ao abrir modal:', error);
      showToast('Erro ao carregar dados', 'error');
    }
  });
}

// ========== CARREGAR CATEGORIAS ==========
async function carregarCategorias() {
  try {
    const response = await fetch(`${API_URL}/categoria`);
    const categorias = await response.json();
    
    const select = document.getElementById('AreaOptions');
    select.innerHTML = '';
    
    categorias.forEach(categoria => {
      const option = document.createElement('li');
      option.dataset.value = categoria.id;
      option.textContent = categoria.nome;
      select.appendChild(option);
    });
    
    console.log('✅ Categorias carregadas:', categorias);
    
  } catch (error) {
    console.error('❌ Erro ao carregar categorias:', error);
  }
}

// ========== SALVAR ALTERAÇÕES ==========
const formEditarPerfil = document.getElementById('Form');

if (formEditarPerfil) {
  formEditarPerfil.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        showToast('Você precisa estar logado', 'error');
        return;
      }
      
      const formData = new FormData();
      
      // DADOS BÁSICOS
      const nome = document.getElementById('name').value.trim();
      if (nome) formData.append('razao_social', nome);
      
      const descricao = document.getElementById('sobreEmpresa').value.trim();
      if (descricao) formData.append('descricao', descricao);
      
      const email = document.getElementById('registerEmail').value.trim();
      if (email) formData.append('email', email);
      
      // CONTATOS
      const telefone = document.getElementById('phone').value.trim();
      if (telefone) formData.append('telefone', telefone);
      
      const instagram = document.getElementById('instagram').value.trim();
      if (instagram) formData.append('instagram', instagram);
      
      const facebook = document.getElementById('facebook').value.trim();
      if (facebook) formData.append('facebook', facebook);
      
      const twitter = document.getElementById('twitter').value.trim();
      if (twitter) formData.append('twitter', twitter);
      
      // DADOS ADICIONAIS
      const projetosConcluidos = document.getElementById('ProjetosConcluidos').value.trim();
      if (projetosConcluidos) formData.append('projetos_concluidos', projetosConcluidos);
      
      const idadeEmpresa = document.getElementById('TempoExpe').value.trim();
      if (idadeEmpresa) formData.append('idade_empresa', idadeEmpresa);
      
      // FOTOS
      const fotoPerfil = document.getElementById('Perfil');
      if (fotoPerfil && fotoPerfil.files[0]) {
        formData.append('foto', fotoPerfil.files[0]);
      }
      
      const fotoBanner = document.getElementById('Banner');
      if (fotoBanner && fotoBanner.files[0]) {
        formData.append('capa', fotoBanner.files[0]);
      }
      
      console.log('📤 Enviando dados para API...');
      
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