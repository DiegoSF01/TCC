const btn_sobre = document.getElementById('btn_navperfil-sobre');
const btn_postagens = document.getElementById('btn_navperfil-postagens');
const btn_avaliacao = document.getElementById('btn_navperfil-avaliacao');

const sessao_sobre = document.querySelector('.sobre');
const sessao_publicacoes = document.querySelector('.publicacoes');
const sessao_avaliacao = document.querySelector('.avaliacao');

const btn_favoritos = document.querySelector('.add_remove-favoritos');

function add_remove_fav(){
    if(btn_favoritos.classList.contains('ativo') == false){
        btn_favoritos.classList.add('ativo');
    }else{
        btn_favoritos.classList.remove('ativo');
    }
}

btn_favoritos.addEventListener('click', add_remove_fav);

function clicou_sobre(){
    if(btn_sobre.classList.contains('ativo') == false){
        document.querySelector('.button-navper.ativo').classList.remove('ativo');
        btn_sobre.classList.add('ativo');

        document.querySelector('.sessao').classList.remove('sessao');
        sessao_sobre.classList.add('sessao');
    }
}

function clicou_postagens(){
    if(btn_postagens.classList.contains('ativo') == false){
        document.querySelector('.button-navper.ativo').classList.remove('ativo');
        btn_postagens.classList.add('ativo');

        document.querySelector('.sessao').classList.remove('sessao');
        sessao_publicacoes.classList.add('sessao');
    }
}

function clicou_avaliacao(){
    if(btn_avaliacao.classList.contains('ativo') == false){
        document.querySelector('.button-navper.ativo').classList.remove('ativo');
        btn_avaliacao.classList.add('ativo');

        document.querySelector('.sessao').classList.remove('sessao');
        sessao_avaliacao.classList.add('sessao');
    }
}

btn_sobre.addEventListener('click', clicou_sobre);
btn_postagens.addEventListener('click', clicou_postagens);
btn_avaliacao.addEventListener('click', clicou_avaliacao);


// Modal de Publicações - Executar após o DOM carregar completamente
window.addEventListener('load', function() {
  // Criar o modal
  const modalHTML = `
    <div class="modal-overlay" id="modalPublicacao">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle"></h3>
          <button class="modal-close" id="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-image" id="modalImage"></div>
          <p class="modal-description" id="modalDescription"></p>
        </div>
      </div>
    </div>
  `;

  // Adicionar modal ao body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Selecionar elementos do modal
  const modal = document.getElementById('modalPublicacao');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDescription = document.getElementById('modalDescription');
  const closeModal = document.getElementById('closeModal');
  
  // Função para abrir o modal
  function abrirModal(card) {
    // Pegar informações do card
    const titulo = card.querySelector('h4').textContent;
    const descricao = card.querySelector('p').textContent;
    const imgElement = card.querySelector('.img-card_publicacoes');
    const imagemBg = window.getComputedStyle(imgElement).backgroundImage;

    // Preencher modal
    modalTitle.textContent = titulo;
    modalDescription.textContent = descricao;
    modalImage.style.backgroundImage = imagemBg;
    modalImage.style.backgroundSize = 'cover';
    modalImage.style.backgroundPosition = 'center';

    // Abrir modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Função para fechar o modal
  function fecharModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Adicionar evento de clique em cada card de publicação
  const cardsPublicacoes = document.querySelectorAll('.card-publicacoes');
  cardsPublicacoes.forEach(card => {
    card.addEventListener('click', function() {
      abrirModal(this);
    });
  });

  // Fechar modal ao clicar no botão X
  closeModal.addEventListener('click', fecharModal);

  // Fechar modal ao clicar fora do conteúdo
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      fecharModal();
    }
  });

  // Fechar modal com tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      fecharModal();
    }
  });
});
