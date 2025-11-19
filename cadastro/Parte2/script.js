// ===============================
// === ESTADO DO TIPO DE CADASTRO ===
// ===============================
let tipoAtual = 'empresa';

// ===============================
// === ELEMENTOS DO DOM ===
// ===============================
const tipoBtns = document.querySelectorAll('.tipo-btn');
const empresaForm = document.getElementById('empresaForm');
const profissionalForm = document.getElementById('profissionalForm');
const contratanteForm = document.getElementById('contratanteForm');

// ===============================
// === FUNÇÃO DE TOAST ===
// ===============================
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  if (!toast || !toastMessage) {
    alert(`${type.toUpperCase()}: ${message}`);
    return;
  }

  toastMessage.textContent = message;
  toast.className = 'toast show ' + type;

  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===============================
// === FUNÇÃO DE TROCA DE TIPO ===
// ===============================
function switchTipo(tipo) {
  tipoAtual = tipo;

  tipoBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tipo="${tipo}"]`)?.classList.add('active');

  empresaForm.classList.remove('active');
  profissionalForm.classList.remove('active');
  contratanteForm.classList.remove('active');

  if (tipo === 'empresa') empresaForm.classList.add('active');
  else if (tipo === 'profissional') profissionalForm.classList.add('active');
  else if (tipo === 'contratante') contratanteForm.classList.add('active');
}

tipoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTipo(btn.getAttribute('data-tipo'));
  });
});

// Inicializa
switchTipo('empresa');

// ===============================
// === FUNÇÃO DE PREVIEW DE IMAGEM ===
// ===============================
function handleImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if(!input || !preview) return;

  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        preview.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    }
  });
}

// Configura previews
['empresaBanner','empresaPerfil','profissionalBanner','profissionalPerfil','contratanteBanner','contratantePerfil']
.forEach(id => handleImagePreview(id, id+'Preview'));

// ===============================
// === FUNÇÃO BOTÃO LOADING ===
// ===============================
function setButtonLoading(button, isLoading, text = "Enviar") {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.textContent = "Carregando...";
  } else {
    button.disabled = false;
    button.textContent = text;
  }
}

// ===============================
// === MÁSCARAS ===
// ===============================
function maskCNPJ(value) {
  return value.replace(/\D/g, '')
              .replace(/^(\d{2})(\d)/, '$1.$2')
              .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
              .replace(/\.(\d{3})(\d)/, '.$1/$2')
              .replace(/(\d{4})(\d)/, '$1-$2')
              .substring(0,18);
}

function maskCPF(value) {
  return value.replace(/\D/g,'')
              .replace(/^(\d{3})(\d)/,'$1.$2')
              .replace(/^(\d{3})\.(\d{3})(\d)/,'$1.$2.$3')
              .replace(/\.(\d{3})(\d)/,'.$1-$2')
              .substring(0,14);
}

function maskCEP(value){
  return value.replace(/\D/g,'')
              .replace(/^(\d{5})(\d)/,'$1-$2')
              .substring(0,9);
}

function maskPhone(value){
  value = value.replace(/\D/g,'');
  if(value.length>11) value = value.slice(0,11);
  if(value.length>0) value = '(' + value;
  if(value.length>3) value = value.slice(0,3) + ') ' + value.slice(3);
  if(value.length>10) value = value.slice(0,10) + '-' + value.slice(10);
  return value;
}

// Aplica máscaras
const masks = [
  ['empresaCnpj', maskCNPJ],
  ['empresaCep', maskCEP],
  ['profissionalCpf', maskCPF],
  ['profissionalCep', maskCEP],
  ['contratanteCpf', maskCPF],
  ['contratanteCep', maskCEP],
  ['registerTelEm', maskPhone],
  ['registerTelPro', maskPhone],
  ['registerTelCon', maskPhone]
];

masks.forEach(([id, fn])=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener('input', e=> e.target.value = fn(e.target.value));
});

// ===============================
// === CAMPOS COM BUSCA ===
// ===============================
function searchableSelect(inputId, hiddenId, optionsId){
  const input = document.getElementById(inputId);
  const hidden = document.getElementById(hiddenId);
  const optionsList = document.getElementById(optionsId);

  if(!input || !hidden || !optionsList) return;

  input.addEventListener('focus',()=> optionsList.classList.remove('hidden'));

  input.addEventListener('input',()=>{
    const filter = input.value.toLowerCase();
    Array.from(optionsList.children).forEach(li=>{
      li.style.display = li.textContent.toLowerCase().includes(filter) ? 'block' : 'none';
    });
  });

  optionsList.addEventListener('click', e=>{
    if(e.target.tagName==='LI'){
      input.value = e.target.textContent;
      hidden.value = e.target.dataset.value;
      optionsList.classList.add('hidden');
    }
  });

  document.addEventListener('click', e=>{
    if(!e.target.closest('.searchable-select')) optionsList.classList.add('hidden');
  });
}

// Campos de área
searchableSelect('profissionalAreaInput','profissionalArea','profissionalAreaOptions');
searchableSelect('empresaAreaInput','empresaArea','empresaAreaOptions');
const formParte2 = document.getElementById('parte2Form');
        
        formParte2.addEventListener('submit', async (e) => {
            e.preventDefault();
        
            // Recupera dados da Parte 1 do cadastro
            const dadosParte1 = JSON.parse(sessionStorage.getItem('cadastroParte1') || '{}');
        
            // Cria FormData e adiciona dados da Parte 1
            const formData = new FormData();
            for (const key in dadosParte1) {
                formData.append(key, dadosParte1[key]);
            }
        
            // Adiciona dados da Parte 2
            const formInputs = new FormData(formParte2);
            formInputs.forEach((value, key) => formData.append(key, value));
        
            try {
                const response = await fetch('http://127.0.0.1:8000/usuario/cadastro', {
                    method: 'POST',
                    body: formData
                });
        
                const result = await response.json();
        
                if (response.ok) {
                    alert('Cadastro realizado com sucesso!');
                    sessionStorage.removeItem('cadastroParte1');
                    // Redireciona para a página Home
                    window.location.href = '../Home/index.html';
                } else {
                    alert('Erro ao cadastrar: ' + (result.message || 'Verifique os campos'));
                    console.log(result);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Erro de conexão com a API.');
            }
        });

