// ==========================================
// SCRIPT PERFIL ACESSADO - CORRIGIDO
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
    console.log('🔵 Carregando perfil visitado...');
    
    // Tentar pegar do localStorage
    const perfilSalvo = localStorage.getItem('perfilVisitado');
    
    if (!perfilSalvo) {
      console.error('❌ Nenhum perfil encontrado no localStorage');
      showToast('Perfil não encontrado', 'error');
      setTimeout(() => window.location.href = '../../../Home/index.html', 2000);
      return;
    }
    
    const usuario = JSON.parse(perfilSalvo);
    console.log('✅ Dados do perfil:', usuario);
    
    preencherPerfil(usuario);
    await carregarPublicacoes(usuario.id);
    configurarFavoritos(usuario.id);
    
  } catch (error) {
    console.error('❌ Erro ao carregar perfil:', error);
    showToast('Erro ao carregar perfil', 'error');
    setTimeout(() => window.location.href = '../../../Home/index.html', 2000);
  }
}

// ========== CONFIGURAR BOTÃO DE FAVORITOS ==========
function configurarFavoritos(userId) {
  const btnFavorito = document.querySelector('.add_remove-favoritos');
  const svg = btnFavorito?.querySelector('svg');
  
  if (!btnFavorito) return;
  
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  const isFavorito = favoritos.includes(userId);
  
  // Estado inicial
  if (isFavorito && svg) {
    svg.setAttribute('fill', '#ef4343');
  }
  
  // Evento de clique
  btnFavorito.addEventListener('click', () => {
    const favoritosAtuais = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const index = favoritosAtuais.indexOf(userId);
    
    if (index > -1) {
      favoritosAtuais.splice(index, 1);
      if (svg) svg.setAttribute('fill', 'none');
      showToast('Removido dos favoritos', 'success');
    } else {
      favoritosAtuais.push(userId);
      if (svg) svg.setAttribute('fill', '#ef4343');
      showToast('Adicionado aos favoritos', 'success');
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritosAtuais));
  });
}

// ========== PREENCHER DADOS DO PERFIL ==========
function preencherPerfil(usuario) {
  console.log('🔵 Preenchendo perfil:', usuario);
  
  let dados = {};
  
  // ===== EXTRAIR DADOS CONFORME TIPO =====
  if (usuario.type === 'prestador' && usuario.prestador) {
    dados = {
      nome: usuario.prestador.nome || 'Nome não informado',
      profissao: usuario.ramo?.nome || 'Profissão não informada',
      cidade: usuario.prestador.localidade || 'Cidade não informada',
      uf: usuario.prestador.uf || 'UF',
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
      disponibilidade: usuario.prestador.disponibilidade || 'Não informada'
    };
  } else if (usuario.type === 'empresa' && usuario.empresa) {
    dados = {
      nome: usuario.empresa.razao_social || 'Empresa não informada',
      profissao: usuario.categoria?.nome || 'Categoria não informada',
      cidade: usuario.empresa.localidade || 'Cidade não informada',
      uf: usuario.empresa.uf || 'UF',
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
      foto: usuario.contratante.foto,
      capa: null,
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
      disponibilidade: 'Disponível'
    };
  }
  
  // ===== PREENCHER ELEMENTOS =====
  
  // Foto de capa
  const imgFundo = document.querySelector('.img-fundo');
  if (dados.capa) {
    imgFundo.style.backgroundImage = `url('${dados.capa}')`;
    imgFundo.style.backgroundSize = 'cover';
    imgFundo.style.backgroundPosition = 'center';
  } else {
    imgFundo.style.background = 'linear-gradient(135deg, #0049ff 0%,  #0049ff 100%)';
  }
  
  // Foto de perfil
  const fotoPerfil = document.querySelector('.foto-perfil');
  if (dados.foto) {
    fotoPerfil.style.backgroundImage = `url('${dados.foto}')`;
    fotoPerfil.style.backgroundSize = 'cover';
    fotoPerfil.style.backgroundPosition = 'center';
    fotoPerfil.innerHTML = '';
  } else {
    fotoPerfil.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    fotoPerfil.innerHTML = `<span style="color: white; font-size: 48px; font-weight: bold;">${dados.nome.charAt(0).toUpperCase()}</span>`;
    fotoPerfil.style.display = 'flex';
    fotoPerfil.style.alignItems = 'center';
    fotoPerfil.style.justifyContent = 'center';
  }
  
  // Nome e profissão
  document.querySelector('.nome-perfil').textContent = dados.nome;
  document.querySelector('.profissao').textContent = dados.profissao;
  
  // Localização
  document.querySelector('.lc-cidade').textContent = dados.cidade;
  document.querySelector('.lc-estado').textContent = dados.uf;
  
  // Tipo
  document.querySelector('.empre_profi-text').textContent = dados.tipo;
  
  // Disponibilidade
  const disponiElement = document.querySelector('.disponi-text');
  if (disponiElement) {
    disponiElement.textContent = dados.disponibilidade;
  }
  
  // Telefone
  if (dados.telefone) {
    document.querySelectorAll('.tl-numero, .telefone-numero').forEach(el => {
      el.textContent = dados.telefone;
    });
    document.querySelectorAll('.telefone, .button-telefone').forEach(el => {
      el.style.display = 'flex';
    });
  } else {
    document.querySelectorAll('.telefone, .button-telefone').forEach(el => {
      el.style.display = 'none';
    });
  }
  
  // Email
  document.querySelectorAll('.email-text').forEach(el => {
    el.textContent = dados.email;
  });
  
  // Sobre (bio)
  const sobreProfissional = document.querySelector('.sobre_profissional');
  const paragrafo = sobreProfissional.querySelector('p');
  if (dados.descricao) {
    paragrafo.textContent = dados.descricao;
    paragrafo.style.color = '';
    paragrafo.style.fontStyle = '';
  } else {
    paragrafo.textContent = 'Este usuário ainda não adicionou uma descrição.';
    paragrafo.style.color = '#999';
    paragrafo.style.fontStyle = 'italic';
  }
  
  // Redes sociais
  const instagram = document.querySelector('.instagram');
  if (dados.instagram) {
    instagram.style.display = 'flex';
    instagram.querySelector('.name_perfil-ins').textContent = dados.instagram;
  } else {
    instagram.style.display = 'none';
  }
  
  const facebook = document.querySelector('.facebook');
  if (dados.facebook) {
    facebook.style.display = 'flex';
    facebook.querySelector('.name_perfil-fac').textContent = dados.facebook;
  } else {
    facebook.style.display = 'none';
  }
  
  const twitter = document.querySelector('.X');
  if (dados.twitter) {
    twitter.style.display = 'flex';
    twitter.querySelector('.name_perfil-x').textContent = dados.twitter;
  } else {
    twitter.style.display = 'none';
  }
  
  // Projetos concluídos
  const projetosConcluidos = document.querySelector('.projetos_concluidos');
  if (dados.projetosConcluidos !== null) {
    projetosConcluidos.style.display = 'flex';
    projetosConcluidos.querySelector('.projetos_concluidos-text').textContent = dados.projetosConcluidos;
  } else {
    projetosConcluidos.style.display = 'none';
  }
  
  // Tempo de experiência ou idade da empresa
  const tempoExperiencia = document.querySelector('.tempo_experiencia');
  const valor = dados.tempoExperiencia || dados.idadeEmpresa;
  if (valor !== null && tempoExperiencia) {
    tempoExperiencia.style.display = 'flex';
    const textoElement = tempoExperiencia.querySelector('.tempo_experiencia-text');
    if (textoElement) {
      textoElement.textContent = `${valor} ${valor === 1 ? 'ano' : 'anos'}`;
    }
    // Mudar label se for empresa
    if (dados.idadeEmpresa) {
      const label = tempoExperiencia.querySelector('p');
      if (label) label.textContent = 'Idade da Empresa';
    }
  } else if (tempoExperiencia) {
    tempoExperiencia.style.display = 'none';
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
  
  // Avaliação média no card inferior
  const avaliacaoBCC = document.querySelector('.avaliacao-BCC-text');
  if (avaliacaoBCC) {
    avaliacaoBCC.textContent = `${avaliacao.toFixed(1)}/5.0`;
  }
  
  // Especialidades/Skills
  const especialidadesContainer = document.querySelector('.especialidades');
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
  
  console.log('✅ Perfil preenchido com sucesso');
}

// ========== CARREGAR PUBLICAÇÕES ==========
async function carregarPublicacoes(userId) {
  try {
    console.log('🔵 Carregando publicações do usuário:', userId);
    
    const response = await fetch(`${API_URL}/publicacoes?usuario_id=${userId}`);
    
    if (!response.ok) {
      console.warn('⚠️ Erro ao buscar publicações');
      mostrarMensagemSemPublicacoes();
      return;
    }
    
    const data = await response.json();
    const publicacoes = Array.isArray(data) ? data : (data.data || data.publicacoes || []);
    
    console.log('✅ Publicações encontradas:', publicacoes.length);
    
    if (publicacoes.length === 0) {
      mostrarMensagemSemPublicacoes();
      return;
    }
    
    renderizarPublicacoes(publicacoes);
    
  } catch (error) {
    console.error('❌ Erro ao carregar publicações:', error);
    mostrarMensagemSemPublicacoes();
  }
}

function mostrarMensagemSemPublicacoes() {
  const publicacoesContainer = document.querySelector('.publicacoes');
  publicacoesContainer.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #999;">
      <p style="font-size: 18px;">Este usuário ainda não fez nenhuma publicação.</p>
    </div>
  `;
}

function renderizarPublicacoes(publicacoes) {
  const publicacoesContainer = document.querySelector('.publicacoes');
  publicacoesContainer.innerHTML = '';
  
  publicacoes.forEach(pub => {
    const card = document.createElement('div');
    card.className = 'card-publicacoes';
    
    const imagem = pub.imagens?.[0] || pub.imagem || null;
    
    card.innerHTML = `
      ${imagem ? `<div class="img-card_publicacoes" style="background-image: url('${imagem}'); background-size: cover; background-position: center;"></div>` : ''}
      <div class="mini-informacoes-card_publicacoes">
        <h4>${pub.titulo || 'Sem título'}</h4>
        <p>${pub.descricao || 'Sem descrição'}</p>
        ${pub.data_publicacao ? `<small style="color: #999; margin-top: 8px; display: block;">Publicado em ${new Date(pub.data_publicacao).toLocaleDateString('pt-BR')}</small>` : ''}
      </div>
    `;
    
    publicacoesContainer.appendChild(card);
  });
}

// ========== CONFIGURAR SISTEMA DE AVALIAÇÃO ==========
function configurarAvaliacoes() {
  const radioInputs = document.querySelectorAll('input[name="rate"]');
  const ratingValue = document.getElementById('rating-value');
  
  radioInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const nota = e.target.value;
      ratingValue.textContent = `Nota: ${nota} de 5`;
    });
  });
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Página de Perfil Acessado carregada');
  carregarPerfilUsuario();
  configurarAvaliacoes();
});