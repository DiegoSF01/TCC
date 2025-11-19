/* ========================== AUTH.JS - SISTEMA DE AUTENTICAÇÃO COMPLETO ========================== */
if (!verificarAutenticacao()) {
  console.log("🔒 Página bloqueada pelo sistema de autenticação");
}


// Verifica se o usuário está autenticado
function verificarAutenticacao() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const currentPage = window.location.pathname;
  const paginasPublicas = [
    '/cadastro/Parte1',
    '/cadastro/Parte2',
    '/Parte1',
    '/Parte2',
    '/cadastro',
    '/Empresas',        // ← ADICIONADO
    '/Empresas/index',  // ← ADICIONADO para garantir
    '/empresas'         // ← Caso esteja minúsculo
  ];
  
  const isPaginaPublica = paginasPublicas.some(pagina => currentPage.includes(pagina));

  if (!token || !user) {
    // Se não está autenticado e não está em página pública, redireciona
    if (!isPaginaPublica) {
      console.log('❌ Usuário não autenticado. Redirecionando...');
      window.location.href = '../../cadastro/Parte1/index.html';
      return false;
    }
  } else {
    // Se está autenticado e tenta acessar página de login/cadastro, vai para Home
    if (isPaginaPublica && !currentPage.includes('Parte2')) {
      console.log('✅ Usuário já autenticado. Redirecionando para Home...');
      window.location.href = '../../Home/index.html';
      return true;
    }
  }

  return true;
}

// Atualiza o nome do usuário no header
function atualizarHeaderUsuario() {
  const userJson = localStorage.getItem('user');
  const perfilNameElement = document.querySelector('.perfil-name');

  if (userJson && perfilNameElement) {
    try {
      const user = JSON.parse(userJson);
      const nome = user.nome || user.name || user.email?.split('@')[0] || 'Usuário';
      
      // Pega apenas o primeiro nome
      const primeiroNome = nome.split(' ')[0];
      
      perfilNameElement.textContent = primeiroNome;
      console.log('✅ Header atualizado com nome:', primeiroNome);
    } catch (error) {
      console.error('❌ Erro ao atualizar header:', error);
      perfilNameElement.textContent = 'Usuário';
    }
  }
}

// Função de logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cadastroParte1');
  console.log('🚪 Logout realizado');
  window.location.href = '../../cadastro/Parte1/index.html';
}

// Adiciona evento de logout ao botão de perfil (se existir)
document.addEventListener('DOMContentLoaded', () => {
  const perfilBtn = document.querySelector('.perfil-btn');
  
  if (perfilBtn) {
    // Atualiza o nome quando a página carregar
    atualizarHeaderUsuario();

    // Adiciona menu dropdown ao clicar no perfil (opcional)
    perfilBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Cria menu dropdown se não existir
      let dropdown = document.querySelector('.perfil-dropdown');
      
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'perfil-dropdown';
        dropdown.innerHTML = `
          <a href="../../Perfil/index.html" class="dropdown-item">Meu Perfil</a>
          <a href="../../Configuracoes/index.html" class="dropdown-item">Configurações</a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item logout-btn">Sair</button>
        `;
        perfilBtn.parentElement.style.position = 'relative';
        perfilBtn.parentElement.appendChild(dropdown);

        // Adiciona evento de logout
        dropdown.querySelector('.logout-btn').addEventListener('click', logout);
      } else {
        dropdown.classList.toggle('show');
      }
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', () => {
      const dropdown = document.querySelector('.perfil-dropdown');
      if (dropdown) {
        dropdown.classList.remove('show');
      }
    });
  }
});

/* ========================== FUNÇÕES AUXILIARES ========================== */

// Função para mostrar toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (!toast || !toastMessage) {
    alert(message);
    return;
  }
  
  toastMessage.textContent = message;
  toast.className = 'toast show ' + type;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Função auxiliar para loading em botões
function setButtonLoading(button, isLoading) {
  if (!button) return;
  
  const btnText = button.querySelector('.btn-text');
  const btnLoading = button.querySelector('.btn-loading');
  
  if (isLoading) {
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-block';
    button.disabled = true;
  } else {
    if (btnText) btnText.style.display = 'inline-block';
    if (btnLoading) btnLoading.style.display = 'none';
    button.disabled = false;
  }
}

// Validações
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

// Verificar email disponível
async function verificarEmail(email) {
  try {
    const response = await fetch(`http://172.21.48.1:8000/check/email?email=${encodeURIComponent(email)}`);
    const result = await response.json();
    return result;
  } catch (err) {
    console.error('Erro ao verificar email:', err);
    return { exists: false };
  }
}

/* ========================== CADASTRO PARTE 1 ========================== */

// Verifica se está na Parte 1
if (window.location.pathname.includes('Parte1')) {
  console.log('📍 Página: Parte 1 - Login/Cadastro');

  // Estado atual da view
  let currentView = 'login';

  const En_btn = document.getElementById('En-btn');
  const Ca_btn = document.getElementById('Ca-btn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const switchFormBtn = document.getElementById('switchFormBtn');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');

  // Função para alternar entre as views
  function switchView(view) {
    currentView = view;
    
    const cardTitle = document.getElementById('cardTitle');
    const cardDescription = document.getElementById('cardDescription');
    const mainSubtitle = document.getElementById('mainSubtitle');
    const switchText = document.getElementById('switchText');
    
    // Esconder todos os forms
    if (loginForm) loginForm.classList.remove('active');
    if (registerForm) registerForm.classList.remove('active');
    if (forgotPasswordForm) forgotPasswordForm.classList.remove('active');
    
    // Atualizar textos e mostrar form correto
    if (view === 'login') {
      if (loginForm) loginForm.classList.add('active');
      if (En_btn && Ca_btn) {
        En_btn.style.backgroundColor = '#ffffff1a';
        Ca_btn.style.backgroundColor = 'transparent';
      }
      if (cardTitle) cardTitle.textContent = 'Login';
      if (cardDescription) cardDescription.textContent = 'Digite seus dados para acessar';
      if (mainSubtitle) mainSubtitle.textContent = 'Acesse sua conta para continuar';
      if (switchText) switchText.textContent = 'Não tem uma conta? ';
      if (switchFormBtn) switchFormBtn.textContent = 'Cadastre-se';
    } else if (view === 'register') {
      if (registerForm) registerForm.classList.add('active');
      if (Ca_btn && En_btn) {
        Ca_btn.style.backgroundColor = '#ffffff1a';
        En_btn.style.backgroundColor = 'transparent';
      }
      if (cardTitle) cardTitle.textContent = 'Criar Conta';
      if (cardDescription) cardDescription.textContent = 'Preencha os dados abaixo para se cadastrar';
      if (mainSubtitle) mainSubtitle.textContent = 'Crie sua conta e comece agora';
      if (switchText) switchText.textContent = 'Já tem uma conta? ';
      if (switchFormBtn) switchFormBtn.textContent = 'Fazer Login';
    } else if (view === 'forgot-password') {
      if (forgotPasswordForm) forgotPasswordForm.classList.add('active');
      if (cardTitle) cardTitle.textContent = 'Esqueci a Senha';
      if (cardDescription) cardDescription.textContent = 'Digite seu email para recuperar a senha';
      if (mainSubtitle) mainSubtitle.textContent = 'Recupere o acesso à sua conta';
    }
  }

  // Event Listeners para troca de formulários
  if (Ca_btn && En_btn) {
    Ca_btn.addEventListener('click', () => {
      if (currentView === 'login') switchView('register');
      else switchView('login');
    });

    En_btn.addEventListener('click', () => {
      if (currentView === 'login') switchView('register');
      else switchView('login');
    });
  }

  if (switchFormBtn) {
    switchFormBtn.addEventListener('click', () => {
      if (currentView === 'login') switchView('register');
      else switchView('login');
    });
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('forgot-password');
    });
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail')?.value?.trim();
      const password = document.getElementById('loginPassword')?.value;
      const submitBtn = loginForm.querySelector('.btn-primary');
      
      if (!email || !password) {
        showToast('Preencha todos os campos', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showToast('Email inválido', 'error');
        return;
      }
      
      setButtonLoading(submitBtn, true);
      
      try {
        console.log('🔐 Tentando login...');
        const result = await callApi('login', 'POST', { email, senha: password });
        
        console.log('📥 Resultado do login:', result);
        
        if (result.token || result.access_token) {
          const token = result.token || result.access_token;
          const userData = result.user || result.data || { email, nome: email.split('@')[0] };
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          showToast('Login realizado com sucesso!', 'success');
          
          setTimeout(() => {
            window.location.href = '../../Home/index.html';
          }, 1000);
        } else {
          showToast(result.message || result.error || 'Credenciais inválidas', 'error');
        }
      } catch (err) {
        console.error('❌ Erro no login:', err);
        showToast('Erro ao conectar com servidor', 'error');
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  // Handle Register (Parte 1)
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      console.log('📝 Formulário de cadastro submetido');
      
      const email = document.getElementById('registerEmail')?.value?.trim();
      const password = document.getElementById('registerPassword')?.value?.trim();
      const confirmPassword = document.getElementById('confirmPassword')?.value?.trim();
      
      // Procura o botão submit (pode ser <button> ou <a> convertido)
      const submitBtn = registerForm.querySelector('button[type="submit"], .btn-primary');
      
      console.log('📧 Email:', email);
      console.log('🔑 Senha:', password ? '***' : 'vazio');
      console.log('🔑 Confirmar:', confirmPassword ? '***' : 'vazio');
      
      if (!email || !password || !confirmPassword) {
        showToast('Preencha todos os campos!', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showToast('Email inválido', 'error');
        return;
      }
      
      if (!isValidPassword(password)) {
        showToast('Senha deve ter no mínimo 6 caracteres', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showToast('As senhas não coincidem', 'error');
        return;
      }
      
      setButtonLoading(submitBtn, true);
      
      try {
        console.log('🔍 Verificando disponibilidade do email...');
        const check = await verificarEmail(email);
        
        console.log('📥 Resultado da verificação:', check);
        
        if (check.exists || check.message === "Email já cadastrado") {
          showToast('Email já cadastrado', 'error');
          setButtonLoading(submitBtn, false);
          return;
        }
        
        // Salvar dados da Parte 1
        const dadosParte1 = {
          email,
          senha: password,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('cadastroParte1', JSON.stringify(dadosParte1));
        console.log('💾 Dados salvos no localStorage');
        
        showToast('Dados validados! Redirecionando...', 'success');
        
        setTimeout(() => {
          console.log('🔄 Redirecionando para Parte 2...');
          window.location.href = '../Parte2/index.html';
        }, 1000);
        
      } catch (err) {
        console.error('❌ Erro:', err);
        showToast('Erro ao conectar com servidor', 'error');
        setButtonLoading(submitBtn, false);
      }
    });
  }

  // Handle Forgot Password
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('forgotEmail')?.value?.trim();
      const submitBtn = forgotPasswordForm.querySelector('.btn-primary');
      
      if (!email || !isValidEmail(email)) {
        showToast('Digite um email válido', 'error');
        return;
      }
      
      setButtonLoading(submitBtn, true);
      
      try {
        await callApi('forgot-password', 'GET', { email });
        showToast('Email de recuperação enviado!', 'success');
        
        setTimeout(() => {
          forgotPasswordForm.reset();
          switchView('login');
        }, 2000);
      } catch (err) {
        console.error('Erro:', err);
        showToast('Erro ao enviar email', 'error');
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  // Inicializar
  switchView('login');
  console.log('✅ Parte 1 inicializada');
}

/* ========================== VERIFICAÇÃO PARTE 2 ========================== */

// Verifica se está na Parte 2 e tem dados da Parte 1
if (window.location.pathname.includes('Parte2')) {
  console.log('📍 Página: Parte 2 - Completar Cadastro');
  
  const dadosParte1 = JSON.parse(localStorage.getItem('cadastroParte1') || '{}');
  
  if (!dadosParte1.email) {
    console.warn('⚠️ Dados da Parte 1 não encontrados');
    showToast('Sessão de cadastro expirada. Refaça o cadastro.', 'error');
    setTimeout(() => {
      window.location.href = '../Parte1/index.html';
    }, 2000);
  } else {
    // Verificar expiração (30 minutos)
    const timestamp = new Date(dadosParte1.timestamp);
    const now = new Date();
    const diffMinutes = (now - timestamp) / 1000 / 60;
    
    console.log(`⏱️ Sessão ativa há ${diffMinutes.toFixed(1)} minutos`);
    
    if (diffMinutes > 30) {
      console.warn('⚠️ Sessão expirada');
      showToast('Sessão expirada. Refaça o cadastro.', 'error');
      localStorage.removeItem('cadastroParte1');
      setTimeout(() => {
        window.location.href = '../Parte1/index.html';
      }, 2000);
    } else {
      console.log('✅ Sessão válida. Email:', dadosParte1.email);
    }
  }
}

async function carregarEmpresas() {
  try {
      const response = await fetch("http://127.0.0.1:8000/usuarios");
      const data = await response.json();

      const container = document.querySelector(".cards-container");
      container.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
          container.innerHTML = "<p>Nenhuma empresa encontrada.</p>";
          return;
      }

      data.forEach(item => {
          const card = `
              <div class="card">
                  <img src="${item.banner || '../../assets/default-banner.jpg'}" class="card-img">
                  <h3>${item.nome || "Empresa sem nome"}</h3>
                  <p>${item.ramo || "Ramo não informado"}</p>
              </div>
          `;
          container.innerHTML += card;
      });

      console.log("🎉 Cards de empresas renderizados com sucesso!");
  } catch (err) {
      console.error("Erro ao carregar empresas:", err);
      document.querySelector(".cards-container").innerHTML =
          "<p>Erro ao carregar dados.</p>";
  }
}

console.log('✅ auth.js carregado completamente!');