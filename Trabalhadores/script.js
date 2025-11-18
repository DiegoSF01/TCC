// Rating buttons toggle
const ratingBtns = document.querySelectorAll('.rating-btn');
ratingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ratingBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Availability buttons toggle
const availabilityBtns = document.querySelectorAll('.availability-btn');
availabilityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
});

// Clear filters
document.querySelector('.clear-filters-btn').addEventListener('click', () => {
    document.querySelectorAll('.filter-input').forEach(input => input.value = '');
    document.querySelectorAll('.rating-btn').forEach((btn, idx) => {
        btn.classList.remove('active');
        if (idx === 0) btn.classList.add('active');
    });
    document.querySelectorAll('.availability-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-select').selectedIndex = 0;
});

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