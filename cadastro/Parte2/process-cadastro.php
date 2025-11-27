<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

// GARANTIR QUE TEMOS OS DADOS DA PRIMEIRA ETAPA
if (!isset($_SESSION['email']) || !isset($_SESSION['password'])) {
    die("Erro: dados da primeira etapa não encontrados.");
}

// DADOS DA PRIMEIRA ETAPA
$email = $_SESSION['email'];
$password = $_SESSION['password'];

// DETERMINAR SE É EMPRESA OU PROFISSIONAL
$isEmpresa = isset($_POST['empresaArea']);
$isProfissional = isset($_POST['profissionalArea']);

// VARIÁVEL FINAL
$data = [
    "email" => $email,
    "password" => $password,
];

// ===============================================
// ------------ DADOS DO FORMULÁRIO DE EMPRESA ---
// ===============================================
if ($isEmpresa) {

    $data["tipo"] = "empresa";
    $data["nome_empresa"] = $_POST['empresaNome'] ?? "";
    $data["telefone"] = $_POST['registerTelEm'] ?? "";
    $data["cnpj"] = $_POST['empresaCnpj'] ?? "";
    $data["cep"] = $_POST['empresaCep'] ?? "";
    $data["endereco"] = $_POST['empresaEndereco'] ?? "";
    $data["numero"] = $_POST['empresaNumero'] ?? "";
    $data["bairro"] = $_POST['empresaBairro'] ?? "";
    $data["complemento"] = $_POST['empresaComplemento'] ?? "";
    $data["cidade"] = $_POST['empresaCidade'] ?? "";
    $data["estado"] = $_POST['empresaEstado'] ?? "";
    $data["area_empresa"] = $_POST['empresaArea'] ?? "";

    // IMAGENS
    if (isset($_FILES['empresaBanner'])) {
        $data["banner"] = base64_encode(file_get_contents($_FILES['empresaBanner']['tmp_name']));
    }

    if (isset($_FILES['empresaPerfil'])) {
        $data["perfil"] = base64_encode(file_get_contents($_FILES['empresaPerfil']['tmp_name']));
    }
}


// ===============================================
// -------- DADOS DO FORMULÁRIO DE PROFISSIONAL --
// ===============================================
if ($isProfissional) {

    $data["tipo"] = "profissional";
    $data["nome_completo"] = $_POST['profissionalNome'] ?? "";
    $data["telefone"] = $_POST['registerTelPro'] ?? "";
    $data["cpf"] = $_POST['profissionalCpf'] ?? "";
    $data["cep"] = $_POST['profissionalCep'] ?? "";
    $data["endereco"] = $_POST['profissionalEndereco'] ?? "";
    $data["numero"] = $_POST['profissionalNumero'] ?? "";
    $data["bairro"] = $_POST['profissionalBairro'] ?? "";
    $data["complemento"] = $_POST['profissionalComplemento'] ?? "";
    $data["cidade"] = $_POST['profissionalCidade'] ?? "";
    $data["estado"] = $_POST['profissionalEstado'] ?? "";
    $data["area_atuacao"] = $_POST['profissionalArea'] ?? "";

    // IMAGENS
    if (isset($_FILES['profissionalBanner'])) {
        $data["banner"] = base64_encode(file_get_contents($_FILES['profissionalBanner']['tmp_name']));
    }

    if (isset($_FILES['profissionalPerfil'])) {
        $data["perfil"] = base64_encode(file_get_contents($_FILES['profissionalPerfil']['tmp_name']));
    }
}


// ===============================================
// ----------- ENVIAR PARA A API LARAVEL ---------
// ===============================================

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "http://127.0.0.1:8000/api/usuario/cadastro",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode($data)
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);

header("Content-Type: application/json");
echo $response;
exit;

?>
