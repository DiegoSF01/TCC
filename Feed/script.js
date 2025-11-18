// Get filter elements
const fotosCheckbox = document.getElementById('fotos');
const videosCheckbox = document.getElementById('videos');
const profissionalCheckbox = document.getElementById('profissional');
const empresaCheckbox = document.getElementById('empresa');
const profissaoInput = document.getElementById('profissaoInput');
const keywordsInput = document.getElementById('keywordsInput');
const orderBySelect = document.getElementById('orderBy');
const clearFiltersBtn = document.getElementById('clearFilters');

// Clear filters functionality
clearFiltersBtn.addEventListener('click', () => {
    // Reset checkboxes to default state
    fotosCheckbox.checked = true;
    videosCheckbox.checked = false;
    profissionalCheckbox.checked = true;
    empresaCheckbox.checked = true;
    
    // Clear input fields
    profissaoInput.value = '';
    keywordsInput.value = '';
    
    // Reset select to first option
    orderBySelect.selectedIndex = 0;
    
    // Optional: Show a toast notification
    console.log('Filtros limpos');
});

// Filter change listeners (for future implementation)
const filters = [
    fotosCheckbox,
    videosCheckbox,
    profissionalCheckbox,
    empresaCheckbox,
    profissaoInput,
    keywordsInput,
    orderBySelect
];

filters.forEach(filter => {
    const eventType = filter.type === 'checkbox' || filter.tagName === 'SELECT' ? 'change' : 'input';
    filter.addEventListener(eventType, () => {
        applyFilters();
    });
});

function applyFilters() {
    const activeFilters = {
        mediaType: {
            fotos: fotosCheckbox.checked,
            videos: videosCheckbox.checked
        },
        accountType: {
            profissional: profissionalCheckbox.checked,
            empresa: empresaCheckbox.checked
        },
        profissao: profissaoInput.value.trim(),
        keywords: keywordsInput.value.trim(),
        orderBy: orderBySelect.value
    };
    
    console.log('Filtros ativos:', activeFilters);
    // Here you would implement the actual filtering logic
    // For example, filter the feed items based on the active filters
}

// Initialize
console.log('Feed filter initialized');

window.addEventListener('load', function () {
    // Criar o modal
    const modalHTML = `
      <div class="modal-overlay" id="modalPublicacao">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-user-info">
              <img class="modal-user-avatar" id="modalAvatar" alt="Avatar">
              <div class="modal-user-details">
                <h3 id="modalUserName"></h3>
                <p id="modalUserSector"></p>
                <div class="modal-rating" id="modalRating"></div>
              </div>
              <span class="modal-user-badge" id="modalBadge"></span>
            </div>
            <button class="modal-close" id="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <h3 id="modalTitle"></h3>
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
    const modalAvatar = document.getElementById('modalAvatar');
    const modalUserName = document.getElementById('modalUserName');
    const modalUserSector = document.getElementById('modalUserSector');
    const modalBadge = document.getElementById('modalBadge');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalRating = document.getElementById('modalRating');
    const modalDescription = document.getElementById('modalDescription');
    const closeModal = document.getElementById('closeModal');

    function abrirModal(card) {
        // Pegar informações do card
        const avatar = card.querySelector('.profile-pic').src;
        const userName = card.querySelector('.profile-name').textContent;
        const userSector = card.querySelector('.profile-sector').textContent;
        const accountBadge = card.querySelector('.account-type');
        const badge = accountBadge.textContent;
        const badgeType = accountBadge.classList.contains('profissional') ? 'profissional' : 'empresa';
        const titulo = card.querySelector('.feed-title').textContent;
        const descricao = card.querySelector('.feed-description').textContent;
        const imgSrc = card.querySelector('.feed-card-image img').src;
        const ratingStars = card.querySelector('.rating').innerHTML;

        // Preencher modal com informações do usuário
        modalAvatar.src = avatar;
        modalUserName.textContent = userName;
        modalUserSector.textContent = userSector;
        modalBadge.textContent = badge;
        modalBadge.className = `modal-user-badge ${badgeType === 'profissional' ? 'badge-profissional' : 'badge-empresa'}`;
        
        // Preencher modal com informações da publicação
        modalTitle.textContent = titulo;
        modalDescription.textContent = descricao;
        modalImage.innerHTML = `<img src="${imgSrc}" alt="${titulo}">`;
        modalRating.innerHTML = ratingStars;

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
    const feedCards = document.querySelectorAll('.feed-card');
    feedCards.forEach(card => {
        card.addEventListener('click', function () {
            abrirModal(this);
        });
    });

    // Fechar modal ao clicar no botão X
    closeModal.addEventListener('click', fecharModal);

    // Fechar modal ao clicar fora do conteúdo
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            fecharModal();
        }
    });

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            fecharModal();
        }
    });
});