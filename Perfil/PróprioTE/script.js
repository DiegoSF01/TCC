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
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle"></h3>
          <div class="modal-actions">
            <button class="editar-publicacao" id="editarPublicacao">Editar</button>
            <button class="modal-close" id="closeModal">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z"
                fill="#2e2d37"></path>
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
            <button class="cancelar_bottom" id="cancelarEditarPub">Cancelar</button>
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
    const cancelarEditarPub = document.getElementById('cancelarEditarPub');
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
    cancelarEditarPub.addEventListener('click', fecharEditorPublicacao);
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


const btn_editarper = document.querySelector('.btn-editar-perfil');
const fosco = document.querySelector('.fosco');

function abrirEditarPerfil() {
    fosco.classList.add('ativo');
}

const btn_fechar = document.querySelector('.cancelar_top');

function fecharEditarPerfil() {
    fosco.classList.remove('ativo');
}