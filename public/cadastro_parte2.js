/* ========================== CADASTRO PARTE 2 - COMPLETO ========================== */

// Estado do tipo de cadastro atual
let tipoAtual = 'empresa';

// Elementos do DOM
const tipoBtns = document.querySelectorAll('.tipo-btn');
const empresaForm = document.getElementById('empresaForm');
const profissionalForm = document.getElementById('profissionalForm');
const contratanteForm = document.getElementById('contratanteForm');

// Função para alternar entre tipos
function switchTipo(tipo) {
  tipoAtual = tipo;
  
  tipoBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tipo="${tipo}"]`)?.classList.add('active');
  
  empresaForm?.classList.remove('active');
  profissionalForm?.classList.remove('active');
  contratanteForm?.classList.remove('active');
  
  if (tipo === 'empresa') empresaForm?.classList.add('active');
  else if (tipo === 'profissional') profissionalForm?.classList.add('active');
  else if (tipo === 'contratante') contratanteForm?.classList.add('active');
}

// Event listeners para botões de tipo
tipoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTipo(btn.getAttribute('data-tipo'));
  });
});

/* ========================== PREVIEW DE IMAGENS ========================== */
function handleImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  if (!input || !preview) return;
  
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.innerHTML = `<img src="${event.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
        preview.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    }
  });
}

// Configurar previews
handleImagePreview('empresaBanner', 'empresaBannerPreview');
handleImagePreview('empresaPerfil', 'empresaPerfilPreview');
handleImagePreview('profissionalBanner', 'profissionalBannerPreview');
handleImagePreview('profissionalPerfil', 'profissionalPerfilPreview');
handleImagePreview('contratanteBanner', 'contratanteBannerPreview');
handleImagePreview('contratantePerfil', 'contratantePerfilPreview');

/* ========================== MÁSCARAS ========================== */
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

function maskPhone(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
    .substring(0, 15);
}

// Aplicar máscaras
document.getElementById('empresaCnpj')?.addEventListener('input', e => e.target.value = maskCNPJ(e.target.value));
document.getElementById('empresaCep')?.addEventListener('input', e => e.target.value = maskCEP(e.target.value));
document.getElementById('profissionalCpf')?.addEventListener('input', e => e.target.value = maskCPF(e.target.value));
document.getElementById('profissionalCep')?.addEventListener('input', e => e.target.value = maskCEP(e.target.value));
document.getElementById('contratanteCpf')?.addEventListener('input', e => e.target.value = maskCPF(e.target.value));
document.getElementById('contratanteCep')?.addEventListener('input', e => e.target.value = maskCEP(e.target.value));
document.getElementById('registerTelEm')?.addEventListener('input', e => e.target.value = maskPhone(e.target.value));
document.getElementById('registerTelPro')?.addEventListener('input', e => e.target.value = maskPhone(e.target.value));
document.getElementById('registerTelCon')?.addEventListener('input', e => e.target.value = maskPhone(e.target.value));

/* ========================== SELECT PESQUISÁVEL ========================== */
function setupSearchableSelect(inputId, optionsId, hiddenInputId) {
  const input = document.getElementById(inputId);
  const optionsList = document.getElementById(optionsId);
  const hiddenInput = document.getElementById(hiddenInputId);
  
  if (!input || !optionsList || !hiddenInput) return;
  
  input.addEventListener('focus', () => {
    optionsList.classList.remove('hidden');
  });
  
  input.addEventListener('input', () => {
    const filter = input.value.toLowerCase();
    Array.from(optionsList.children).forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(filter) ? 'block' : 'none';
    });
  });
  
  optionsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      input.value = e.target.textContent;
      hiddenInput.value = e.target.dataset.value;
      optionsList.classList.add('hidden');
    }
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.searchable-select')) {
      optionsList.classList.add('hidden');
    }
  });
}

setupSearchableSelect('profissionalAreaInput', 'profissionalAreaOptions', 'profissionalArea');
setupSearchableSelect('empresaAreaInput', 'empresaAreaOptions', 'empresaArea');

/* ========================== CADASTRO - EMPRESA ========================== */
if (empresaForm) {
  empresaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = empresaForm.querySelector('.btn-primary');
    setButtonLoading(submitBtn, true);
    
    // Recuperar dados da Parte 1
    const dadosParte1 = JSON.parse(localStorage.getItem('cadastroParte1') || '{}');
    
    if (!dadosParte1.email || !dadosParte1.senha) {
      showToast('Dados da primeira etapa não encontrados.', 'error');
      setTimeout(() => window.location.href = '../Parte1/index.html', 2000);
      return;
    }
    
    // Coletar dados do formulário
    const formData = new FormData(empresaForm);
    const data = {};
    
    // Adicionar dados da Parte 1
    data.email = dadosParte1.email;
    data.senha = dadosParte1.senha;
    data.tipo = 'empresa';
    
    // Adicionar dados do formulário
    for (let [key, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        data[key] = value;
      } else if (!(value instanceof File) && value) {
        data[key] = value;
      }
    }
    
    console.log('📤 Enviando cadastro de empresa:', data);
    
    try {
      const result = await callApi('usuario/cadastro', 'POST', data);
      
      console.log('📥 Resultado:', result);
      
      if (result.success || result.message?.includes('sucesso')) {
        showToast('Empresa cadastrada com sucesso!', 'success');
        localStorage.removeItem('cadastroParte1');
        
        // Fazer login automático
        try {
          const loginResult = await callApi('login', 'POST', {
            email: dadosParte1.email,
            senha: dadosParte1.senha
          });
          
          if (loginResult.token || loginResult.access_token) {
            const token = loginResult.token || loginResult.access_token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(loginResult.user || loginResult.data));
          }
        } catch (loginErr) {
          console.error('Erro no login automático:', loginErr);
        }
        
        setTimeout(() => window.location.href = '../../Home/index.html', 1500);
      } else {
        showToast(result.message || result.error || 'Erro ao cadastrar', 'error');
      }
    } catch (err) {
      console.error('❌ Erro:', err);
      showToast('Erro ao conectar com servidor', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

/* ========================== CADASTRO - PROFISSIONAL ========================== */
if (profissionalForm) {
  profissionalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = profissionalForm.querySelector('.btn-primary');
    setButtonLoading(submitBtn, true);
    
    const dadosParte1 = JSON.parse(localStorage.getItem('cadastroParte1') || '{}');
    
    if (!dadosParte1.email || !dadosParte1.senha) {
      showToast('Dados da primeira etapa não encontrados.', 'error');
      setTimeout(() => window.location.href = '../Parte1/index.html', 2000);
      return;
    }
    
    const formData = new FormData(profissionalForm);
    const data = {};
    
    data.email = dadosParte1.email;
    data.senha = dadosParte1.senha;
    data.tipo = 'profissional';
    
    for (let [key, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        data[key] = value;
      } else if (!(value instanceof File) && value) {
        data[key] = value;
      }
    }
    
    console.log('📤 Enviando cadastro de profissional:', data);
    
    try {
      const result = await callApi('usuario/cadastro', 'POST', data);
      
      console.log('📥 Resultado:', result);
      
      if (result.success || result.message?.includes('sucesso')) {
        showToast('Profissional cadastrado com sucesso!', 'success');
        localStorage.removeItem('cadastroParte1');
        
        try {
          const loginResult = await callApi('login', 'POST', {
            email: dadosParte1.email,
            senha: dadosParte1.senha
          });
          
          if (loginResult.token || loginResult.access_token) {
            const token = loginResult.token || loginResult.access_token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(loginResult.user || loginResult.data));
          }
        } catch (loginErr) {
          console.error('Erro no login automático:', loginErr);
        }
        
        setTimeout(() => window.location.href = '../../Home/index.html', 1500);
      } else {
        showToast(result.message || result.error || 'Erro ao cadastrar', 'error');
      }
    } catch (err) {
      console.error('❌ Erro:', err);
      showToast('Erro ao conectar com servidor', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

/* ========================== CADASTRO - CONTRATANTE ========================== */
if (contratanteForm) {
  contratanteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contratanteForm.querySelector('.btn-primary');
    setButtonLoading(submitBtn, true);
    
    const dadosParte1 = JSON.parse(localStorage.getItem('cadastroParte1') || '{}');
    
    if (!dadosParte1.email || !dadosParte1.senha) {
      showToast('Dados da primeira etapa não encontrados.', 'error');
      setTimeout(() => window.location.href = '../Parte1/index.html', 2000);
      return;
    }
    
    const formData = new FormData(contratanteForm);
    const data = {};
    
    data.email = dadosParte1.email;
    data.senha = dadosParte1.senha;
    data.tipo = 'contratante';
    
    for (let [key, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        data[key] = value;
      } else if (!(value instanceof File) && value) {
        data[key] = value;
      }
    }
    
    console.log('📤 Enviando cadastro de contratante:', data);
    
    try {
      const result = await callApi('usuario/cadastro', 'POST', data);
      
      console.log('📥 Resultado:', result);
      
      if (result.success || result.message?.includes('sucesso')) {
        showToast('Contratante cadastrado com sucesso!', 'success');
        localStorage.removeItem('cadastroParte1');
        
        try {
          const loginResult = await callApi('login', 'POST', {
            email: dadosParte1.email,
            senha: dadosParte1.senha
          });
          
          if (loginResult.token || loginResult.access_token) {
            const token = loginResult.token || loginResult.access_token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(loginResult.user || loginResult.data));
          }
        } catch (loginErr) {
          console.error('Erro no login automático:', loginErr);
        }
        
        setTimeout(() => window.location.href = '../../Home/index.html', 1500);
      } else {
        showToast(result.message || result.error || 'Erro ao cadastrar', 'error');
      }
    } catch (err) {
      console.error('❌ Erro:', err);
      showToast('Erro ao conectar com servidor', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

// Inicializar com empresa selecionado
switchTipo('empresa');

console.log('✅ Cadastro Parte 2 carregado');