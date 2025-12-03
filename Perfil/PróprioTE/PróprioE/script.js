// ==========================================
// SCRIPT PERFIL PRÓPRIO - EMPRESA (CORRIGIDO COM DEBUG ORIGINAL) empresa1
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

// CORRIGIDO: gera a URL correta do storage (NÃO remove public, storage, etc)
function construirUrlCompleta(caminho) {
  if (!caminho || caminho === 'null') return null;
  if (caminho.startsWith('http')) return caminho;
  return `${BASE_URL}/storage/${caminho}`;
}

// ========== NAVEGAÇÃO ENTRE ABAS ==========
const btn_sobre = document.getElementById('btn_navperfil-sobre');
const btn_postagens = document.getElementById('btn_navperfil-postagens');
const btn_avaliacao = document.getElementById('btn_navperfil-avaliacao');

const sessao_sobre = document.querySelector('.sobre');
const sessao_publicacoes = document.querySelector('.publicacoes');
const sessao_avaliacao = document.querySelector('.avaliacao');

function clicou_sobre() {
  if (!btn_sobre.classList.contains('ativo')) {
    document.querySelector('.button-navper.ativo')?.classList.remove('ativo');
    btn_sobre.classList.add('ativo');
    document.querySelector('.sessao')?.classList.remove('sessao');
    sessao_sobre.classList.add('sessao');
  }
}

function clicou_postagens() {
  if (!btn_postagens.classList.contains('ativo')) {
    document.querySelector('.button-navper.ativo')?.classList.remove('ativo');
    btn_postagens.classList.add('ativo');
    document.querySelector('.sessao')?.classList.remove('sessao');
    sessao_publicacoes.classList.add('sessao');
  }
}

function clicou_avaliacao() {
  if (!btn_avaliacao.classList.contains('ativo')) {
    document.querySelector('.button-navper.ativo')?.classList.remove('ativo');
    btn_avaliacao.classList.add('ativo');
    document.querySelector('.sessao')?.classList.remove('sessao');
    sessao_avaliacao.classList.add('sessao');
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

    console.log('🔍 DEBUG - Iniciando carregamento:', { userId, userType, token: token ? 'presente' : 'ausente' });

    if (!userId || !token) {
      console.error('❌ Usuário não autenticado');
      showToast('Você precisa estar logado', 'error');
      setTimeout(() => window.location.href = '../cadastro/Parte1/index.html', 2000);
      return;
    }

    if (userType !== 'empresa') {
      console.error('❌ Tipo de usuário incorreto:', userType);
      showToast('Acesso negado', 'error');
      setTimeout(() => window.location.href = '../cadastro/Parte1/index.html', 2000);
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

    preencherPerfil(usuario);

  } catch (error) {
    console.error('❌ Erro completo:', error);
    console.error('Stack trace:', error.stack);
    showToast('Erro ao carregar perfil', 'error');
  }
}

// ========== PREENCHER PERFIL ==========
function preencherPerfil(usuario) {
  console.log('🎨 Iniciando preenchimento do perfil');

  if (!usuario.empresa) {
    console.error('❌ ERRO: dados da empresa não encontrados');
    showToast('Erro: dados da empresa não encontrados', 'error');
    return;
  }

  const empresa = usuario.empresa;
  const contato = usuario.contato || {};

  // Nome e Categoria
  const nomePerfil = document.querySelector('.nome-perfil');
  if (nomePerfil) {
    nomePerfil.textContent = empresa.razao_social || 'Empresa não informada';
  }

  const profissao = document.querySelector('.profissao');
  if (profissao) {
    const categoria = empresa.categoria?.nome || 'Categoria não informada';
    profissao.textContent = categoria;
  }

  // Localização
  const lcCidade = document.querySelector('.lc-cidade');
  if (lcCidade) {
    lcCidade.textContent = empresa.localidade || 'Cidade não informada';
  }

  const lcEstado = document.querySelector('.lc-estado');
  if (lcEstado) {
    lcEstado.textContent = empresa.uf || 'UF';
  }

  // Foto de Perfil
  const fotoPerfil = document.querySelector('.foto-perfil');
  if (fotoPerfil) {
    if (empresa.foto && empresa.foto !== 'null') {
      const fotoUrl = empresa.foto.startsWith('http') ? empresa.foto : construirUrlCompleta(empresa.foto);
      fotoPerfil.style.backgroundImage = `url('${fotoUrl}')`;
      fotoPerfil.style.backgroundSize = 'cover';
      fotoPerfil.style.backgroundPosition = 'center';
      fotoPerfil.innerHTML = '';
    } else {
      fotoPerfil.style.background = 'linear-gradient(135deg, #0048ff 0%, #0048ff 100%)';
      fotoPerfil.innerHTML = `<span style="color: white; font-size: 48px; font-weight: bold;">${empresa.razao_social.charAt(0).toUpperCase()}</span>`;
      fotoPerfil.style.display = 'flex';
      fotoPerfil.style.alignItems = 'center';
      fotoPerfil.style.justifyContent = 'center';
    }
  }

  // Capa
  const imgFundo = document.querySelector('.img-fundo');
  if (imgFundo) {
    if (empresa.capa && empresa.capa !== 'null') {
      const capaUrl = empresa.capa.startsWith('http') ? empresa.capa : construirUrlCompleta(empresa.capa);
      imgFundo.style.backgroundImage = `url('${capaUrl}')`;
      imgFundo.style.backgroundSize = 'cover';
      imgFundo.style.backgroundPosition = 'center';
    } else {
      imgFundo.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  // Projetos Concluídos
  const projetosConcluidos = document.querySelector('.projetos_concluidos');
  if (projetosConcluidos) {
    const textElement = projetosConcluidos.querySelector('.projetos_concluidos-text');
    projetosConcluidos.style.display = 'flex';

    if (empresa.projetos_concluidos !== null && empresa.projetos_concluidos !== undefined) {
      if (textElement) {
        textElement.textContent = empresa.projetos_concluidos;
        textElement.style.color = '';
        textElement.style.fontStyle = '';
      }
    } else {
      if (textElement) {
        textElement.textContent = 'Não editado';
        textElement.style.color = '#999';
        textElement.style.fontStyle = 'italic';
      }
    }
  }

  // Idade da Empresa
  const idadeEmpresa = document.querySelector('.idade_empresa');
  if (idadeEmpresa) {
    const textElement = idadeEmpresa.querySelector('.idade_empresa-text');
    idadeEmpresa.style.display = 'flex';

    if (empresa.tempo_experiencia !== null && empresa.tempo_experiencia !== undefined) {
      const anos = empresa.tempo_experiencia;
      if (textElement) {
        textElement.textContent = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
        textElement.style.color = '';
        textElement.style.fontStyle = '';
      }
    } else {
      if (textElement) {
        textElement.textContent = 'Não editado';
        textElement.style.color = '#999';
        textElement.style.fontStyle = 'italic';
      }
    }
  }

  // Avaliação
  const avaliacaoObj = usuario.avaliacao || {};
  const avaliacao = avaliacaoObj.media || 0;
  const numAvaliacoes = avaliacaoObj.total || 0;

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

  // Estrelas
  const estrelas = document.querySelectorAll('.avaliacao-TCC .star, .avaliacao-BCC .star, .top-sess_avali .star');
  estrelas.forEach((star, index) => {
    if (index < Math.floor(avaliacao)) {
      star.style.fill = 'currentColor';
    } else {
      star.style.fill = 'none';
    }
  });

  // Contatos
  document.querySelectorAll('.tl-numero, .telefone-numero').forEach(el => {
    if (contato.telefone) {
      el.textContent = contato.telefone;
      el.closest('.telefone, .button-telefone')?.style.setProperty('display', 'flex', 'important');
    } else {
      el.closest('.telefone, .button-telefone')?.style.setProperty('display', 'none', 'important');
    }
  });

  document.querySelectorAll('.email-text').forEach(el => {
    el.textContent = usuario.email || 'Email não informado';
  });

  const instagram = document.querySelector('.instagram');
  if (instagram) {
    const nomeIns = instagram.querySelector('.name_perfil-x');
    if (contato.instagram) {
      instagram.style.display = 'flex';
      if (nomeIns) nomeIns.textContent = contato.instagram;
    } else {
      instagram.style.display = 'none';
    }
  }

  // Sobre a Empresa
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
      } else {
        paragrafo.textContent = 'Você ainda não adicionou uma descrição. Clique em "Editar Perfil" para adicionar.';
        paragrafo.style.color = '#999';
        paragrafo.style.fontStyle = 'italic';
      }
    }
  }

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

  // Publicações
  if (usuario.portfolios && usuario.portfolios.length > 0) {
    carregarPublicacoes(usuario.portfolios);
  } else {
    const publicacoesContainer = document.querySelector('.home-cards-post');
    if (publicacoesContainer) {
      publicacoesContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #999; font-style: italic;">Você ainda não possui publicações. Clique em "Nova publicação" para adicionar.</p>';
    }
  }
}

// ========== CARREGAR PUBLICAÇÕES (CORRIGIDO: FOTOS FUNCIONANDO + DEBUG) ==========
function carregarPublicacoes(portfolios) {
  const publicacoesContainer = document.querySelector('.home-cards-post');
  if (!publicacoesContainer) return;

  publicacoesContainer.innerHTML = '';

  portfolios.forEach(portfolio => {
    const card = document.createElement('div');
    card.className = 'card-publicacoes';

    let imagemUrl = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
    
    if (portfolio.fotos && portfolio.fotos.length > 0) {
      const foto = portfolio.fotos[0];
      
      // ✅ PRIORIDADE: caminho > url > foto
      if (foto.caminho) {
        imagemUrl = foto.caminho.startsWith('http') 
          ? foto.caminho 
          : `${BASE_URL}/storage/${foto.caminho}`;
      } else if (foto.url) {
        imagemUrl = foto.url.startsWith('http') 
          ? foto.url 
          : `${BASE_URL}${foto.url}`;
      } else if (foto.foto) {
        imagemUrl = `${BASE_URL}/storage/${foto.foto}`;
      }
      
      console.log('🖼️ URL da imagem construída:', imagemUrl);
    }

    const titulo = portfolio.titulo || 'Sem título';
    const descricao = portfolio.descricao || 'Sem descrição';

    card.innerHTML = `
      <div class="img-card_publicacoes" style="background-image: url('${imagemUrl}'); background-size: cover; background-position: center;"></div>
      <div class="mini-informacoes-card_publicacoes">
        <h4>${titulo}</h4>
        <p>${descricao}</p>
      </div>
    `;

    publicacoesContainer.appendChild(card);
  });
}

// ========== BOTÃO EDITAR PERFIL ==========
const btnEditarPerfil = document.querySelector('.btn-editar-perfil');
if (btnEditarPerfil) {
  btnEditarPerfil.addEventListener('click', () => {
    console.log('🔘 Botão Editar Perfil clicado');
    const modal = document.getElementById('modalPerfil');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('✅ Modal aberto');
    } else {
      console.error('❌ Modal não encontrado no DOM');
    }
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

// Preview de arquivos
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

// ========== CONFIRMAR PUBLICAÇÃO ==========
if (btnConfirmarAddPub) {
  btnConfirmarAddPub.addEventListener('click', async () => {
    try {
      const titulo = document.getElementById('pubTitulo')?.value.trim();
      const descricao = document.getElementById('pubDescricao')?.value.trim();

      console.log('📤 DEBUG - Dados da publicação:', { titulo, descricao, arquivos: selectedFiles.length });

      // Validação
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
      if (titulo) formData.append('titulo', titulo);
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

      const token = getAuthToken();
      const url = `${API_URL}/portfolio/cadastro`;

      console.log('🌐 URL da requisição:', url);

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
      showToast(error.message || 'Erro ao criar publicação', 'error');
    }
  });
}

// ========== SAIR DA CONTA ==========
const sairContaBtn = document.getElementById('SairConta');
if (sairContaBtn) {
  sairContaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Deseja realmente sair da sua conta?')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
      localStorage.removeItem('user_data');
      showToast('Saindo...', 'success');
      setTimeout(() => {
        window.location.href = '/Login/index.html';
      }, 1000);
    }
  });
}

// ========== EXCLUIR CONTA ==========
const excluirContaBtn = document.getElementById('excluirConta');
if (excluirContaBtn) {
  excluirContaBtn.addEventListener('click', async (e) => {
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
        setTimeout(() => {
          window.location.href = '../cadastro/Parte1/index.html';
        }, 2000);
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
  console.log('🚀 Página de Perfil Próprio (Empresa) carregada gay');
  carregarMeuPerfil();
});