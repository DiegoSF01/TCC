document.addEventListener('DOMContentLoaded', () => {

    // ====== Variáveis globais ======
    const ratingBtns = document.querySelectorAll('.rating-btn');
    const availabilityBtns = document.querySelectorAll('.availability-btn');
    const especialidadeInput = document.getElementById('especialidadeInput');
    const especialidadesList = document.getElementById('especialidadesList');
    const addEspecialidadeBtn = document.getElementById('addEspecialidadeBtn');
    const homeCards = document.getElementById('homeCards');
    let especialidades = [];
  
    // ====== Rating buttons toggle ======
    ratingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ratingBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
  
    // ====== Availability buttons toggle ======
    availabilityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });
  
    // ====== Clear filters ======
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-input').forEach(input => input.value = '');
            ratingBtns.forEach((btn, idx) => {
                btn.classList.remove('active');
                if (idx === 0) btn.classList.add('active');
            });
            availabilityBtns.forEach(btn => btn.classList.remove('active'));
            const select = document.querySelector('.filter-select');
            if (select) select.selectedIndex = 0;
        });
    }
  
    // ====== Especialidades ======
    function renderEspecialidades() {
        if (!especialidadesList) return;
        especialidadesList.innerHTML = '';
        especialidades.forEach((esp, index) => {
            const tag = document.createElement('div');
            tag.className = 'especialidade-tag';
            tag.innerHTML = `
                <span>${esp}</span>
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
  
    function addEspecialidade() {
        if (!especialidadeInput) return;
        const value = especialidadeInput.value.trim();
        if (!value) return alert('Digite uma especialidade');
        if (especialidades.includes(value)) return alert('Especialidade já adicionada');
  
        especialidades.push(value);
        renderEspecialidades();
        especialidadeInput.value = '';
        especialidadeInput.focus();
    }
  
    function removeEspecialidade(index) {
        especialidades.splice(index, 1);
        renderEspecialidades();
    }
  
    function handleRemoveClick(e) {
        const idx = Number(e.currentTarget.dataset.index);
        if (!isNaN(idx)) removeEspecialidade(idx);
    }
  
    if (addEspecialidadeBtn) addEspecialidadeBtn.addEventListener('click', addEspecialidade);
    if (especialidadeInput) {
        especialidadeInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addEspecialidade();
            }
        });
    }
  
    function loadMockData() {
        especialidades = ['Design', 'Branding', 'UI/UX'];
        renderEspecialidades();
    }
  
    loadMockData();
  
    // ====== Cards ======
    async function fetchUsers() {
        if (!homeCards) return;
        try {
            const res = await fetch('http:// 172.28.16.1:8000/prestadores');
            const users = await res.json();
            renderCards(users);
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
        }
    }
  
    function renderCards(users) {
        if (!homeCards) return;
        homeCards.innerHTML = '';
        users.forEach(user => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="top-content-card">
                    <div class="TCC-center">
                        <div class="foto-perfil" style="background-image:url('${user.prestador?.foto || 'img/default.png'}')"></div>
                        <div class="nome-area">
                            <h3 class="nome-card">${user.prestador?.nome || 'Sem Nome'}</h3>
                            <p class="area-card">${user.tipo_usuario === 'empresa' ? 'Empresa' : 'Profissional'}</p>
                        </div>
                    </div>
                </div>
  
                <p class="empresa-ou-profissional">${user.tipo_usuario === 'empresa' ? 'Empresa' : 'Profissional'}</p>
  
                <div class="localizacao">
                    <span class="lc-cidade_estado">${user.prestador?.cidade || '-'}, ${user.prestador?.uf || '-'}</span>
                </div>
  
                <div class="telefone">
                    <span class="tl-numero">${user.telefone || '-'}</span>
                </div>
  
                <div class="email">
                    <span class="email-text">${user.user?.email || '-'}</span>
                </div>
  
                <button class="ver-perfil">Ver Perfil</button>
            `;
  
            const perfilBtn = card.querySelector('.ver-perfil');
            if (perfilBtn) {
                perfilBtn.addEventListener('click', () => {
                    sessionStorage.setItem('perfilUsuario', JSON.stringify(user));
                    window.location.href = '/perfil_portfolio.html';
                });
            }
  
            homeCards.appendChild(card);
        });
    }
  
    fetchUsers();
  
  });