// Estado atual do tipo de cadastro
let tipoAtual = 'empresa';

// Elementos do DOM
const tipoBtns = document.querySelectorAll('.tipo-btn');
const empresaForm = document.getElementById('empresaForm');
const profissionalForm = document.getElementById('profissionalForm');
const contratanteForm = document.getElementById('contratanteForm');

// Função para mostrar toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = message;
  toast.className = 'toast show ' + type;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Função para alternar entre tipos de cadastro
function switchTipo(tipo) {
  tipoAtual = tipo;
  
  // Remover classe active de todos os botões
  tipoBtns.forEach(btn => btn.classList.remove('active'));
  
  // Adicionar classe active ao botão clicado
  document.querySelector(`[data-tipo="${tipo}"]`).classList.add('active');
  
  // Esconder todos os formulários
  empresaForm.classList.remove('active');
  profissionalForm.classList.remove('active');
  contratanteForm.classList.remove('active');
  
  // Mostrar o formulário correto
  if (tipo === 'empresa') {
    empresaForm.classList.add('active');
  } else if (tipo === 'profissional') {
    profissionalForm.classList.add('active');
  } else if (tipo === 'contratante') {
    contratanteForm.classList.add('active');
  }
}

// Event listeners para os botões de tipo
tipoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tipo = btn.getAttribute('data-tipo');
    switchTipo(tipo);
  });
});

// Função para preview de imagem
function handleImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        preview.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    }
  });
}

// Configurar previews de imagem para todos os formulários
// Empresa
handleImagePreview('empresaBanner', 'empresaBannerPreview');
handleImagePreview('empresaPerfil', 'empresaPerfilPreview');

// Profissional
handleImagePreview('profissionalBanner', 'profissionalBannerPreview');
handleImagePreview('profissionalPerfil', 'profissionalPerfilPreview');

// Contratante
handleImagePreview('contratanteBanner', 'contratanteBannerPreview');
handleImagePreview('contratantePerfil', 'contratantePerfilPreview');

// Função auxiliar para loading em botões
function setButtonLoading(button, isLoading) {
  const btnText = button.querySelector('.btn-text');
  const btnLoading = button.querySelector('.btn-loading');
  
  if (isLoading) {
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    button.disabled = true;
  } else {
    btnText.style.display = 'inline-block';
    btnLoading.style.display = 'none';
    button.disabled = false;
  }
}

// Máscaras para inputs
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

// Aplicar máscaras
document.getElementById('empresaCnpj').addEventListener('input', (e) => {
  e.target.value = maskCNPJ(e.target.value);
});

document.getElementById('empresaCep').addEventListener('input', (e) => {
  e.target.value = maskCEP(e.target.value);
});

document.getElementById('profissionalCpf').addEventListener('input', (e) => {
  e.target.value = maskCPF(e.target.value);
});

document.getElementById('profissionalCep').addEventListener('input', (e) => {
  e.target.value = maskCEP(e.target.value);
});

document.getElementById('contratanteCpf').addEventListener('input', (e) => {
  e.target.value = maskCPF(e.target.value);
});

document.getElementById('contratanteCep').addEventListener('input', (e) => {
  e.target.value = maskCEP(e.target.value);
});

// Handle Empresa Form
empresaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const submitBtn = empresaForm.querySelector('.btn-primary');
  const formData = {
    tipo: 'empresa',
    nome: document.getElementById('empresaNome').value,
    cnpj: document.getElementById('empresaCnpj').value,
    cep: document.getElementById('empresaCep').value,
    area: document.getElementById('empresaArea').value,
    fotoPerfil: document.getElementById('empresaPerfil').files[0],
    fotoBanner: document.getElementById('empresaBanner').files[0]
  };
  
  setButtonLoading(submitBtn, true);
  
  // Simulação de requisição - substitua com sua API
  setTimeout(() => {
    console.log('Cadastro Empresa:', formData);
    showToast('Empresa cadastrada com sucesso!', 'success');
    setButtonLoading(submitBtn, false);
    
    // Redirecionar ou limpar formulário
    setTimeout(() => {
      window.location.href = 'auth.html';
    }, 1500);
  }, 1500);
});

// Handle Profissional Form
profissionalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const submitBtn = profissionalForm.querySelector('.btn-primary');
  const formData = {
    tipo: 'profissional',
    nome: document.getElementById('profissionalNome').value,
    cpf: document.getElementById('profissionalCpf').value,
    cep: document.getElementById('profissionalCep').value,
    area: document.getElementById('profissionalArea').value,
    fotoPerfil: document.getElementById('profissionalPerfil').files[0],
    fotoBanner: document.getElementById('profissionalBanner').files[0]
  };
  
  setButtonLoading(submitBtn, true);
  
  // Simulação de requisição - substitua com sua API
  setTimeout(() => {
    console.log('Cadastro Profissional:', formData);
    showToast('Profissional cadastrado com sucesso!', 'success');
    setButtonLoading(submitBtn, false);
    
    // Redirecionar ou limpar formulário
    setTimeout(() => {
      window.location.href = 'auth.html';
    }, 1500);
  }, 1500);
});

// Handle Contratante Form
contratanteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const submitBtn = contratanteForm.querySelector('.btn-primary');
  const formData = {
    tipo: 'contratante',
    nome: document.getElementById('contratanteNome').value,
    cpf: document.getElementById('contratanteCpf').value,
    cep: document.getElementById('contratanteCep').value,
    fotoPerfil: document.getElementById('contratantePerfil').files[0],
    fotoBanner: document.getElementById('contratanteBanner').files[0]
  };
  
  setButtonLoading(submitBtn, true);
  
  // Simulação de requisição - substitua com sua API
  setTimeout(() => {
    console.log('Cadastro Contratante:', formData);
    showToast('Contratante cadastrado com sucesso!', 'success');
    setButtonLoading(submitBtn, false);
    
    // Redirecionar ou limpar formulário
    setTimeout(() => {
      window.location.href = 'auth.html';
    }, 1500);
  }, 1500);
});

// Inicializar na view de empresa
switchTipo('empresa');

// ELEMENTOS
const inputArea = document.getElementById("profissionalAreaInput");
const hiddenArea = document.getElementById("profissionalArea");
const optionsList = document.getElementById("profissionalAreaOptions");

// Mostrar lista ao focar
inputArea.addEventListener("focus", () => {
    optionsList.classList.remove("hidden");
});

// Filtrar ao digitar
inputArea.addEventListener("input", () => {
    const filter = inputArea.value.toLowerCase();

    Array.from(optionsList.children).forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(filter) ? "block" : "none";
    });
});

// Selecionar opção
optionsList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        const value = e.target.dataset.value;
        const label = e.target.textContent;

        inputArea.value = label;      // Mostra o nome para o usuário
        hiddenArea.value = value;     // Envia o valor para o form

        optionsList.classList.add("hidden");
    }
});

// Ocultar ao clicar fora
document.addEventListener("click", (e) => {
    if (!e.target.closest(".searchable-select")) {
        optionsList.classList.add("hidden");
    }
});


// -------------------- CAMPO COM BUSCA - EMPRESAS --------------------

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

document.getElementById("registerTelPro").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número

  // Limita a 11 dígitos (DDD + 9 dígitos)
  value = value.substring(0, 11);

  // Aplica máscara: (XX) XXXXX-XXXX
  if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else {
      value = value.replace(/^(\d{0,2})/, "($1");
  }

  e.target.value = value;
});

document.getElementById("registerTelEm").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número

  // Limita a 11 dígitos (DDD + 9 dígitos)
  value = value.substring(0, 11);

  // Aplica máscara: (XX) XXXXX-XXXX
  if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else {
      value = value.replace(/^(\d{0,2})/, "($1");
  }

  e.target.value = value;
});