// === ESTADO DO TIPO DE CADASTRO ATUAL (empresa, profissional ou contratante) ===
let tipoAtual = 'empresa';

// === SELECIONA ELEMENTOS DO DOM ===
const tipoBtns = document.querySelectorAll('.tipo-btn'); // Botões de seleção de tipo
const empresaForm = document.getElementById('empresaForm');
const profissionalForm = document.getElementById('profissionalForm');
const contratanteForm = document.getElementById('contratanteForm');

// === FUNÇÃO DE TOAST (mensagem que aparece no canto) ===
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  toastMessage.textContent = message; // Define texto
  toast.className = 'toast show ' + type; // Adiciona classe de sucesso ou erro

  // Some após 3 segundos
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// === ALTERA ENTRE TIPOS DE CADASTRO ===
function switchTipo(tipo) {
  tipoAtual = tipo;

  // Remove destaque dos botões
  tipoBtns.forEach(btn => btn.classList.remove('active'));

  // Ativa botão clicado
  document.querySelector(`[data-tipo="${tipo}"]`).classList.add('active');

  // Esconde todos os formulários
  empresaForm.classList.remove('active');
  profissionalForm.classList.remove('active');
  contratanteForm.classList.remove('active');

  // Exibe formulário correto
  if (tipo === 'empresa') empresaForm.classList.add('active');
  else if (tipo === 'profissional') profissionalForm.classList.add('active');
  else if (tipo === 'contratante') contratanteForm.classList.add('active');
}

// === EVENTOS PARA OS BOTÕES DE TIPO ===
tipoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tipo = btn.getAttribute('data-tipo');
    switchTipo(tipo);
  });
});

// === FUNÇÃO PARA MOSTRAR PREVIEW DE IMAGEM SELECIONADA ===
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
      reader.readAsDataURL(file); // Converte imagem em base64
    }
  });
}

// === CONFIGURAR PREVIEW PARA CADA FORMULÁRIO ===
handleImagePreview('empresaBanner', 'empresaBannerPreview');
handleImagePreview('empresaPerfil', 'empresaPerfilPreview');

handleImagePreview('profissionalBanner', 'profissionalBannerPreview');
handleImagePreview('profissionalPerfil', 'profissionalPerfilPreview');

handleImagePreview('contratanteBanner', 'contratanteBannerPreview');
handleImagePreview('contratantePerfil', 'contratantePerfilPreview');

// === FUNÇÃO QUE LIGA O "CARREGANDO" NO BOTÃO ===
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

// === MÁSCARAS PARA CAMPOS DE INPUT ===

// Máscara de CNPJ
function maskCNPJ(value) {
  return value
    .replace(/\D/g, '')                 // Remove tudo que não é número
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
}

// Máscara de CPF
function maskCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
    .substring(0, 14);
}

// Máscara de CEP
function maskCEP(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .substring(0, 9);
}

// === APLICA AS MÁSCARAS ===
document.getElementById('empresaCnpj').addEventListener('input', e => e.target.value = maskCNPJ(e.target.value));
document.getElementById('empresaCep').addEventListener('input', e => e.target.value = maskCEP(e.target.value));
document.getElementById('profissionalCpf').addEventListener('input', e => e.target.value = maskCPF(e.target.value));
document.getElementById('profissionalCep').addEventListener('input', e => e.target.value = maskCEP(e.target.value));
document.getElementById('contratanteCpf').addEventListener('input', e => e.target.value = maskCPF(e.target.value));
document.getElementById('contratanteCep').addEventListener('input', e => e.target.value = maskCEP(e.target.value));

// ========================================================================================
// === FORMULÁRIOS DE CADASTRO ===
// ========================================================================================

// --- EMPRESA ---
empresaForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = empresaForm.querySelector('.btn-primary');

  // Coleta dados
  const formData = {
    tipo: 'empresa',
    nome: document.getElementById('empresaNome').value,
    cnpj: document.getElementById('empresaCnpj').value,
    cep: document.getElementById('empresaCep').value,
    endereco: document.getElementById('empresaEndereco').value,
    numero: document.getElementById('empresaNumero').value,
    bairro: document.getElementById('empresaBairro').value,
    complemento: document.getElementById('empresaComplemento').value,
    cidade: document.getElementById('empresaCidade').value,
    estado: document.getElementById('empresaEstado').value.toUpperCase(),
    area: document.getElementById('empresaArea').value,
    fotoPerfil: document.getElementById('empresaPerfil').files[0],
    fotoBanner: document.getElementById('empresaBanner').files[0]
  };

  setButtonLoading(submitBtn, true);

  // Simulação de envio
  setTimeout(() => {
    console.log('Cadastro Empresa:', formData);
    showToast('Empresa cadastrada com sucesso!', 'success');
    setButtonLoading(submitBtn, false);

    setTimeout(() => window.location.href = 'auth.html', 1500);
  }, 1500);
});

// --- PROFISSIONAL ---
profissionalForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = profissionalForm.querySelector('.btn-primary');

  const formData = {
    tipo: 'profissional',
    nome: document.getElementById('profissionalNome').value,
    cpf: document.getElementById('profissionalCpf').value,
    cep: document.getElementById('profissionalCep').value,
    endereco: document.getElementById('profissionalEndereco').value,
    numero: document.getElementById('profissionalNumero').value,
    bairro: document.getElementById('profissionalBairro').value,
    complemento: document.getElementById('profissionalComplemento').value,
    cidade: document.getElementById('profissionalCidade').value,
    estado: document.getElementById('profissionalEstado').value.toUpperCase(),
    area: document.getElementById('profissionalArea').value,
    fotoPerfil: document.getElementById('profissionalPerfil').files[0],
    fotoBanner: document.getElementById('profissionalBanner').files[0]
  };

  setButtonLoading(submitBtn, true);

  setTimeout(() => {
    console.log('Cadastro Profissional:', formData);
    showToast('Profissional cadastrado com sucesso!', 'success');
    setButtonLoading(submitBtn, false);

    setTimeout(() => window.location.href = 'auth.html', 1500);
  }, 1500);
});

// --- CONTRATANTE ---
contratanteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = contratanteForm.querySelector('.btn-primary');

  const formData = {
    tipo: 'contratante',
    nome: document.getElementById('contratanteNome').value,
    cpf: document.getElementById('contratanteCpf').value,
    cep: document.getElementById('contratanteCep').value,
    endereco: document.getElementById('contratanteEndereco').value,
    numero: document.getElementById('contratanteNumero').value,
    bairro: document.getElementById('contratanteBairro').value,
    complemento: document.getElementById('contratanteComplemento').value,
    cidade: document.getElementById('contratanteCidade').value,
    estado: document.getElementById('contratanteEstado').value.toUpperCase(),
    fotoPerfil: document.getElementById('contratantePerfil').files[0],
    fotoBanner: document.getElementById('contratanteBanner').files[0]
  };

  setButtonLoading(submitBtn, true);

  setTimeout(() => {
    console.log('Cadastro Contratante:', formData);
    showToast('Contratante cadastrado com sucesso!', 'success');
    setButtonLoading(submitBtn, false);

    setTimeout(() => window.location.href = 'auth.html', 1500);
  }, 1500);
});

// Inicializa na aba "Empresa"
switchTipo('empresa');

// ========================================================================================
// === CAMPO COM BUSCA (ÁREA DE ATUAÇÃO PROFISSIONAL) ===
// ========================================================================================

const inputArea = document.getElementById("profissionalAreaInput");
const hiddenArea = document.getElementById("profissionalArea");
const optionsList = document.getElementById("profissionalAreaOptions");

// Abre lista ao focar
inputArea.addEventListener("focus", () => {
  optionsList.classList.remove("hidden");
});

// Filtra opções
inputArea.addEventListener("input", () => {
  const filter = inputArea.value.toLowerCase();
  Array.from(optionsList.children).forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(filter) ? "block" : "none";
  });
});

// Seleciona item
optionsList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    inputArea.value = e.target.textContent;
    hiddenArea.value = e.target.dataset.value;
    optionsList.classList.add("hidden");
  }
});

// Fecha ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchable-select")) {
    optionsList.classList.add("hidden");
  }
});

// ========================================================================================
// === CAMPO COM BUSCA (ÁREA DA EMPRESA) ===
// ========================================================================================

const empresaInput = document.getElementById("empresaAreaInput");
const empresaHidden = document.getElementById("empresaArea");
const empresaOptions = document.getElementById("empresaAreaOptions");

// Abre lista ao focar
empresaInput.addEventListener("focus", () => {
  empresaOptions.classList.remove("hidden");
});

// Filtra ao digitar
empresaInput.addEventListener("input", () => {
  const filter = empresaInput.value.toLowerCase();
  Array.from(empresaOptions.children).forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(filter) ? "block" : "none";
  });
});

// Seleciona item
empresaOptions.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    empresaInput.value = e.target.textContent;
    empresaHidden.value = e.target.dataset.value;
    empresaOptions.classList.add("hidden");
  }
});

// Fecha lista ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchable-select")) {
    empresaOptions.classList.add("hidden");
  }
});

// ========================================================================================
// === MÁSCARA DE TELEFONE (PROFISSIONAL E EMPRESA) ===
// ========================================================================================

const phoneInputEm = document.getElementById("registerTelEm");

phoneInputEm.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

  // Limita a 11 dígitos
  if (value.length > 11) value = value.slice(0, 11);

  // Aplica a máscara progressivamente
  if (value.length > 0) {
    value = "(" + value;
  }
  if (value.length > 3) {
    value = value.slice(0, 3) + ") " + value.slice(3);
  }
  if (value.length > 10) {
    value = value.slice(0, 10) + "-" + value.slice(10);
  }

  e.target.value = value;
});

const phoneInputPro = document.getElementById("registerTelPro");

phoneInputPro.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

  // Limita a 11 dígitos
  if (value.length > 11) value = value.slice(0, 11);

  // Aplica a máscara progressivamente
  if (value.length > 0) {
    value = "(" + value;
  }
  if (value.length > 3) {
    value = value.slice(0, 3) + ") " + value.slice(3);
  }
  if (value.length > 10) {
    value = value.slice(0, 10) + "-" + value.slice(10);
  }

  e.target.value = value;
});

const phoneInputCon = document.getElementById("registerTelCon");

phoneInputCon.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

  // Limita a 11 dígitos
  if (value.length > 11) value = value.slice(0, 11);

  // Aplica a máscara progressivamente
  if (value.length > 0) {
    value = "(" + value;
  }
  if (value.length > 3) {
    value = value.slice(0, 3) + ") " + value.slice(3);
  }
  if (value.length > 10) {
    value = value.slice(0, 10) + "-" + value.slice(10);
  }

  e.target.value = value;
});

// ===============================
//  CONFIGURAÇÃO
// ===============================
const $ = id => document.getElementById(id);

// Botões
const btnEmpresa = $("btn-cadastroE");
const btnPrestador = $("btn-cadastroT");
const btnContratante = $("btn-cadastroC");

// Mostrar loading no botão
function setLoading(btn, state) {
  const txt = btn.querySelector(".btn-text");
  const load = btn.querySelector(".btn-loading");
  btn.disabled = state;
  txt.style.display = state ? "none" : "";
  load.style.display = state ? "inline-block" : "none";
}

// ===============================
//  CEP - ViaCEP
// ===============================
async function validarCEP(cep) {
  cep = cep.replace(/\D/g, "");
  if (cep.length !== 8) {
    alert("CEP inválido");
    return null;
  }

  try {
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await r.json();
    if (data.erro) {
      alert("CEP não encontrado.");
      return null;
    }
    return data;
  } catch {
    alert("Erro ao consultar CEP.");
    return null;
  }
}

// ===============================
//  PARTE 1
// ===============================
function getParte1() {
  try {
    return JSON.parse(localStorage.getItem("cadastro_parte1"));
  } catch {
    return null;
  }
}

// ===============================
//  MONTA FORMULÁRIO COMPLETO
// ===============================
async function montarForm(tipo) {
  const parte1 = getParte1();
  if (!parte1) {
    alert("Erro: volte para a parte 1.");
    return null;
  }

  const form = new FormData();

  // Dados da Parte 1
  form.append("email", parte1.email);
  form.append("password", parte1.password);
  form.append("tipo", tipo);

  let cepInput, ruaInput, numeroInput, bairroInput, cidadeInput, estadoInput;

  // --------------------------
  // EMPRESA
  // --------------------------
  if (tipo === "empresa") {
    const cep = $("empresaCep").value;
    const data = await validarCEP(cep);
    if (!data) return null;

    // Preencher automaticamente
    $("empresaEndereco").value = data.logradouro;
    $("empresaBairro").value = data.bairro;
    $("empresaCidade").value = data.localidade;
    $("empresaEstado").value = data.uf;

    form.append("cnpj", $("empresaCnpj").value);
    form.append("razao_social", $("empresaNome").value);
    form.append("id_categoria", $("empresaArea").value);

    form.append("cep", cep);
    form.append("rua", $("empresaEndereco").value);
    form.append("numero", $("empresaNumero").value);
    form.append("localidade", $("empresaCidade").value);
    form.append("estado", $("empresaEstado").value);
    form.append("uf", data.uf);
    form.append("descricao", $("empresaDescricao")?.value || "");

    if ($("empresaPerfil").files[0]) form.append("foto", $("empresaPerfil").files[0]);
    if ($("empresaBanner").files[0]) form.append("capa", $("empresaBanner").files[0]);
  }

  // --------------------------
  // PRESTADOR
  // --------------------------
  if (tipo === "prestador") {
    const cep = $("profissionalCep").value;
    const data = await validarCEP(cep);
    if (!data) return null;

    $("profissionalEndereco").value = data.logradouro;
    $("profissionalBairro").value = data.bairro;
    $("profissionalCidade").value = data.localidade;
    $("profissionalEstado").value = data.uf;

    form.append("nome", $("profissionalNome").value);
    form.append("cpf", $("profissionalCpf").value);
    form.append("id_ramo", $("profissionalArea").value);

    form.append("cep", cep);
    form.append("rua", $("profissionalEndereco").value);
    form.append("numero", $("profissionalNumero").value);
    form.append("localidade", $("profissionalCidade").value);
    form.append("estado", $("profissionalEstado").value);
    form.append("uf", data.uf);
    form.append("descricao", $("profissionalDescricao")?.value || "");

    if ($("profissionalPerfil").files[0]) form.append("foto", $("profissionalPerfil").files[0]);
    if ($("profissionalBanner").files[0]) form.append("capa", $("profissionalBanner").files[0]);
  }

  // --------------------------
  // CONTRATANTE
  // --------------------------
  if (tipo === "contratante") {
    const cep = $("contratanteCep").value;
    const data = await validarCEP(cep);
    if (!data) return null;

    $("contratanteEndereco").value = data.logradouro;
    $("contratanteBairro").value = data.bairro;
    $("contratanteCidade").value = data.localidade;
    $("contratanteEstado").value = data.uf;

    form.append("nome", $("contratanteNome").value);
    form.append("cpf", $("contratanteCpf").value);

    form.append("cep", cep);
    form.append("rua", $("contratanteEndereco").value);
    form.append("numero", $("contratanteNumero").value);
    form.append("localidade", $("contratanteCidade").value);
    form.append("estado", $("contratanteEstado").value);
    form.append("uf", data.uf);

    if ($("contratantePerfil").files[0]) form.append("foto", $("contratantePerfil").files[0]);
    if ($("contratanteBanner").files[0]) form.append("capa", $("contratanteBanner").files[0]);
  }

  return form;
}

// ===============================
//  ENVIAR CADASTRO
// ===============================
async function enviarCadastro(tipo, btn) {
  setLoading(btn, true);

  const form = await montarForm(tipo);
  if (!form) {
    setLoading(btn, false);
    return;
  }

  const resp = await fetch("process-cadastro.php", {
    method: "POST",
    body: form
  });

  const json = await resp.json();

  if (!json.success) {
    alert(json.message);
    setLoading(btn, false);
    return;
  }

  localStorage.removeItem("cadastro_parte1");

  // REDIRECIONAR
  if (json.type === "empresa") {
    window.location.href = "../../Perfil/PróprioTE/PróprioE/index.html";
  } else if (json.type === "prestador") {
    window.location.href = "../../Perfil/PróprioTE/PróprioT/index.html";
  } else {
    window.location.href = "../../Perfil/PróprioC/index.html";
  }
}

// ===============================
//  EVENTOS DOS BOTÕES
// ===============================
btnEmpresa.addEventListener("click", e => {
  e.preventDefault();
  enviarCadastro("empresa", btnEmpresa);
});

btnPrestador.addEventListener("click", e => {
  e.preventDefault();
  enviarCadastro("prestador", btnPrestador);
});

btnContratante.addEventListener("click", e => {
  e.preventDefault();
  enviarCadastro("contratante", btnContratante);
});
