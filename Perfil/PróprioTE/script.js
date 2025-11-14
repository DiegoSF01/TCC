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
// MODAL DE PUBLICAÇÕES
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
          <div class="modal-image" id="modalImage"></div>
          <p class="modal-description" id="modalDescription"></p>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Modal de edição
  const modalEditarHTML = `
    <div class="fundo-fosco" id="editarPublicacaoModal">
      <div class="editar-publicacao-container">
        <div class="ep-top">
          <h2>Editar publicação</h2>
          <button class="cancelar_top" id="fecharEditarPub">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z"
                fill="#2e2d37"></path>
            </svg>
          </button>
        </div>

        <div class="ep-form">
          <label>Título</label>
          <input type="text" id="editarTitulo">

          <label>Descrição</label>
          <textarea id="editarDescricao"></textarea>

          <label>Imagem (URL)</label>
          <input type="text" id="editarImagem">

          <div class="line-edi"></div>

          <div class="buttons-edi">
            <button class="Excluir" id="ExcluirEditarPub">Excluir</button>
            <button class="salvar-alteracoes" id="salvarEditarPub">Salvar alterações</button>
          </div>
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

  const editarBtn = document.getElementById('editarPublicacao');
  const editarModal = document.getElementById('editarPublicacaoModal');
  const fecharEditarPub = document.getElementById('fecharEditarPub');
  const excluirEditarPub = document.getElementById('ExcluirEditarPub');
  const salvarEditarPub = document.getElementById('salvarEditarPub');

  let cardAtivo = null; // referência do card aberto

  // Abrir modal de publicação
  function abrirModal(card) {
    cardAtivo = card;
    const titulo = card.querySelector('h4').textContent;
    const descricao = card.querySelector('p').textContent;
    const imgElement = card.querySelector('.img-card_publicacoes');
    const imagemBg = window.getComputedStyle(imgElement).backgroundImage;

    modalTitle.textContent = titulo;
    modalDescription.textContent = descricao;
    modalImage.style.backgroundImage = imagemBg;
    modalImage.style.backgroundSize = 'cover';
    modalImage.style.backgroundPosition = 'center';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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
    const bg = modalImage.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
    document.getElementById('editarImagem').value = bg;

    editarModal.classList.add('active');
  }

  // Fechar editor
  function fecharEditorPublicacao() {
    editarModal.classList.remove('active');
  }

  // ===============================
  // EXCLUIR PUBLICAÇÃO
  // ===============================
  function excluirEditorPublicacao() {
    if (!cardAtivo) return;

    // Remove o card da página
    cardAtivo.remove();
    cardAtivo = null;

    // Fecha os dois modais
    fecharEditorPublicacao();
    fecharModal();

    // Libera scroll da página
    document.body.style.overflow = 'auto';
  }


  // Salvar alterações
  function salvarAlteracoesPublicacao() {
    const novoTitulo = document.getElementById('editarTitulo').value.trim();
    const novaDescricao = document.getElementById('editarDescricao').value.trim();
    const novaImagem = document.getElementById('editarImagem').value.trim();

    if (cardAtivo) {
      if (novoTitulo) cardAtivo.querySelector('h4').textContent = novoTitulo;
      if (novaDescricao) cardAtivo.querySelector('p').textContent = novaDescricao;
      if (novaImagem) {
        const imgElement = cardAtivo.querySelector('.img-card_publicacoes');
        imgElement.style.backgroundImage = `url('${novaImagem}')`;
      }
    }

    // Atualiza o modal principal também
    modalTitle.textContent = novoTitulo;
    modalDescription.textContent = novaDescricao;
    modalImage.style.backgroundImage = `url('${novaImagem}')`;

    fecharEditorPublicacao();
  }

  // Eventos
  closeModal.addEventListener('click', fecharModal);
  editarBtn.addEventListener('click', abrirEditorPublicacao);
  fecharEditarPub.addEventListener('click', fecharEditorPublicacao);
  excluirEditarPub.addEventListener('click', excluirEditorPublicacao);
  salvarEditarPub.addEventListener('click', salvarAlteracoesPublicacao);

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
