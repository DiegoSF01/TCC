/* ========================== VARIÁVEIS ========================== */
const API_BASE_URL = "http://172.21.48.1:8000";

let currentView = 'login';
let tipoAtual = 'empresa';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const switchFormBtn = document.getElementById('switchFormBtn');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

const tipoBtns = document.querySelectorAll('.tipo-btn');
const empresaForm = document.getElementById('empresaForm');
const profissionalForm = document.getElementById('profissionalForm');
const contratanteForm = document.getElementById('contratanteForm');

/* ========================== FUNÇÕES GERAIS ========================== */
function showToast(message, type='success'){
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  if(!toast || !toastMessage){ alert(message); return; }
  toastMessage.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(()=> toast.classList.remove('show'), 3000);
}

function setButtonLoading(button, isLoading, loadingText="Carregando...", defaultText="Enviar"){
  if(!button) return;
  const btnText = button.querySelector('.btn-text');
  const btnLoading = button.querySelector('.btn-loading');
  if(isLoading){
    button.disabled = true;
    if(btnText && btnLoading){ btnText.style.display='none'; btnLoading.style.display='inline'; }
    else button.textContent = loadingText;
  } else {
    button.disabled = false;
    if(btnText && btnLoading){ btnText.style.display='inline'; btnLoading.style.display='none'; }
    else button.textContent = defaultText;
  }
}

function isValidEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function isValidPassword(password){ return password.length >= 6; }

/* ========================== TROCA DE VIEWS ========================== */
function switchView(view){
  currentView = view;
  [loginForm, registerForm, forgotPasswordForm].forEach(f=> f?.classList.remove('active'));
  if(view==='login') loginForm?.classList.add('active');
  else if(view==='register') registerForm?.classList.add('active');
  else if(view==='forgot-password') forgotPasswordForm?.classList.add('active');
}

switchFormBtn?.addEventListener('click', ()=>{
  if(currentView==='login') switchView('register'); else switchView('login');
});
forgotPasswordLink?.addEventListener('click', ()=> switchView('forgot-password'));

/* ========================== LOGIN ========================== */
if(loginForm){
  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = loginForm.querySelector('.btn-primary');

    if(!email||!password){ showToast("Preencha todos os campos","error"); return; }
    if(!isValidEmail(email)){ showToast("Email inválido","error"); return; }

    setButtonLoading(btn,true,"Entrando...");

    try{
      const result = await callApiJson("/login","POST",{email,password});
      if(result.access_token){
        localStorage.setItem("user",JSON.stringify(result.user));
        localStorage.setItem("token",result.access_token);
        showToast(result.user?.cadastro_completo?"Login realizado!":"Complete seu cadastro!","success");
        const redirect = result.user?.cadastro_completo?"../../Home/index.html":"../Parte2/index.html";
        setTimeout(()=>window.location.href=redirect,1000);
      } else showToast(result.error || "Credenciais inválidas","error");
    } catch(err){ showToast("Erro ao conectar com servidor","error"); }
    finally{ setButtonLoading(btn,false); }
  });
}

/* ========================== CADASTRO PARTE 1 ========================== */
async function verificarEmail(email){
  try{
    const res = await fetch(`${API_BASE_URL}/check/email?email=${encodeURIComponent(email)}`);
    return await res.json();
  } catch(err){ return { exists:false }; }
}

if(registerForm){
  registerForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const btn = registerForm.querySelector('.btn-primary');

    if(!email||!password||!confirmPassword){ showToast("Preencha todos os campos!","error"); return; }
    if(!isValidEmail(email)){ showToast("Email inválido","error"); return; }
    if(!isValidPassword(password)){ showToast("Senha deve ter no mínimo 6 caracteres","error"); return; }
    if(password!==confirmPassword){ showToast("Senhas não coincidem","error"); return; }

    setButtonLoading(btn,true,"Cadastrando...");

    try{
      const check = await verificarEmail(email);
      if(check.exists){ showToast("Email já cadastrado","error"); setButtonLoading(btn,false); return; }

      const cadastroData = new FormData();
      cadastroData.append('email',email);
      cadastroData.append('senha',password);
      cadastroData.append('tipo',tipoAtual);

      const result = await callApiFormData("/usuario/cadastro","POST", cadastroData);
      if(result.success){
        localStorage.setItem("cadastro",JSON.stringify({email,senha:password,tipo:tipoAtual,timestamp:new Date().toISOString()}));
        showToast("Cadastro realizado!","success");
        setTimeout(()=> window.location.href="../Parte1/index.html",1500);
      } else showToast(result.error||"Erro ao cadastrar usuário","error");
    } catch(err){ showToast("Erro ao conectar com servidor","error"); }
    finally{ setButtonLoading(btn,false); }
  });
}

/* ========================== TROCA DE TIPO ========================== */
function switchTipo(tipo){
  tipoAtual = tipo;
  tipoBtns.forEach(btn=>btn.classList.remove('active'));
  document.querySelector(`[data-tipo="${tipo}"]`)?.classList.add('active');
  [empresaForm, profissionalForm, contratanteForm].forEach(f=>f?.classList.remove('active'));
  if(tipo==='empresa') empresaForm?.classList.add('active');
  else if(tipo==='profissional') profissionalForm?.classList.add('active');
  else if(tipo==='contratante') contratanteForm?.classList.add('active');
}
tipoBtns.forEach(btn=>btn.addEventListener('click',()=>switchTipo(btn.dataset.tipo)));
switchTipo('empresa');

/* ========================== PREVIEW DE IMAGEM ========================== */
function handleImagePreview(inputId,previewId){
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if(!input || !preview) return;
  input.addEventListener('change', e=>{
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = ev=>{
        preview.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
      }
      reader.readAsDataURL(file);
    }
  });
}
['empresaBanner','empresaPerfil','profissionalBanner','profissionalPerfil','contratanteBanner','contratantePerfil']
  .forEach(id=>handleImagePreview(id,id+'Preview'));

/* ========================== PARTE 2 ========================== */
const formParte2 = document.getElementById("formParte2");
if(formParte2){
  formParte2.addEventListener('submit', async e=>{
    e.preventDefault();
    const btn = formParte2.querySelector('.btn-primary');
    setButtonLoading(btn,true,"Enviando...");

    const dadosParte1 = JSON.parse(localStorage.getItem("cadastro")||"{}");
    if(!dadosParte1.email || !dadosParte1.senha){ showToast("Dados da primeira etapa não encontrados","error"); setButtonLoading(btn,false); return; }

    const formData = new FormData(formParte2);
    Object.entries(dadosParte1).forEach(([k,v])=>formData.append(k,v));

    try{
      const result = await callApiFormData("/usuario/cadastro","POST",formData);
      if(result.success){
        showToast("Cadastro concluído com sucesso!","success");
        localStorage.removeItem("cadastro");
        setTimeout(()=> window.location.href="../../Home/index.html",1500);
      } else showToast(result.error||"Erro ao finalizar cadastro","error");
    } catch(err){ showToast("Erro ao conectar com servidor","error"); }
    finally{ setButtonLoading(btn,false); }
  });
}
