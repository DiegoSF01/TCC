// === SCRIPT DE LOGIN E CADASTRO PARTE 1 - CORRIGIDO ===

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

// === HANDLE LOGIN - CORRIGIDO ===
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const submitBtn = loginForm.querySelector('.btn-primary');

  // Validação de campos vazios
  if (!email || !password) {
    showToast('Preencha todos os campos', 'error');
    return;
  }

  setButtonLoading(submitBtn, true);

  try {
    // Fazer requisição para a API Laravel
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    // Verificar se a resposta é JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Resposta não é JSON. Content-Type:', contentType);
      console.error('Status:', response.status);
      
      const textResponse = await response.text();
      console.error('Resposta recebida:', textResponse);
      
      showToast('Erro no servidor. Verifique se a API está rodando corretamente.', 'error');
      setButtonLoading(submitBtn, false);
      return;
    }

    // Fazer parse do JSON
    const data = await response.json();
    
    console.log('✅ Resposta da API:', data);

    // Verificar se houve erro na resposta
    if (!response.ok || !data.access_token) {
      const errorMessage = data.error || data.message || 'Email ou senha incorretos';
      showToast(errorMessage, 'error');
      setButtonLoading(submitBtn, false);
      return;
    }

    // ✅ CORREÇÃO: Salvar com os nomes CORRETOS que os scripts de perfil esperam
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('userType', data.logado.type);
    localStorage.setItem('userId', data.logado.id);
    localStorage.setItem('user_data', JSON.stringify(data.logado));

    console.log('✅ Dados salvos no localStorage:', {
      auth_token: data.access_token,
      userType: data.logado.type,
      userId: data.logado.id
    });

    showToast('Login realizado com sucesso!', 'success');

    // Redirecionar baseado no tipo de usuário
    setTimeout(() => {
      if (data.logado.type === 'contratante') {
        window.location.href = '../../Perfil/PróprioC/index.html';
      } else if (data.logado.type === 'empresa') {
        window.location.href = '../../Perfil/PróprioTE/PróprioE/index.html';
      } else if (data.logado.type === 'prestador') {
        window.location.href = '../../Perfil/PróprioTE/PróprioT/index.html';
      } else {
        showToast('Tipo de usuário não reconhecido', 'error');
      }
    }, 500);

  } catch (error) {
    console.error('❌ Erro ao fazer login:', error);
    showToast('Erro ao conectar com o servidor. Verifique se a API Laravel está rodando.', 'error');
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