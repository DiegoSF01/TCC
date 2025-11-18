const btn_sobre = document.getElementById('btn_navperfil-sobre');
const btn_postagens = document.getElementById('btn_navperfil-postagens');
const btn_avaliacao = document.getElementById('btn_navperfil-avaliacao');

const sessao_sobre = document.querySelector('.sobre');
const sessao_publicacoes = document.querySelector('.publicacoes');
const sessao_avaliacao = document.querySelector('.avaliacao');

function clicou_sobre() {
  if (!btn_sobre.classList.contains('ativo')) {
    document.querySelector('.button-navper.ativo').classList.remove('ativo');
    btn_sobre.classList.add('ativo');

    document.querySelector('.sessao').classList.remove('sessao');
    sessao_sobre.classList.add('sessao');
  }
}

function clicou_postagens() {
  if (!btn_postagens.classList.contains('ativo')) {
    document.querySelector('.button-navper.ativo').classList.remove('ativo');
    btn_postagens.classList.add('ativo');

    document.querySelector('.sessao').classList.remove('sessao');
    sessao_publicacoes.classList.add('sessao');
  }
}

function clicou_avaliacao() {
  if (!btn_avaliacao.classList.contains('ativo')) {
    document.querySelector('.button-navper.ativo').classList.remove('ativo');
    btn_avaliacao.classList.add('ativo');

    document.querySelector('.sessao').classList.remove('sessao');
    sessao_avaliacao.classList.add('sessao');
  }
}

btn_sobre.addEventListener('click', clicou_sobre);
btn_postagens.addEventListener('click', clicou_postagens);
btn_avaliacao.addEventListener('click', clicou_avaliacao);



// ============================================
// MODAL DE PUBLICAÇÕES - INTERFACE ATUALIZADA
// ============================================
window.addEventListener('load', function () {
  // Modal principal (visualização)
  const modalHTML = `
    <div class="modal-overlay" id="modalPublicacao">
      <div class="modal-content1">
        <div class="modal-header">
          <h3 id="modalTitle"></h3>
          <div class="modal-actions">
            <button class="editar-publicacao" id="editarPublicacao">Editar</button>
            <button class="modal-close" id="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
            </button>
          </div>
        </div>
        <div class="modal-body">
          <div class="modal-image-container">
            <button class="modal-nav-btn modal-prev" id="modalPrev">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div class="modal-image" id="modalImage"></div>
            <button class="modal-nav-btn modal-next" id="modalNext">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <div class="modal-image-counter" id="modalCounter">1 / 1</div>
          </div>
          <p class="modal-description" id="modalDescription"></p>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Modal de edição - NOVA INTERFACE
  const modalEditarHTML = `
    <div class="modal-add-publicacao-overlay" id="editarPublicacaoModal">
      <div class="modal-add-publicacao">
        <div class="map-header">
          <h2>Editar Publicação</h2>
          <button id="fecharEditarPub" class="map-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <div class="map-body">
          <label>Título</label>
          <input type="text" id="editarTitulo" placeholder="Ex: Casa Moderna Finalizada">

          <label>Descrição</label>
          <textarea id="editarDescricao" placeholder="Descreva o projeto..."></textarea>

          <label>Mídias (Fotos e Vídeos)</label>

          <label for="editarMidias" class="btn-upload-midia">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <circle cx="16" cy="8" r="2" stroke="#1C274C" stroke-width="1.5"></circle>
                <path
                  d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001"
                  stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
                <path
                  d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                  stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
              </g>
            </svg>
            Alterar foto/vídeo
          </label>

          <input type="file" id="editarMidias" accept="image/*,video/*" multiple>

          <div id="editarPreviewContainer" class="preview-container"></div>
        </div>

        <div class="map-footer">
          <button class="btn-secondary excluir-btn" id="ExcluirEditarPub">Excluir</button>
          <button class="adicionar" id="salvarEditarPub">Salvar alterações</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalEditarHTML);

  // Selecionar elementos principais
  const modal = document.getElementById('modalPublicacao');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDescription = document.getElementById('modalDescription');
  const closeModal = document.getElementById('closeModal');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  const modalCounter = document.getElementById('modalCounter');

  const editarBtn = document.getElementById('editarPublicacao');
  const editarModal = document.getElementById('editarPublicacaoModal');
  const fecharEditarPub = document.getElementById('fecharEditarPub');
  const excluirEditarPub = document.getElementById('ExcluirEditarPub');
  const salvarEditarPub = document.getElementById('salvarEditarPub');
  const editarMidiasInput = document.getElementById('editarMidias');
  const editarPreviewContainer = document.getElementById('editarPreviewContainer');

  let cardAtivo = null;
  let arquivosEditarSelecionados = [];
  let imagensAtivas = [];
  let indiceImagemAtual = 0;

  // Abrir modal de publicação
  function abrirModal(card) {
    cardAtivo = card;
    const titulo = card.querySelector('h4').textContent;
    const descricao = card.querySelector('p').textContent;
    
    // Coletar todas as imagens do card (por enquanto só uma, mas preparado para múltiplas)
    const imgElement = card.querySelector('.img-card_publicacoes');
    const imagemBg = window.getComputedStyle(imgElement).backgroundImage;
    const imagemUrl = imagemBg.replace(/url\(["']?|["']?\)/g, '');
    
    // Armazenar array de imagens (futuramente você pode adicionar mais)
    imagensAtivas = [imagemUrl];
    indiceImagemAtual = 0;
  
    modalTitle.textContent = titulo;
    modalDescription.textContent = descricao;
    
    atualizarImagemModal();
    atualizarBotoesNavegacao();
  
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Atualizar imagem exibida no modal
  function atualizarImagemModal() {
    const imagemAtual = imagensAtivas[indiceImagemAtual];
    modalImage.style.backgroundImage = `url('${imagemAtual}')`;
    modalImage.style.backgroundSize = 'cover';
    modalImage.style.backgroundPosition = 'center';
    modalCounter.textContent = `${indiceImagemAtual + 1} / ${imagensAtivas.length}`;
  }

  // Atualizar visibilidade dos botões de navegação
  function atualizarBotoesNavegacao() {
    if (imagensAtivas.length <= 1) {
      modalPrev.style.display = 'none';
      modalNext.style.display = 'none';
      modalCounter.style.display = 'none';
    } else {
      modalPrev.style.display = 'flex';
      modalNext.style.display = 'flex';
      modalCounter.style.display = 'block';

      // Desabilitar botões nos extremos
      modalPrev.disabled = indiceImagemAtual === 0;
      modalNext.disabled = indiceImagemAtual === imagensAtivas.length - 1;
    }
  }

  // Navegação de imagens
  function mostrarImagemAnterior() {
    if (indiceImagemAtual > 0) {
      indiceImagemAtual--;
      atualizarImagemModal();
      atualizarBotoesNavegacao();
    }
  }

  function mostrarProximaImagem() {
    if (indiceImagemAtual < imagensAtivas.length - 1) {
      indiceImagemAtual++;
      atualizarImagemModal();
      atualizarBotoesNavegacao();
    }
  }

  // Fechar modal principal
  function fecharModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Abrir editor
  function abrirEditorPublicacao() {
    document.getElementById('editarTitulo').value = modalTitle.textContent;
    document.getElementById('editarDescricao').value = modalDescription.textContent;

    // Limpar preview anterior
    editarPreviewContainer.innerHTML = '';
    arquivosEditarSelecionados = [];

    // Adicionar imagem atual ao preview
    const bg = modalImage.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
    if (bg && bg !== 'none') {
      const previewItem = document.createElement("div");
      previewItem.classList.add("preview-item");
      previewItem.innerHTML = `
        <img src="${bg}" alt="Preview">
        <button type="button" class="preview-remove">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      `;
      editarPreviewContainer.appendChild(previewItem);

      previewItem.querySelector('.preview-remove').addEventListener('click', () => {
        previewItem.remove();
      });
    }

    editarModal.classList.add('active');
  }

  // Fechar editor
  function fecharEditorPublicacao() {
    editarModal.classList.remove('active');
    editarPreviewContainer.innerHTML = '';
    arquivosEditarSelecionados = [];
    editarMidiasInput.value = '';
  }

  // Excluir publicação
  function excluirEditorPublicacao() {
    if (!cardAtivo) return;

    if (confirm('Tem certeza que deseja excluir esta publicação?')) {
      cardAtivo.remove();
      cardAtivo = null;
      fecharEditorPublicacao();
      fecharModal();
      document.body.style.overflow = 'auto';
    }
  }

  // Salvar alterações
  function salvarAlteracoesPublicacao() {
    const novoTitulo = document.getElementById('editarTitulo').value.trim();
    const novaDescricao = document.getElementById('editarDescricao').value.trim();

    if (!novoTitulo) {
      alert('Por favor, adicione um título');
      return;
    }

    if (cardAtivo) {
      if (novoTitulo) cardAtivo.querySelector('h4').textContent = novoTitulo;
      if (novaDescricao) cardAtivo.querySelector('p').textContent = novaDescricao;

      // Atualizar imagem se houver preview
      const firstPreview = editarPreviewContainer.querySelector('img');
      if (firstPreview) {
        const imgElement = cardAtivo.querySelector('.img-card_publicacoes');
        imgElement.style.backgroundImage = `url('${firstPreview.src}')`;

        // Atualizar modal principal
        modalImage.style.backgroundImage = `url('${firstPreview.src}')`;
      }
    }

    modalTitle.textContent = novoTitulo;
    modalDescription.textContent = novaDescricao;

    fecharEditorPublicacao();
  }

  // Preview de mídias no editor
  editarMidiasInput.addEventListener("change", () => {
    const arquivos = Array.from(editarMidiasInput.files);

    arquivos.forEach(arquivo => {
      arquivosEditarSelecionados.push(arquivo);
      criarPreviewEditar(arquivo);
    });

    editarMidiasInput.value = "";
  });

  function criarPreviewEditar(arquivo) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const previewItem = document.createElement("div");
      previewItem.classList.add("preview-item");

      let midia;

      if (arquivo.type.startsWith("image/")) {
        midia = document.createElement("img");
      } else if (arquivo.type.startsWith("video/")) {
        midia = document.createElement("video");
        midia.controls = true;
      }

      midia.src = e.target.result;

      const btnRemover = document.createElement("button");
      btnRemover.classList.add("preview-remove");
      btnRemover.type = "button";
      btnRemover.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      `;

      btnRemover.addEventListener("click", () => {
        previewItem.remove();
        arquivosEditarSelecionados = arquivosEditarSelecionados.filter(a => a !== arquivo);
      });

      previewItem.appendChild(midia);
      previewItem.appendChild(btnRemover);
      editarPreviewContainer.appendChild(previewItem);
    };

    reader.readAsDataURL(arquivo);
  }

  // Eventos
  closeModal.addEventListener('click', fecharModal);
  editarBtn.addEventListener('click', abrirEditorPublicacao);
  fecharEditarPub.addEventListener('click', fecharEditorPublicacao);
  excluirEditarPub.addEventListener('click', excluirEditorPublicacao);
  salvarEditarPub.addEventListener('click', salvarAlteracoesPublicacao);

  // Eventos de navegação de imagens
  modalPrev.addEventListener('click', mostrarImagemAnterior);
  modalNext.addEventListener('click', mostrarProximaImagem);

  // Navegação com teclado (setas)
  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active') && !editarModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') mostrarImagemAnterior();
      if (e.key === 'ArrowRight') mostrarProximaImagem();
    }
  });

  // Fechar modal ao clicar fora
  modal.addEventListener('click', e => {
    if (e.target === modal) fecharModal();
  });
  editarModal.addEventListener('click', e => {
    if (e.target === editarModal) fecharEditorPublicacao();
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (editarModal.classList.contains('active')) fecharEditorPublicacao();
      else if (modal.classList.contains('active')) fecharModal();
    }
  });

  // Clicar nos cards abre o modal
  const cardsPublicacoes = document.querySelectorAll('.card-publicacoes');
  cardsPublicacoes.forEach(card => {
    card.addEventListener('click', function () {
      abrirModal(this);
    });
  });
});

const btnAddPost = document.querySelector('.btn-add-post');
const modalAddPub = document.getElementById('modalAddPub');

function abrirAddPub() {
  modalAddPub.classList.add('active');
}

btnAddPost.addEventListener('click', abrirAddPub);

document.getElementById('fecharAddPub').addEventListener('click', () => {
  modalAddPub.classList.remove('active');
});

document.getElementById('cancelarAddPub').addEventListener('click', () => {
  modalAddPub.classList.remove('active');
});

const inputMidias = document.getElementById("pubMidias");
const previewContainer = document.getElementById("previewContainer");

let arquivosSelecionados = [];

// Quando o usuário seleciona arquivos:
inputMidias.addEventListener("change", () => {
  const arquivos = Array.from(inputMidias.files);

  arquivos.forEach(arquivo => {
    arquivosSelecionados.push(arquivo);
    criarPreview(arquivo);
  });

  // Limpa o input para permitir selecionar o mesmo arquivo novamente, se quiser
  inputMidias.value = "";
});

function criarPreview(arquivo) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const previewItem = document.createElement("div");
    previewItem.classList.add("preview-item");

    let midia;

    if (arquivo.type.startsWith("image/")) {
      midia = document.createElement("img");
    } else if (arquivo.type.startsWith("video/")) {
      midia = document.createElement("video");
      midia.controls = true;
    }

    midia.src = e.target.result;

    // Botão para remover a mídia
    const btnRemover = document.createElement("button");
    btnRemover.classList.add("preview-remove");
    btnRemover.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

    btnRemover.addEventListener("click", () => {
      previewItem.remove();
      arquivosSelecionados = arquivosSelecionados.filter(a => a !== arquivo);
    });

    previewItem.appendChild(midia);
    previewItem.appendChild(btnRemover);
    previewContainer.appendChild(previewItem);
  };

  reader.readAsDataURL(arquivo);
}



class ProfileEditor {
  constructor() {
    this.specialties = [];
    this.initElements();
    this.attachEventListeners();
  }

  initElements() {
    // Inputs
    this.nameInput = document.getElementById('name');
    this.professionInput = document.getElementById('profession');
    this.cepInput = document.getElementById('cep');
    this.projectsInput = document.getElementById('projects');
    this.experienceInput = document.getElementById('experience');
    this.aboutInput = document.getElementById('about');
    this.specialtyInput = document.getElementById('specialtyInput');
    this.phoneInput = document.getElementById('phone');
    this.emailInput = document.getElementById('email');
    this.instagramInput = document.getElementById('instagram');
    this.facebookInput = document.getElementById('facebook');
    this.twitterInput = document.getElementById('twitter');

    const phoneInput = document.getElementById("phone");

    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

      // Limita a 11 dígitos
      if (value.length > 11) value = value.slice(0, 11);

      // Aplica a máscara progressivamente
      if (value.length > 0) {
        value = "(" + value;
      }
      if (value.length > 3) {
        value = value.slice(0, 3) + ") " + value.slice(3);
      }
      if (value.length > 10) {
        value = value.slice(0, 10) + "-" + value.slice(10);
      }

      e.target.value = value;
    });

    const cepInput = document.getElementById("cep");

    cepInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

      // Limita a 8 dígitos
      if (value.length > 8) value = value.slice(0, 8);

      // Aplica a máscara dinamicamente
      if (value.length > 5) {
        value = value.slice(0, 5) + "-" + value.slice(5);
      }

      e.target.value = value;
    });

    // File inputs
    this.profilePhotoInput = document.getElementById('profilePhotoInput');
    this.backgroundPhotoInput = document.getElementById('backgroundPhotoInput');

    // Display elements
    this.avatar = document.getElementById('avatarImage');
    this.bannerImage = document.getElementById('bannerImage');
    this.specialtiesContainer = document.getElementById('specialtiesContainer');

    // Buttons
    this.addSpecialtyBtn = document.getElementById('addSpecialtyBtn');
    this.cancelBtn = document.getElementById('cancelBtn');
    this.closeBtn = document.getElementById('closeBtn');
    this.profileForm = document.getElementById('profileForm');
    this.modalOverlay = document.getElementById('modalOverlay');
  }

  attachEventListeners() {
    // File upload handlers
    this.profilePhotoInput.addEventListener('change', (e) => this.handleProfilePhotoChange(e));
    this.backgroundPhotoInput.addEventListener('change', (e) => this.handleBackgroundPhotoChange(e));

    // Specialty handlers
    this.addSpecialtyBtn.addEventListener('click', () => this.addSpecialty());
    this.specialtyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addSpecialty();
      }
    });

    // Form handlers
    this.profileForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.cancelBtn.addEventListener('click', () => this.closeModal());
    this.closeBtn.addEventListener('click', () => this.closeModal());
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) this.closeModal();
    });
  }

  handleProfilePhotoChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.avatar.style.backgroundImage = `url(${reader.result})`;
      };
      reader.readAsDataURL(file);
    }
  }

  handleBackgroundPhotoChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.bannerImage.style.backgroundImage = `url(${reader.result})`;
      };
      reader.readAsDataURL(file);
    }
  }

  addSpecialty() {
    const value = this.specialtyInput.value.trim();
    if (value) {
      this.specialties.push(value);
      this.specialtyInput.value = '';
      this.renderSpecialties();
    }
  }

  removeSpecialty(index) {
    this.specialties.splice(index, 1);
    this.renderSpecialties();
  }

  renderSpecialties() {
    this.specialtiesContainer.innerHTML = '';
    this.specialties.forEach((specialty, index) => {
      const tag = document.createElement('div');
      tag.className = 'specialty-tag';
      tag.innerHTML = `
              ${specialty}
              <button type="button" aria-label="Remover ${specialty}">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
              </button>
          `;
      tag.querySelector('button').addEventListener('click', () => this.removeSpecialty(index));
      this.specialtiesContainer.appendChild(tag);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = {
      name: this.nameInput.value,
      profession: this.professionInput.value,
      cep: this.cepInput.value,
      projects: this.projectsInput.value,
      experience: this.experienceInput.value,
      about: this.aboutInput.value,
      specialties: this.specialties,
      phone: this.phoneInput.value,
      email: this.emailInput.value,
      instagram: this.instagramInput.value,
      facebook: this.facebookInput.value,
      twitter: this.twitterInput.value,
    };
    console.log('Dados do perfil:', formData);
    alert('Perfil salvo com sucesso!');
    this.closeModal();
  }

  closeModal() {
    this.modalOverlay.style.display = 'none';
  }

  openModal() {
    this.modalOverlay.style.display = 'flex';
  }
}

const btn_editarper = document.querySelector('.btn-editar-perfil');

// Abrir modal de edição de perfil
btn_editarper.addEventListener('click', () => {
  profileEditor.openModal();
});


// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.profileEditor = new ProfileEditor();
});

// Abrir modal de editar perfil
const editarPerfilBtn = document.querySelector('.btn-editar-perfil');
const modalPerfil = document.getElementById('modalPerfil');
const cancelBtn = document.getElementById('cancelBtn');

editarPerfilBtn.addEventListener('click', () => {
  modalPerfil.classList.add('active');
});

// Botão cancelar fecha o modal
cancelBtn.addEventListener('click', () => {
  modalPerfil.classList.remove('active');
});

// Fechar clicando fora do modal
modalPerfil.addEventListener('click', (e) => {
  if (e.target === modalPerfil) {
    modalPerfil.classList.remove('active');
  }
});

function maskCEP(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .substring(0, 9);
}

const addEspecialidadeBtn = document.getElementById('addEspecialidadeBtn');
const especialidadesList = document.getElementById('especialidadesList');
// o input onde usuário digita a especialidade
const especialidadeInput = document.getElementById('especialidadeInput');
// campo hidden para enviar no form (opcional — coloque este input hidden no HTML se quiser enviar)
const especialidadesHidden = document.getElementById('especialidadesHidden');

let especialidades = [];

// atualiza campo hidden (se existir)
function updateHiddenField() {
  if (especialidadesHidden) {
    especialidadesHidden.value = JSON.stringify(especialidades);
  }
}

// Função de adicionar especialidade (mantive sua lógica)
function addEspecialidade() {
  if (!especialidadeInput) return;
  const value = especialidadeInput.value.trim();

  if (value === '') {
    showToast('Digite uma especialidade', 'error');
    return;
  }

  if (especialidades.includes(value)) {
    showToast('Especialidade já adicionada', 'error');
    return;
  }

  especialidades.push(value);
  renderEspecialidades();
  updateHiddenField();
  especialidadeInput.value = '';
  // opcional: focar no input novamente
  especialidadeInput.focus();
}

// Remover especialidade
function removeEspecialidade(index) {
  especialidades.splice(index, 1);
  renderEspecialidades();
  updateHiddenField();
}


function renderEspecialidades() {
  if (!especialidadesList) return;
  especialidadesList.innerHTML = '';

  especialidades.forEach((especialidade, index) => {
    const tag = document.createElement('div');
    tag.className = 'especialidade-tag';
    tag.innerHTML = `
        <span>${especialidade}</span>
        <button type="button" class="remove-tag-btn" data-index="${index}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
    especialidadesList.appendChild(tag);
  });

  const buttons = especialidadesList.querySelectorAll('.remove-tag-btn');
  buttons.forEach(btn => {
    btn.removeEventListener('click', handleRemoveClick);
    btn.addEventListener('click', handleRemoveClick);
  });
}

function handleRemoveClick(e) {
  const idx = Number(e.currentTarget.getAttribute('data-index'));
  if (!isNaN(idx)) removeEspecialidade(idx);
}

window.removeEspecialidade = removeEspecialidade;

if (addEspecialidadeBtn) {
  addEspecialidadeBtn.addEventListener('click', addEspecialidade);
}

if (especialidadeInput) {
  especialidadeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEspecialidade();
    }
  });
}

function loadMockData() {
  especialidades = ['Design', 'Branding', 'UI/UX'];
  renderEspecialidades();
  updateHiddenField();
}

loadMockData();

const empresaInput = document.getElementById("empresaAreaInput");
const empresaHidden = document.getElementById("empresaArea");
const empresaOptions = document.getElementById("empresaAreaOptions");

// Mostrar lista ao focar
empresaInput.addEventListener("focus", () => {
  empresaOptions.classList.remove("hidden");
});

// Filtrar ao digitar
empresaInput.addEventListener("input", () => {
  const filter = empresaInput.value.toLowerCase();

  Array.from(empresaOptions.children).forEach(li => {
    const text = li.textContent.toLowerCase();
    li.style.display = text.includes(filter) ? "block" : "none";
  });
});

// Selecionar item
empresaOptions.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const value = e.target.dataset.value;
    const label = e.target.textContent;

    empresaInput.value = label;   // Mostra texto
    empresaHidden.value = value;  // Envia valor real

    empresaOptions.classList.add("hidden");
  }
});

// Fechar ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchable-select")) {
    empresaOptions.classList.add("hidden");
  }
});
