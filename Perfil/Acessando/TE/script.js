// ==========================================
// SISTEMA COMPLETO DE GERENCIAMENTO DE PERFIL
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
  
  if (type === 'success') {
    toast.style.background = '#28a745';
  } else if (type === 'error') {
    toast.style.background = '#dc3545';
  } else {
    toast.style.background = '#007bff';
  }
  
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);
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

// ========== CARREGAR PERFIL DO USUÁRIO ==========
async function carregarPerfilUsuario() {
  try {
    const userId = getUserId();
    const userType = getUserType();
    const token = getAuthToken();
    
    if (!userId || !token) {
      console.error('❌ Usuário não autenticado');
      showToast('Você precisa estar logado', 'error');
      setTimeout(() => window.location.href = '../Parte1/index.html', 2000);
      return;
    }
    
    console.log('🔵 Carregando perfil:', { userId, userType });
    
    // Buscar dados do usuário
    const response = await fetch(`${API_URL}/usuarios/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao carregar perfil');
    }
    
    const data = await response.json();
    const usuario = data.user || data.data || data;
    
    console.log('✅ Dados recebidos:', usuario);
    
    // Preencher perfil baseado no tipo
    preencherPerfil(usuario);
    
  } catch (error) {
    console.error('❌ Erro ao carregar perfil:', error);
    showToast('Erro ao carregar perfil', 'error');
  }
}

// ========== PREENCHER DADOS DO PERFIL ==========
function preencherPerfil(usuario) {
  console.log('🔵 Preenchendo perfil com:', usuario);
  
  let dados = {};
  
  // Extrair dados conforme tipo
  if (usuario.type === 'prestador' && usuario.prestador) {
    dados = {
      nome: usuario.prestador.nome || 'Nome não informado',
      profissao: usuario.ramo?.nome || 'Profissão não informada',
      cidade: usuario.prestador.localidade || 'Cidade não informada',
      uf: usuario.prestador.uf || 'UF',
      estado: usuario.prestador.estado || 'Estado',
      foto: usuario.prestador.foto,
      capa: usuario.prestador.capa,
      descricao: usuario.prestador.descricao || null,
      email: usuario.email || 'Email não informado',
      telefone: usuario.contato?.telefone || null,
      instagram: usuario.contato?.instagram || null,
      facebook: usuario.contato?.facebook || null,
      twitter: usuario.contato?.twitter || null,
      tipo: 'Profissional',
      projetosConcluidos: usuario.prestador.projetos_concluidos || null,
      tempoExperiencia: usuario.prestador.tempo_experiencia || null,
      skills: usuario.prestador.skills || [],
      disponibilidade: usuario.prestador.disponivel ? 'Disponível' : 'Indisponível'
    };
  } else if (usuario.type === 'empresa' && usuario.empresa) {
    dados = {
      nome: usuario.empresa.razao_social || 'Empresa não informada',
      profissao: usuario.categoria?.nome || 'Categoria não informada',
      cidade: usuario.empresa.localidade || 'Cidade não informada',
      uf: usuario.empresa.uf || 'UF',
      estado: usuario.empresa.estado || 'Estado',
      foto: usuario.empresa.foto,
      capa: usuario.empresa.capa,
      descricao: usuario.empresa.descricao || null,
      email: usuario.email || 'Email não informado',
      telefone: usuario.contato?.telefone || null,
      instagram: usuario.contato?.instagram || null,
      facebook: usuario.contato?.facebook || null,
      twitter: usuario.contato?.twitter || null,
      tipo: 'Empresa',
      projetosConcluidos: usuario.empresa.projetos_concluidos || null,
      idadeEmpresa: usuario.empresa.idade_empresa || null,
      skills: [],
      disponibilidade: 'Disponível'
    };
  } else if (usuario.type === 'contratante' && usuario.contratante) {
    dados = {
      nome: usuario.contratante.nome || 'Nome não informado',
      profissao: 'Contratante',
      cidade: usuario.contratante.localidade || 'Cidade não informada',
      uf: usuario.contratante.uf || 'UF',
      estado: usuario.contratante.estado || 'Estado',
      foto: usuario.contratante.foto,
      capa: usuario.contratante.capa,
      descricao: null,
      email: usuario.email || 'Email não informado',
      telefone: usuario.contato?.telefone || null,
      instagram: null,
      facebook: null,
      twitter: null,
      tipo: 'Contratante',
      projetosConcluidos: null,
      tempoExperiencia: null,
      skills: [],
      disponibilidade: null
    };
  }
  
  // Corrigir URLs das imagens
  if (dados.foto && !dados.foto.startsWith('http')) {
    dados.foto = `${API_URL.replace('/api', '')}/storage/${dados.foto}`;
  }
  
  if (dados.capa && !dados.capa.startsWith('http')) {
    dados.capa = `${API_URL.replace('/api', '')}/storage/${dados.capa}`;
  }
  
  // ===== PREENCHER ELEMENTOS DA PÁGINA =====
  
  // Foto de fundo (capa)
  const imgFundo = document.querySelector('.img-fundo');
  if (dados.capa && imgFundo) {
    imgFundo.style.backgroundImage = `url('${dados.capa}')`;
    imgFundo.style.backgroundSize = 'cover';
    imgFundo.style.backgroundPosition = 'center';
  }
  
  // Foto de perfil
  const fotoPerfil = document.querySelector('.foto-perfil');
  if (dados.foto && fotoPerfil) {
    fotoPerfil.style.backgroundImage = `url('${dados.foto}')`;
    fotoPerfil.style.backgroundSize = 'cover';
    fotoPerfil.style.backgroundPosition = 'center';
  }
  
  // Nome
  const nomePerfil = document.querySelector('.nome-perfil');
  if (nomePerfil) nomePerfil.textContent = dados.nome;
  
  // Profissão
  const profissao = document.querySelector('.profissao');
  if (profissao) profissao.textContent = dados.profissao;
  
  // Localização
  const lcCidade = document.querySelector('.lc-cidade');
  if (lcCidade) lcCidade.textContent = dados.cidade;
  
  const lcEstado = document.querySelector('.lc-estado');
  if (lcEstado) lcEstado.textContent = dados.uf;
  
  // Tipo (Empresa/Profissional/Contratante)
  const empProfi = document.querySelector('.empre_profi-text');
  if (empProfi) empProfi.textContent = dados.tipo;
  
  // Disponibilidade (apenas se existir)
  const disponibilidade = document.querySelector('.disponibilidade');
  if (disponibilidade) {
    if (dados.disponibilidade) {
      disponibilidade.style.display = 'flex';
      disponibilidade.querySelector('.disponi-text').textContent = dados.disponibilidade;
    } else {
      disponibilidade.style.display = 'none';
    }
  }
  
  // Projetos Concluídos (apenas se existir)
  const projetosConcluidos = document.querySelector('.projetos_concluidos');
  if (projetosConcluidos) {
    if (dados.projetosConcluidos !== null) {
      projetosConcluidos.style.display = 'flex';
      projetosConcluidos.querySelector('.projetos_concluidos-text').textContent = dados.projetosConcluidos;
    } else {
      projetosConcluidos.style.display = 'none';
    }
  }
  
  // Tempo de Experiência ou Idade da Empresa (apenas se existir)
  const tempoExperiencia = document.querySelector('.tempo_experiencia, .idade_empresa');
  if (tempoExperiencia) {
    const valor = dados.tempoExperiencia || dados.idadeEmpresa;
    if (valor !== null) {
      tempoExperiencia.style.display = 'flex';
      const textoElement = tempoExperiencia.querySelector('.tempo_experiencia-text, .idade_empresa-text');
      if (textoElement) {
        textoElement.textContent = `${valor} ${valor === 1 ? 'ano' : 'anos'}`;
      }
    } else {
      tempoExperiencia.style.display = 'none';
    }
  }
  
  // Contatos (apenas se existirem)
  document.querySelectorAll('.tl-numero, .telefone-numero').forEach(el => {
    if (dados.telefone) {
      el.textContent = dados.telefone;
      el.closest('.telefone, .button-telefone').style.display = 'flex';
    } else {
      el.closest('.telefone, .button-telefone').style.display = 'none';
    }
  });
  
  document.querySelectorAll('.email-text').forEach(el => {
    el.textContent = dados.email;
  });
  
  // Sobre o Profissional/Empresa (apenas se existir)
  const sobreProfissional = document.querySelector('.sobre_profissional');
  if (sobreProfissional) {
    if (dados.descricao) {
      sobreProfissional.style.display = 'block';
      const paragrafo = sobreProfissional.querySelector('p');
      if (paragrafo) paragrafo.textContent = dados.descricao;
    } else {
      sobreProfissional.style.display = 'none';
    }
  }
  
  // Redes Sociais (apenas se existirem)
  const instagram = document.querySelector('.instagram');
  if (instagram) {
    if (dados.instagram) {
      instagram.style.display = 'flex';
      const nomeIns = instagram.querySelector('.name_perfil-ins, .name_perfil-x');
      if (nomeIns) nomeIns.textContent = dados.instagram;
    } else {
      instagram.style.display = 'none';
    }
  }
  
  const facebook = document.querySelector('.facebook');
  if (facebook) {
    if (dados.facebook) {
      facebook.style.display = 'flex';
      const nomeFac = facebook.querySelector('.name_perfil-fac');
      if (nomeFac) nomeFac.textContent = dados.facebook;
    } else {
      facebook.style.display = 'none';
    }
  }
  
  const twitter = document.querySelector('.X');
  if (twitter) {
    if (dados.twitter) {
      twitter.style.display = 'flex';
      const nomeX = twitter.querySelector('.name_perfil-x');
      if (nomeX) nomeX.textContent = dados.twitter;
    } else {
      twitter.style.display = 'none';
    }
  }
  
  // Especialidades (apenas se existirem)
  const especialidadesContainer = document.querySelector('.especialidades');
  if (especialidadesContainer) {
    if (dados.skills && dados.skills.length > 0) {
      especialidadesContainer.style.display = 'block';
      especialidadesContainer.innerHTML = '<h3>Especialidades</h3>';
      
      dados.skills.forEach(skill => {
        const spanDiv = document.createElement('div');
        spanDiv.className = 'span-esp_op';
        spanDiv.innerHTML = `<span class="especialidade-op">${skill.nome || skill.name || skill}</span>`;
        especialidadesContainer.appendChild(spanDiv);
      });
    } else {
      especialidadesContainer.style.display = 'none';
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
  
  // Preencher estrelas
  const estrelas = document.querySelectorAll('.avaliacao-TCC .star, .avaliacao-BCC .star');
  estrelas.forEach((star, index) => {
    if (index < Math.floor(avaliacao)) {
      star.style.fill = 'currentColor';
    } else {
      star.style.fill = 'none';
    }
  });
  
  // Atualizar média de avaliação
  const avaliacaoBCC = document.querySelector('.avaliacao-BCC-text');
  if (avaliacaoBCC) {
    avaliacaoBCC.textContent = `${avaliacao.toFixed(1)}/5.0`;
  }
  
  // Carregar portfólio
  if (usuario.portfolios && usuario.portfolios.length > 0) {
    carregarPublicacoes(usuario.portfolios);
  } else {
    const publicacoesContainer = document.querySelector('.home-cards-post');
    if (publicacoesContainer) {
      publicacoesContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #6d6c7f;">Nenhuma publicação ainda.</p>';
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
      ? `${API_URL.replace('/api', '')}/storage/${portfolio.fotos[0].caminho}`
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

// ========== SISTEMA DE AVALIAÇÃO ==========
const ratingValue = document.getElementById("rating-value");
const radios = document.querySelectorAll("input[name='rate']");

if (ratingValue && radios.length > 0) {
  radios.forEach(r => {
    r.addEventListener("change", async () => {
      ratingValue.textContent = `Nota: ${r.value} de 5`;
      
      // Enviar avaliação para API
      try {
        const userId = getUserId();
        const token = getAuthToken();
        
        const response = await fetch(`${API_URL}/usuarios/${userId}/avaliar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            nota: parseInt(r.value)
          })
        });
        
        if (response.ok) {
          showToast('Avaliação enviada com sucesso!', 'success');
          // Recarregar perfil para atualizar média
          setTimeout(() => carregarPerfilUsuario(), 1000);
        }
      } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        showToast('Erro ao enviar avaliação', 'error');
      }
    });
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
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        
        setTimeout(() => {
          window.location.href = '/';
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
  console.log('🚀 Página de Perfil carregada');
  carregarPerfilUsuario();
});