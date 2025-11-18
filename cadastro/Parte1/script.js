// Estado atual da view
let currentView = 'login'; // 'login', 'register', 'forgot-password'

const En_btn = document.getElementById('En-btn');
const Ca_btn = document.getElementById('Ca-btn');

Ca_btn.addEventListener('click', function(){
  if (currentView === 'login') {
    switchView('register');
  } else {
    switchView('login');
  }
});

En_btn.addEventListener('click', function(){
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
  
  // Esconder todos os forms
  loginForm.classList.remove('active');
  registerForm.classList.remove('active');
  forgotPasswordForm.classList.remove('active');
  
  // Atualizar textos e mostrar form correto
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

// Handle Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const submitBtn = loginForm.querySelector('.btn-primary');
  
  setButtonLoading(submitBtn, true);
  
  // Simulação de requisição - substitua com sua API
  setTimeout(() => {
    console.log('Login:', { email, password });
    showToast('Login realizado com sucesso!', 'success');
    setButtonLoading(submitBtn, false);
    
    // Redirecionar para home ou dashboard
    // window.location.href = '/';
  }, 1000);
});

// Handle Register
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const submitBtn = registerForm.querySelector('.btn-primary');
  
  // Validar se as senhas coincidem
  if (password !== confirmPassword) {
    showToast('As senhas não coincidem', 'error');
    return;
  }
  
  setButtonLoading(submitBtn, true);
  
  // Simulação de requisição - substitua com sua API
  setTimeout(() => {
    console.log('Registro:', { name, email, password });
    showToast('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
    setButtonLoading(submitBtn, false);
    
    // Limpar formulário e voltar para login
    registerForm.reset();
    switchView('login');
  }, 1000);
});

// Handle Forgot Password
forgotPasswordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('forgotEmail').value;
  const submitBtn = forgotPasswordForm.querySelector('.btn-primary');
  
  setButtonLoading(submitBtn, true);
  
  // Simulação de requisição - substitua com sua API
  setTimeout(() => {
    console.log('Recuperação de senha:', { email });
    showToast('Um email de recuperação foi enviado para ' + email, 'success');
    setButtonLoading(submitBtn, false);
    
    // Limpar formulário e voltar para login
    forgotPasswordForm.reset();
    switchView('login');
  }, 1000);
});

// Inicializar na view de login
switchView('login');
