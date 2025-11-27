// === PARTE 1 DO CADASTRO - SALVAR EMAIL E SENHA ===

// Estado atual da view
let currentView = 'login';

const En_btn = document.getElementById('En-btn');
const Ca_btn = document.getElementById('Ca-btn');

// Alternar entre Login e Cadastro
Ca_btn.addEventListener('click', function () {
  if (currentView === 'login') {
    switchView('register');
  } else {
    switchView('login');
  }
});

En_btn.addEventListener('click', function () {
  if (currentView === 'login') {
    switchView('register');
  } else {
    switchView('login');
  }
});

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

// Função para alternar entre as views
function switchView(view) {
  currentView = view;

  loginForm.classList.remove('active');
  registerForm.classList.remove('active');
  forgotPasswordForm.classList.remove('active');

  if (view === 'login') {
    loginForm.classList.add('active');
    En_btn.style.backgroundColor = '#ffffff1a';
    Ca_btn.style.backgroundColor = 'transparent';
    cardTitle.textContent = 'Login';
    cardDescription.textContent = 'Digite seus dados para acessar';
    mainSubtitle.textContent = 'Acesse sua conta para continuar';
    switchText.textContent = 'Não tem uma conta? ';
    switchFormBtn.textContent = 'Cadastre-se';
  } else if (view === 'register') {
    registerForm.classList.add('active');
    Ca_btn.style.backgroundColor = '#ffffff1a';
    En_btn.style.backgroundColor = 'transparent';
    cardTitle.textContent = 'Criar Conta';
    cardDescription.textContent = 'Preencha os dados abaixo para se cadastrar';
    mainSubtitle.textContent = 'Crie sua conta e comece agora';
    switchText.textContent = 'Já tem uma conta? ';
    switchFormBtn.textContent = 'Fazer Login';
  } else if (view === 'forgot-password') {
    forgotPasswordForm.classList.add('active');
    cardTitle.textContent = 'Esqueci a Senha';
    cardDescription.textContent = 'Digite seu email para recuperar a senha';
    mainSubtitle.textContent = 'Recupere o acesso à sua conta';
    switchText.textContent = 'Já tem uma conta? ';
    switchFormBtn.textContent = 'Fazer Login';
  }
}

// Event Listeners para troca de formulários
switchFormBtn.addEventListener('click', () => {
  if (currentView === 'login') {
    switchView('register');
  } else {
    switchView('login');
  }
});

forgotPasswordLink.addEventListener('click', () => {
  switchView('forgot-password');
});

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

// === HANDLE LOGIN ===
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const submitBtn = loginForm.querySelector('.btn-primary');

  if (!email || !password) {
    showToast('Preencha todos os campos', 'error');
    return;
  }

  setButtonLoading(submitBtn, true);

  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch('process-login.php', {
      method: 'POST',
      body: formData
    });

    const json = await response.json();

    if (!json.success) {
      showToast(json.message || 'Erro ao fazer login', 'error');
      setButtonLoading(submitBtn, false);
      return;
    }

    showToast('Login realizado com sucesso!', 'success');

    // Redirecionar baseado no tipo
    const tipo = json.type;
    setTimeout(() => {
      if (tipo === 'contratante') {
        window.location.href = '../../Perfil/PróprioC/index.html';
      } else if (tipo === 'empresa') {
        window.location.href = '../../Perfil/PróprioTE/PróprioE/index.html';
      } else if (tipo === 'profissional') {
        window.location.href = '../../Perfil/PróprioTE/PróprioT/index.html';
      }
    }, 500);

  } catch (error) {
    console.error('Erro:', error);
    showToast('Erro ao conectar com o servidor', 'error');
    setButtonLoading(submitBtn, false);
  }
});

// === HANDLE CADASTRO PARTE 1 - SALVAR NO LOCALSTORAGE ===
document.getElementById('btn-cadastro1').addEventListener('click', function(e) {
  e.preventDefault();

  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  // Validações
  if (!email || !password || !confirmPassword) {
    showToast('Preencha todos os campos', 'error');
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Digite um email válido', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('A senha deve ter no mínimo 6 caracteres', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast('As senhas não coincidem', 'error');
    return;
  }

  // Salvar dados no localStorage
  const cadastroParte1 = {
    email: email,
    password: password,
    timestamp: new Date().toISOString()
  };

  try {
    localStorage.setItem('cadastro_parte1', JSON.stringify(cadastroParte1));
    showToast('Dados salvos! Redirecionando...', 'success');
    
    // Redirecionar para Parte 2
    setTimeout(() => {
      window.location.href = '../../cadastro/Parte2/index.html';
    }, 1000);
  } catch (error) {
    console.error('Erro ao salvar:', error);
    showToast('Erro ao salvar dados', 'error');
  }
});

// === HANDLE FORGOT PASSWORD ===
forgotPasswordForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('forgotEmail').value.trim();
  const submitBtn = forgotPasswordForm.querySelector('.btn-primary');

  if (!email) {
    showToast('Digite seu email', 'error');
    return;
  }

  setButtonLoading(submitBtn, true);

  // Simulação de recuperação de senha
  setTimeout(() => {
    console.log('Recuperação de senha:', { email });
    showToast('Email de recuperação enviado para ' + email, 'success');
    setButtonLoading(submitBtn, false);

    forgotPasswordForm.reset();
    switchView('login');
  }, 1500);
});

// Inicializar na view de login
switchView('login');