// ======= INÍCIO DO SCRIPT.CORRIGIDO =======

// Estado atual do tipo de cadastro
let tipoAtual = 'empresa';

// Elementos do DOM (exemplos do seu arquivo; mantenha como estão)
const tipoBtns = document.querySelectorAll('.tipo-btn');
const empresaForm = document.getElementById('empresaForm');
const profissionalForm = document.getElementById('profissionalForm');
const contratanteForm = document.getElementById('contratanteForm');

// Função para mostrar toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.className = 'toast show ' + type;

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// (mantive as suas máscaras e demais funções; coloquei apenas as partes relevantes abaixo)
// ... (se você tiver outras funções antes, mantenha-as)

// --- Exemplo de funções de máscara (mantive suas funções) ---
function maskCNPJ(value) {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
}

function maskCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2')
        .substring(0, 14);
}

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