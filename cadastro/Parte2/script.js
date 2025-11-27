// === CONFIGURAÇÃO E UTILITÁRIOS ===
const $ = id => document.getElementById(id);

// ⚠️ CONFIGURE A URL BASE DA SUA API AQUI
const API_BASE_URL = 'http://127.0.0.1:8000';

let tipoAtual = 'empresa';

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 3000);
  } else {
    alert(message);
  }
}

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

// === VERIFICAR SE EXISTE PARTE 1 ===
function getParte1() {
  try {
    const data = localStorage.getItem('cadastro_parte1');
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao recuperar dados:', error);
    return null;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const parte1 = getParte1();
  if (!parte1) {
    showToast('Você precisa preencher a parte 1 primeiro', 'error');
    setTimeout(() => {
      window.location.href = '../Parte1/index.html';
    }, 2000);
  } else {
    console.log('✅ Dados da Parte 1 recuperados:', parte1);
  }
});

// === MÁSCARAS DE INPUT ===
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
  value = value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  
  if (value.length > 0) value = '(' + value;
  if (value.length > 3) value = value.slice(0, 3) + ') ' + value.slice(3);
  if (value.length > 10) value = value.slice(0, 10) + '-' + value.slice(10);
  
  return value;
}

// Aplicar máscaras
if ($('empresaCnpj')) $('empresaCnpj').addEventListener('input', e => e.target.value = maskCNPJ(e.target.value));
if ($('empresaCep')) $('empresaCep').addEventListener('input', e => e.target.value = maskCEP(e.target.value));
if ($('registerTelEm')) $('registerTelEm').addEventListener('input', e => e.target.value = maskPhone(e.target.value));

if ($('profissionalCpf')) $('profissionalCpf').addEventListener('input', e => e.target.value = maskCPF(e.target.value));
if ($('profissionalCep')) $('profissionalCep').addEventListener('input', e => e.target.value = maskCEP(e.target.value));
if ($('registerTelPro')) $('registerTelPro').addEventListener('input', e => e.target.value = maskPhone(e.target.value));

if ($('contratanteCpf')) $('contratanteCpf').addEventListener('input', e => e.target.value = maskCPF(e.target.value));
if ($('contratanteCep')) $('contratanteCep').addEventListener('input', e => e.target.value = maskCEP(e.target.value));
if ($('registerTelCon')) $('registerTelCon').addEventListener('input', e => e.target.value = maskPhone(e.target.value));

// === BUSCAR CEP VIA VIACEP ===
async function buscarCEP(cep, tipo) {
  cep = cep.replace(/\D/g, '');
  
  if (cep.length !== 8) {
    showToast('CEP deve ter 8 dígitos', 'error');
    return null;
  }

  console.log(`🔍 Buscando CEP: ${cep}`);

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      showToast('CEP não encontrado', 'error');
      return null;
    }

    console.log('✅ CEP encontrado:', data);

    $(`${tipo}Endereco`).value = data.logradouro || '';
    $(`${tipo}Bairro`).value = data.bairro || '';
    $(`${tipo}Cidade`).value = data.localidade || '';
    $(`${tipo}Estado`).value = data.uf || '';

    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar CEP:', error);
    showToast('Erro ao buscar CEP. Verifique sua conexão.', 'error');
    return null;
  }
}

if ($('empresaCep')) {
  $('empresaCep').addEventListener('blur', () => {
    const cep = $('empresaCep').value;
    if (cep) buscarCEP(cep, 'empresa');
  });
}

if ($('profissionalCep')) {
  $('profissionalCep').addEventListener('blur', () => {
    const cep = $('profissionalCep').value;
    if (cep) buscarCEP(cep, 'profissional');
  });
}

if ($('contratanteCep')) {
  $('contratanteCep').addEventListener('blur', () => {
    const cep = $('contratanteCep').value;
    if (cep) buscarCEP(cep, 'contratante');
  });
}

// === PREVIEW DE IMAGENS ===
function handleImagePreview(inputId, previewId) {
  const input = $(inputId);
  const preview = $(previewId);

  if (input) {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log(`📷 Preview de imagem: ${inputId}`, file);
        const reader = new FileReader();
        reader.onload = (event) => {
          preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
          preview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

handleImagePreview('empresaBanner', 'empresaBannerPreview');
handleImagePreview('empresaPerfil', 'empresaPerfilPreview');
handleImagePreview('profissionalBanner', 'profissionalBannerPreview');
handleImagePreview('profissionalPerfil', 'profissionalPerfilPreview');
handleImagePreview('contratanteBanner', 'contratanteBannerPreview');
handleImagePreview('contratantePerfil', 'contratantePerfilPreview');

// === ALTERNAR ENTRE TIPOS DE CADASTRO ===
const tipoBtns = document.querySelectorAll('.tipo-btn');

function switchTipo(tipo) {
  tipoAtual = tipo;
  console.log(`🔄 Tipo de cadastro alterado para: ${tipo}`);

  tipoBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tipo="${tipo}"]`)?.classList.add('active');

  $('empresaForm')?.classList.remove('active');
  $('profissionalForm')?.classList.remove('active');
  $('contratanteForm')?.classList.remove('active');

  if (tipo === 'empresa') $('empresaForm')?.classList.add('active');
  else if (tipo === 'profissional') $('profissionalForm')?.classList.add('active');
  else if (tipo === 'contratante') $('contratanteForm')?.classList.add('active');
}

tipoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tipo = btn.getAttribute('data-tipo');
    switchTipo(tipo);
  });
});

// === CAMPOS DE BUSCA (ÁREA DE ATUAÇÃO) ===
function setupSearchableSelect(inputId, hiddenId, optionsId) {
  const input = $(inputId);
  const hidden = $(hiddenId);
  const options = $(optionsId);

  if (!input || !hidden || !options) return;

  input.addEventListener('focus', () => options.classList.remove('hidden'));

  input.addEventListener('input', () => {
    const filter = input.value.toLowerCase();
    Array.from(options.children).forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(filter) ? 'block' : 'none';
    });
  });

  options.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      input.value = e.target.textContent;
      hidden.value = e.target.dataset.value;
      options.classList.add('hidden');
      console.log(`✅ Área selecionada: ${e.target.textContent} (ID: ${e.target.dataset.value})`);
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.searchable-select')) {
      options.classList.add('hidden');
    }
  });
}

setupSearchableSelect('empresaAreaInput', 'empresaArea', 'empresaAreaOptions');
setupSearchableSelect('profissionalAreaInput', 'profissionalArea', 'profissionalAreaOptions');

// === VALIDAR CAMPOS ANTES DE ENVIAR ===
function validarCampos(tipo) {
  console.log(`🔍 Validando campos do tipo: ${tipo}`);

  if (tipo === 'empresa') {
    const campos = {
      'empresaNome': 'Nome da Empresa',
      'empresaCnpj': 'CNPJ',
      'registerTelEm': 'Telefone',
      'empresaCep': 'CEP',
      'empresaEndereco': 'Endereço',
      'empresaNumero': 'Número',
      'empresaBairro': 'Bairro',
      'empresaCidade': 'Cidade',
      'empresaEstado': 'Estado',
      'empresaArea': 'Área da Empresa'
    };

    for (const [id, nome] of Object.entries(campos)) {
      const valor = $(id).value.trim();
      if (!valor) {
        showToast(`Campo "${nome}" é obrigatório`, 'error');
        console.error(`❌ Campo obrigatório vazio: ${nome}`);
        return false;
      }
    }
  }
  else if (tipo === 'prestador') {
    const campos = {
      'profissionalNome': 'Nome Completo',
      'profissionalCpf': 'CPF',
      'registerTelPro': 'Telefone',
      'profissionalCep': 'CEP',
      'profissionalEndereco': 'Endereço',
      'profissionalNumero': 'Número',
      'profissionalBairro': 'Bairro',
      'profissionalCidade': 'Cidade',
      'profissionalEstado': 'Estado',
      'profissionalArea': 'Área de Atuação'
    };

    for (const [id, nome] of Object.entries(campos)) {
      const valor = $(id).value.trim();
      if (!valor) {
        showToast(`Campo "${nome}" é obrigatório`, 'error');
        console.error(`❌ Campo obrigatório vazio: ${nome}`);
        return false;
      }
    }
  }
  else if (tipo === 'contratante') {
    const campos = {
      'contratanteNome': 'Nome Completo',
      'contratanteCpf': 'CPF',
      'registerTelCon': 'Telefone',
      'contratanteCep': 'CEP',
      'contratanteEndereco': 'Endereço',
      'contratanteNumero': 'Número',
      'contratanteBairro': 'Bairro',
      'contratanteCidade': 'Cidade',
      'contratanteEstado': 'Estado'
    };

    for (const [id, nome] of Object.entries(campos)) {
      const valor = $(id).value.trim();
      if (!valor) {
        showToast(`Campo "${nome}" é obrigatório`, 'error');
        console.error(`❌ Campo obrigatório vazio: ${nome}`);
        return false;
      }
    }
  }

  console.log('✅ Todos os campos estão preenchidos');
  return true;
}

// === MAPEAMENTO DE ESTADOS ===
const ESTADOS_BRASIL = {
  'AC': 'Acre',
  'AL': 'Alagoas',
  'AP': 'Amapá',
  'AM': 'Amazonas',
  'BA': 'Bahia',
  'CE': 'Ceará',
  'DF': 'Distrito Federal',
  'ES': 'Espírito Santo',
  'GO': 'Goiás',
  'MA': 'Maranhão',
  'MT': 'Mato Grosso',
  'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais',
  'PA': 'Pará',
  'PB': 'Paraíba',
  'PR': 'Paraná',
  'PE': 'Pernambuco',
  'PI': 'Piauí',
  'RJ': 'Rio de Janeiro',
  'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia',
  'RR': 'Roraima',
  'SC': 'Santa Catarina',
  'SP': 'São Paulo',
  'SE': 'Sergipe',
  'TO': 'Tocantins'
};

// === ENVIAR CADASTRO COMPLETO PARA API ===
async function enviarCadastro(tipo, btn) {
  console.log('═══════════════════════════════════════════════');
  console.log('🚀 INICIANDO ENVIO DE CADASTRO COMPLETO');
  console.log(`📋 Tipo: ${tipo}`);
  console.log('═══════════════════════════════════════════════');

  setButtonLoading(btn, true);

  // ✅ BUSCAR DADOS DA PARTE 1 (EMAIL E SENHA)
  const parte1 = getParte1();
  if (!parte1) {
    showToast('Erro: dados da parte 1 não encontrados', 'error');
    console.error('❌ Dados da parte 1 não encontrados');
    setButtonLoading(btn, false);
    return;
  }

  console.log('✅ Dados da Parte 1:', parte1);

  // VALIDAR CAMPOS DA PARTE 2
  if (!validarCampos(tipo)) {
    setButtonLoading(btn, false);
    return;
  }

  const formData = new FormData();
  
  // ✅ ADICIONAR DADOS DA PARTE 1 (EMAIL E SENHA)
  formData.append('email', parte1.email);
  formData.append('password', parte1.password);
  formData.append('type', tipo);

  console.log('📦 Dados da Parte 1 adicionados:');
  console.log('  - email:', parte1.email);
  console.log('  - type:', tipo);

  try {
    // ✅ ADICIONAR DADOS DA PARTE 2 BASEADO NO TIPO
    if (tipo === 'empresa') {
      // Buscar CEP antes de enviar
      const cepData = await buscarCEP($('empresaCep').value, 'empresa');
      if (!cepData) {
        setButtonLoading(btn, false);
        return;
      }

      const cnpj = $('empresaCnpj').value.replace(/\D/g, '');
      const telefone = $('registerTelEm').value.replace(/\D/g, '');
      const cep = $('empresaCep').value.replace(/\D/g, '');
      const uf = cepData.uf;
      const estadoCompleto = ESTADOS_BRASIL[uf] || cepData.uf;

      // Adicionar todos os campos obrigatórios
      formData.append('razao_social', $('empresaNome').value.trim());
      formData.append('cnpj', cnpj);
      formData.append('telefone', telefone);
      formData.append('id_categoria', $('empresaArea').value);
      formData.append('cep', cep);
      formData.append('rua', $('empresaEndereco').value.trim());
      formData.append('numero', $('empresaNumero').value.trim());
      formData.append('localidade', cepData.localidade);
      formData.append('estado', estadoCompleto);
      formData.append('uf', uf);
      
      // Campos opcionais
      const complemento = $('empresaComplemento')?.value?.trim();
      if (complemento) {
        formData.append('infoadd', complemento);
      }

      // Foto de perfil
      if ($('empresaPerfil')?.files[0]) {
        formData.append('foto', $('empresaPerfil').files[0]);
        console.log('📷 Foto de perfil adicionada');
      }

      console.log('📦 Dados da Empresa (Parte 2):');
      console.log('  - razao_social:', $('empresaNome').value);
      console.log('  - cnpj:', cnpj);
      console.log('  - telefone:', telefone);
      console.log('  - id_categoria:', $('empresaArea').value);
      console.log('  - localidade:', cepData.localidade);
      console.log('  - estado:', estadoCompleto);
      console.log('  - uf:', uf);
    }
    else if (tipo === 'prestador') {
      const cepData = await buscarCEP($('profissionalCep').value, 'profissional');
      if (!cepData) {
        setButtonLoading(btn, false);
        return;
      }

      const cpf = $('profissionalCpf').value.replace(/\D/g, '');
      const telefone = $('registerTelPro').value.replace(/\D/g, '');
      const cep = $('profissionalCep').value.replace(/\D/g, '');
      const uf = cepData.uf;
      const estadoCompleto = ESTADOS_BRASIL[uf] || cepData.uf;

      formData.append('nome', $('profissionalNome').value.trim());
      formData.append('cpf', cpf);
      formData.append('telefone', telefone);
      formData.append('id_ramo', $('profissionalArea').value);
      formData.append('cep', cep);
      formData.append('rua', $('profissionalEndereco').value.trim());
      formData.append('numero', $('profissionalNumero').value.trim());
      formData.append('localidade', cepData.localidade);
      formData.append('estado', estadoCompleto);
      formData.append('uf', uf);
      
      const complemento = $('profissionalComplemento')?.value?.trim();
      if (complemento) {
        formData.append('infoadd', complemento);
      }

      if ($('profissionalPerfil')?.files[0]) {
        formData.append('foto', $('profissionalPerfil').files[0]);
        console.log('📷 Foto de perfil adicionada');
      }

      console.log('📦 Dados do Prestador (Parte 2):');
      console.log('  - nome:', $('profissionalNome').value);
      console.log('  - cpf:', cpf);
      console.log('  - telefone:', telefone);
      console.log('  - id_ramo:', $('profissionalArea').value);
    }
    else if (tipo === 'contratante') {
      const cepData = await buscarCEP($('contratanteCep').value, 'contratante');
      if (!cepData) {
        setButtonLoading(btn, false);
        return;
      }

      const cpf = $('contratanteCpf').value.replace(/\D/g, '');
      const telefone = $('registerTelCon').value.replace(/\D/g, '');
      const cep = $('contratanteCep').value.replace(/\D/g, '');
      const uf = cepData.uf;
      const estadoCompleto = ESTADOS_BRASIL[uf] || cepData.uf;

      formData.append('nome', $('contratanteNome').value.trim());
      formData.append('cpf', cpf);
      formData.append('telefone', telefone);
      formData.append('cep', cep);
      formData.append('rua', $('contratanteEndereco').value.trim());
      formData.append('numero', $('contratanteNumero').value.trim());
      formData.append('localidade', cepData.localidade);
      formData.append('estado', estadoCompleto);
      formData.append('uf', uf);
      
      const complemento = $('contratanteComplemento')?.value?.trim();
      if (complemento) {
        formData.append('infoadd', complemento);
      }

      if ($('contratantePerfil')?.files[0]) {
        formData.append('foto', $('contratantePerfil').files[0]);
        console.log('📷 Foto de perfil adicionada');
      }

      console.log('📦 Dados do Contratante (Parte 2):');
      console.log('  - nome:', $('contratanteNome').value);
      console.log('  - cpf:', cpf);
      console.log('  - telefone:', telefone);
    }

    // LOG COMPLETO DO FORMDATA
    console.log('\n📋 DADOS COMPLETOS (PARTE 1 + PARTE 2):');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [Arquivo: ${value.name}, ${(value.size / 1024).toFixed(2)}KB]`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    // ✅ ENVIAR TUDO DE UMA VEZ PARA A API
    const url = `${API_BASE_URL}/api/usuario/cadastro`;
    console.log(`\n🌐 Enviando TUDO para: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log(`📡 Status da resposta: ${response.status} ${response.statusText}`);

    const contentType = response.headers.get('content-type');
    console.log(`📄 Content-Type da resposta: ${contentType}`);

    let result;
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
      console.log('✅ Resposta JSON recebida:', result);
    } else {
      const text = await response.text();
      console.error('❌ Resposta não é JSON:', text.substring(0, 500));
      throw new Error('O servidor retornou uma resposta inválida. Verifique se a rota da API está correta.');
    }

    if (!response.ok) {
      console.error('❌ Erro na resposta da API:', result);
      
      if (result.details && typeof result.details === 'object') {
        const erros = Object.values(result.details).flat();
        showToast(erros[0] || result.error || 'Erro ao cadastrar', 'error');
        console.error('Erros de validação:', result.details);
      } else {
        showToast(result.message || result.error || 'Erro ao cadastrar', 'error');
      }
      
      setButtonLoading(btn, false);
      return;
    }

    console.log('✅ Cadastro realizado com sucesso!');
    console.log('🎉 Token recebido:', result.access_token);

    if (result.access_token) {
      localStorage.setItem('auth_token', result.access_token);
      console.log('💾 Token salvo no localStorage');
    }

    // ✅ LIMPAR LOCALSTORAGE DA PARTE 1
    localStorage.removeItem('cadastro_parte1');
    console.log('🗑️ Dados da parte 1 removidos do localStorage');

    showToast('Cadastro realizado com sucesso! Redirecionando...', 'success');

    // REDIRECIONAR BASEADO NO TIPO
    setTimeout(() => {
      if (tipo === 'empresa') {
        console.log('🔀 Redirecionando para perfil de empresa');
        window.location.href = '../../Perfil/PróprioTE/PróprioE/index.html';
      } else if (tipo === 'prestador') {
        console.log('🔀 Redirecionando para perfil de prestador');
        window.location.href = '../../Perfil/PróprioTE/PróprioT/index.html';
      } else {
        console.log('🔀 Redirecionando para perfil de contratante');
        window.location.href = '../../Perfil/PróprioC/index.html';
      }
    }, 1500);

    console.log('═══════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ ERRO FATAL:', error);
    console.error('Stack trace:', error.stack);
    showToast(error.message || 'Erro ao realizar cadastro', 'error');
    setButtonLoading(btn, false);
  }
}

// === EVENT LISTENERS DOS BOTÕES DE SUBMIT ===
const btnEmpresa = $('btn-cadastroE');
const btnProfissional = $('btn-cadastroT');
const btnContratante = $('btn-cadastroC');

if (btnEmpresa) {
  btnEmpresa.addEventListener('click', (e) => {
    e.preventDefault();
    enviarCadastro('empresa', btnEmpresa);
  });
}

if (btnProfissional) {
  btnProfissional.addEventListener('click', (e) => {
    e.preventDefault();
    enviarCadastro('prestador', btnProfissional);
  });
}

if (btnContratante) {
  btnContratante.addEventListener('click', (e) => {
    e.preventDefault();
    enviarCadastro('contratante', btnContratante);
  });
}

switchTipo('empresa');

console.log('✅ Script carregado com sucesso!');
console.log(`🔧 API Base URL configurada: ${API_BASE_URL}`);