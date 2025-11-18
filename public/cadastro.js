/* ============================================================
   CONFIGURAÇÃO
============================================================ */
const API_BASE_URL = "http://172.28.16.1:8000";

/* ============================================================
   VARIÁVEIS GLOBAIS
============================================================ */
let currentView = 'login'; // 'login', 'register', 'forgot-password'
let tipoAtual = 'empresa';

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const switchFormBtn = document.getElementById('switchFormBtn');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const cardTitle = document.getElementById('cardTitle');
const cardDescription = document.getElementById('cardDescription');
const mainSubtitle = document.getElementById('mainSubtitle');
const switchText = document.getElementById('switchText');

const tipoBtns = document.querySelectorAll('.tipo-btn');
const empresaForm = document.getElementById('empresaForm');
const profissionalForm = document.getElementById('profissionalForm');
const contratanteForm = document.getElementById('contratanteForm');

/* ============================================================
   FUNÇÕES GERAIS
============================================================ */

// Toast
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

// Loading em botões
function setButtonLoading(button, isLoading, loadingText = "Carregando...", defaultText = "Enviar") {
  if (!button) return;

  const btnText = button.querySelector('.btn-text');
  const btnLoading = button.querySelector('.btn-loading');

  if (isLoading) {
    button.disabled = true;
    if (btnText && btnLoading) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';
    } else {
      button.textContent = loadingText;
    }
  } else {
    button.disabled = false;
    if (btnText && btnLoading) {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    } else {
      button.textContent = defaultText;
    }
  }
}

// Chamada API JSON
async function callApiJson(endpoint, method, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await response.json();
}

// Validações
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function isValidPassword(password) { return password.length >= 6; }

/* ============================================================
   TROCA DE VIEWS
============================================================ */
function switchView(view) {
  currentView = view;
  [loginForm, registerForm, forgotPasswordForm].forEach(f => f?.classList.remove('active'));

  if (view === 'login') {
    loginForm?.classList.add('active');
    cardTitle.textContent = 'Login';
    cardDescription.textContent = 'Digite seus dados para acessar';
    mainSubtitle.textContent = 'Acesse sua conta para continuar';
    switchText.textContent = 'Não tem uma conta? ';
    switchFormBtn.textContent = 'Cadastre-se';
  } else if (view === 'register') {
    registerForm?.classList.add('active');
    cardTitle.textContent = 'Criar Conta';
    cardDescription.textContent = 'Preencha os dados abaixo para se cadastrar';
    mainSubtitle.textContent = 'Crie sua conta e comece agora';
    switchText.textContent = 'Já tem uma conta? ';
    switchFormBtn.textContent = 'Fazer Login';
  } else if (view === 'forgot-password') {
    forgotPasswordForm?.classList.add('active');
    cardTitle.textContent = 'Esqueci a Senha';
    cardDescription.textContent = 'Digite seu email para recuperar a senha';
    mainSubtitle.textContent = 'Recupere o acesso à sua conta';
    switchText.textContent = 'Já tem uma conta? ';
    switchFormBtn.textContent = 'Fazer Login';
  }
}

switchFormBtn?.addEventListener('click', () => {
  if (currentView === 'login') switchView('register');
  else switchView('login');
});
forgotPasswordLink?.addEventListener('click', () => switchView('forgot-password'));

/* ============================================================
   LOGIN
============================================================ */
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = loginForm.querySelector('.btn-primary');

    if (!email || !password) { showToast("Preencha todos os campos!", "error"); return; }
    if (!isValidEmail(email)) { showToast("Email inválido!", "error"); return; }

    setButtonLoading(btn, true, "Entrando...", "Entrar");

    try {
      const result = await callApiJson("/login", "POST", { email, password });

      if (result.access_token && result.user?.cadastro_completo) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.access_token);
        showToast("Login realizado!", "success");
        setTimeout(() => window.location.href = "../../Home/index.html", 1000);
      } else if (result.access_token && !result.user?.cadastro_completo) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.access_token);
        showToast("Complete seu cadastro!", "warning");
        setTimeout(() => window.location.href = "../Parte2/index.html", 1000);
      } else {
        showToast(result.error || "Credenciais inválidas", "error");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      showToast("Erro ao conectar com servidor!", "error");
    } finally {
      setButtonLoading(btn, false, "Entrando...", "Entrar");
    }
  });
}

/* ============================================================
   CADASTRO PARTE 1
============================================================ */
async function verificarEmail(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/check/email?email=${encodeURIComponent(email)}`);
    return await response.json();
  } catch (err) {
    console.error("Erro ao verificar e-mail:", err);
    return { exists: false };
  }
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const btn = registerForm.querySelector('.btn-primary');

    if (!email || !password || !confirmPassword) { showToast("Preencha todos os campos!", "error"); return; }
    if (!isValidEmail(email)) { showToast("Email inválido!", "error"); return; }
    if (!isValidPassword(password)) { showToast("Senha deve ter no mínimo 6 caracteres!", "error"); return; }
    if (password !== confirmPassword) { showToast("As senhas não coincidem!", "error"); return; }

    setButtonLoading(btn, true, "Cadastrando...", "Continuar");

    try {
      const emailCheck = await verificarEmail(email);
      if (emailCheck.exists) { 
        showToast("Este email já está cadastrado!", "error"); 
        setButtonLoading(btn, false, "Cadastrando...", "Continuar"); 
        return; 
      }

      // Enviar para API
      const cadastroData = { email, senha: password, tipo: tipoAtual };
      const result = await callApiJson("/usuario/cadastro", "POST", cadastroData);

      if (result.success) {
        localStorage.setItem("cadastro", JSON.stringify({ email, senha: password, timestamp: new Date().toISOString() }));
        showToast("Cadastro realizado! Redirecionando...", "success");
        setTimeout(() => window.location.href = "../Parte2/index.html", 1500);
      } else {
        showToast(result.error || "Erro ao cadastrar usuário", "error");
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      showToast("Erro ao conectar com servidor!", "error");
    } finally {
      setButtonLoading(btn, false, "Cadastrando...", "Continuar");
    }
  });
}

/* ============================================================
   RECUPERAÇÃO DE SENHA
============================================================ */
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('forgotEmail').value.trim();
    const btn = forgotPasswordForm.querySelector('.btn-primary');

    if (!email) { showToast("Digite seu email!", "error"); return; }
    if (!isValidEmail(email)) { showToast("Email inválido!", "error"); return; }

    setButtonLoading(btn, true, "Enviando...", "Enviar Email de Recuperação");

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      if (response.ok) {
        showToast("Email de recuperação enviado!", "success");
        setTimeout(() => switchView('login'), 2000);
      } else {
        showToast(result.error || "Erro ao enviar email", "error");
      }
    } catch (err) {
      console.error("Erro na recuperação:", err);
      showToast("Erro ao conectar com servidor!", "error");
    } finally {
      setButtonLoading(btn, false, "Enviando...", "Enviar Email de Recuperação");
    }
  });
}

/* ============================================================
   SEARCHABLE SELECT
============================================================ */
function searchableSelect(inputId, hiddenId, optionsId){
  const input = document.getElementById(inputId);
  const hidden = document.getElementById(hiddenId);
  const optionsList = document.getElementById(optionsId);
  if(!input || !hidden || !optionsList) return;

  input.addEventListener('focus',()=> optionsList.classList.remove('hidden'));
  input.addEventListener('input',()=> {
    const filter = input.value.toLowerCase();
    Array.from(optionsList.children).forEach(li => li.style.display = li.textContent.toLowerCase().includes(filter) ? 'block' : 'none');
  });

  optionsList.addEventListener('click', e=> {
    if(e.target.tagName==='LI'){
      input.value = e.target.textContent;
      hidden.value = e.target.dataset.value;
      optionsList.classList.add('hidden');
    }
  });

  document.addEventListener('click', e=> {
    if(!e.target.closest('.searchable-select')) optionsList.classList.add('hidden');
  });
}

searchableSelect('profissionalAreaInput','profissionalArea','profissionalAreaOptions');
searchableSelect('empresaAreaInput','empresaArea','empresaAreaOptions');

/* ============================================================
   TROCA DE TIPO DE CADASTRO
============================================================ */
function switchTipo(tipo) {
  tipoAtual = tipo;
  tipoBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tipo="${tipo}"]`)?.classList.add('active');

  [empresaForm, profissionalForm, contratanteForm].forEach(f => f?.classList.remove('active'));

  if(tipo==='empresa') empresaForm?.classList.add('active');
  else if(tipo==='profissional') profissionalForm?.classList.add('active');
  else if(tipo==='contratante') contratanteForm?.classList.add('active');
}

tipoBtns.forEach(btn => btn.addEventListener('click', () => switchTipo(btn.getAttribute('data-tipo'))));
switchTipo('empresa');

/* ============================================================
   PREVIEW DE IMAGEM
============================================================ */
function handleImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if(!input || !preview) return;

  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = event => {
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        preview.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    }
  });
}

['empresaBanner','empresaPerfil','profissionalBanner','profissionalPerfil','contratanteBanner','contratantePerfil']
  .forEach(id => handleImagePreview(id, id+'Preview'));

/* ============================================================
   INICIALIZAÇÃO
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Sistema de autenticação inicializado');
  console.log('API Base URL:', API_BASE_URL);

  const cadastroPendente = localStorage.getItem("cadastro");
  if(cadastroPendente && window.location.pathname.includes('Login')){
    const dados = JSON.parse(cadastroPendente);
    const timestamp = new Date(dados.timestamp);
    const agora = new Date();
    const diferencaHoras = (agora - timestamp)/(1000*60*60);
    if(diferencaHoras>24){ localStorage.removeItem("cadastro"); console.log('Dados de cadastro expirados removidos'); }
    else { console.log('Há um cadastro pendente de', Math.round(diferencaHoras), 'horas atrás'); }
  }

  console.log('View atual:', currentView);
});

if (formParte2) {
  formParte2.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = formParte2.querySelector('.btn-primary');
    setButtonLoading(btn, true, "Enviando...", "Finalizar Cadastro");

    try {
      const dadosParte1 = JSON.parse(localStorage.getItem("cadastro") || "{}");
      if (!dadosParte1.email || !dadosParte1.senha) {
        showToast("Dados da primeira etapa não encontrados!", "error");
        setButtonLoading(btn, false, "Finalizar Cadastro");
        return;
      }

      const formData = new FormData(formParte2);
      const dadosParte2 = {};
      formData.forEach((v,k) => dadosParte2[k] = v);

      const cadastroCompleto = { ...dadosParte1, ...dadosParte2 };

      const result = await callApiFormData("/usuario/cadastro", "POST", cadastroCompleto);
      if (result.success) {
        showToast("Cadastro concluído com sucesso!", "success");
        localStorage.removeItem("cadastro");
        setTimeout(() => window.location.href = "../../Home/index.html", 1500);
      } else {
        showToast(result.error || "Erro ao finalizar cadastro", "error");
      }

    } catch (err) {
      console.error("Erro no cadastro parte 2:", err);
      showToast("Erro ao conectar com servidor!", "error");
    } finally {
      setButtonLoading(btn, false, "Finalizar Cadastro");
    }
  });
}
// Seleciona todos os formulários da parte 2
// Seleciona todos os formulários com a mesma classe
const todosFormularios = document.querySelectorAll('.register-form');

todosFormularios.forEach(form => {

  // === Previews de imagem dinâmicos ===
  const fileInputs = form.querySelectorAll('.file-input');

  fileInputs.forEach(input => {
    input.addEventListener('change', () => {
      const previewId = input.id + "Preview"; // ex: profissionalBannerPreview
      const preview = document.getElementById(previewId);
      if (!preview) return;

      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        // Substitui o conteúdo do preview por imagem
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
      }
      reader.readAsDataURL(file);
    });
  });

  // === Envio do formulário ===
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-primary');
    setButtonLoading(btn, true, "Enviando...", "Finalizar Cadastro");

    try {
      // Dados da parte 1
      const dadosParte1 = JSON.parse(localStorage.getItem("cadastro") || "{}");
      if (!dadosParte1.email || !dadosParte1.senha) {
        showToast("Dados da primeira etapa não encontrados!", "error");
        setButtonLoading(btn, false, "Finalizar Cadastro");
        return;
      }

      // Cria um objeto com todos os dados do formulário atual
      const formData = new FormData(form);
      const dadosParte2 = {};
      formData.forEach((v, k) => dadosParte2[k] = v);

      const cadastroCompleto = { ...dadosParte1, ...dadosParte2 };

      // Chamada à API
      const result = await callApiFormData("/usuario/cadastro", "POST", cadastroCompleto);

      if (result.success) {
        showToast("Cadastro concluído com sucesso!", "success");
        localStorage.removeItem("cadastro");
        setTimeout(() => window.location.href = "../../Home/index.html", 1500);
      } else {
        showToast(result.error || "Erro ao finalizar cadastro", "error");
      }

    } catch (err) {
      console.error("Erro no cadastro:", err);
      showToast("Erro ao conectar com servidor!", "error");
    } finally {
      setButtonLoading(btn, false, "Finalizar Cadastro");
    }
  });
});