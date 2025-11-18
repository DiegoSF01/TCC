/* ============================================================
   VARIÁVEIS GLOBAIS
============================================================ */
let currentView = 'login'; // 'login', 'register', 'forgot-password'

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

/* ============================================================
   FUNÇÕES GERAIS
============================================================ */

// Toast
function showToast(message, type = 'info') {
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

// Chamada API JSON
async function callApiJson(endpoint, method, data) {
  const response = await fetch(`http:// 172.28.16.1:8000${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await response.json();
}

// Chamada API FormData (usada na Parte2)
async function callApiFormData(endpoint, method, data) {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) formData.append(k, v);
  });

  const response = await fetch(`http:// 172.28.16.1:8000${endpoint}`, {
    method,
    body: formData
  });
  return await response.json();
}

/* ============================================================
   FUNÇÃO DE TROCA DE VIEWS
============================================================ */
function switchView(view) {
  currentView = view;

  // Esconde todos os forms
  loginForm?.classList.remove('active');
  registerForm?.classList.remove('active');
  forgotPasswordForm?.classList.remove('active');

  // Atualiza textos e exibe form correto
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

// Event listeners para troca de formulários
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

    if (!email || !password) {
      showToast("Preencha todos os campos!", "error");
      return;
    }

    setButtonLoading(btn, true, "Entrando...");

    try {
      const result = await callApiJson("/api/login", "POST", { email, password });

      if (result.access_token && result.user?.cadastro_completo) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.access_token);
        showToast("Login realizado!", "success");
        window.location.href = "Home/index.html";
      } else if (result.access_token && !result.user?.cadastro_completo) {
        showToast("Complete seu cadastro!", "warning");
        window.location.href = "/Parte2/index.html";
      } else {
        showToast(result.error || "Credenciais inválidas", "error");
      }
    } catch (err) {
      showToast("Erro ao conectar com servidor!", "error");
    }

    setButtonLoading(btn, false, "Entrar");
  });
}

