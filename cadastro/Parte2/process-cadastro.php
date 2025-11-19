<?php
header("Content-Type: application/json; charset=UTF-8");

// ---------------------
// BANCO DE DADOS
// ---------------------
$host = "localhost:3307";
$user = "root";
$pass = "";
$db   = "opi_bd";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Erro ao conectar ao banco."]);
    exit;
}

// ---------------------
// RECEBE DADOS
// ---------------------
$tipo = $_POST['tipo'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password || !$tipo) {
    echo json_encode(["success" => false, "message" => "Dados incompletos."]);
    exit;
}

// Verifica tipo permitido
if (!in_array($tipo, ["empresa", "prestador", "contratante"])) {
    echo json_encode(["success" => false, "message" => "Tipo inválido."]);
    exit;
}

// ---------------------
// VERIFICAR SE EMAIL EXISTE
// ---------------------
$sql = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$sql->execute([$email]);
if ($sql->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "E-mail já cadastrado."]);
    exit;
}

// ---------------------
// CRIA USUÁRIO (TABELA users)
// ---------------------

$hash = password_hash($password, PASSWORD_DEFAULT);

$insertUser = $pdo->prepare("
    INSERT INTO users (email, password, type)
    VALUES (?, ?, ?)
");

if (!$insertUser->execute([$email, $hash, $tipo])) {
    echo json_encode(["success" => false, "message" => "Erro ao criar usuário."]);
    exit;
}

$user_id = $pdo->lastInsertId();

// ---------------------
// PREPARA UPLOADS
// ---------------------

function salvarArquivo($campo, $prefixo) {
    if (!isset($_FILES[$campo]) || $_FILES[$campo]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $ext = pathinfo($_FILES[$campo]['name'], PATHINFO_EXTENSION);
    $nome = $prefixo . "_" . time() . "." . $ext;

    $pasta = __DIR__ . "/uploads/";

    if (!is_dir($pasta)) {
        mkdir($pasta, 0777, true);
    }

    $destino = $pasta . $nome;

    if (move_uploaded_file($_FILES[$campo]['tmp_name'], $destino)) {
        return "uploads/" . $nome;
    }

    return null;
}

$foto = salvarArquivo("foto", "foto");
$capa = salvarArquivo("capa", "capa");

// ---------------------
// CAMPOS COMUNS
// ---------------------
$cep = $_POST['cep'] ?? '';
$rua = $_POST['rua'] ?? '';
$numero = $_POST['numero'] ?? '';
$localidade = $_POST['localidade'] ?? '';
$uf = $_POST['uf'] ?? '';
$estado = $_POST['estado'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$infoadd = $_POST['infoadd'] ?? '';

// ---------------------
// CADASTRAR POR TIPO
// ---------------------

if ($tipo === "empresa") {

    $cnpj = $_POST['cnpj'] ?? '';
    $razao = $_POST['razao_social'] ?? '';
    $categoria = $_POST['id_categoria'] ?? '';

    $sql = $pdo->prepare("
        INSERT INTO empresa (user_id, cnpj, razao_social, foto, capa, localidade, uf, estado, cep, rua, numero, descricao, id_categoria)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $ok = $sql->execute([
        $user_id, $cnpj, $razao, $foto, $capa,
        $localidade, $uf, $estado, $cep, $rua, $numero,
        $descricao, $categoria
    ]);
}

else if ($tipo === "prestador") {

    $nome = $_POST['nome'] ?? '';
    $cpf  = $_POST['cpf'] ?? '';
    $ramo = $_POST['id_ramo'] ?? '';

    $sql = $pdo->prepare("
        INSERT INTO prestador (user_id, nome, cpf, foto, capa, localidade, uf, estado, cep, rua, numero, descricao, id_ramo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $ok = $sql->execute([
        $user_id, $nome, $cpf, $foto, $capa,
        $localidade, $uf, $estado, $cep, $rua, $numero,
        $descricao, $ramo
    ]);
}

else if ($tipo === "contratante") {

    $nome = $_POST['nome'] ?? '';
    $cpf = $_POST['cpf'] ?? '';

    $sql = $pdo->prepare("
        INSERT INTO contratante (user_id, nome, cpf, foto, capa, localidade, uf, estado, cep, rua, numero)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $ok = $sql->execute([
        $user_id, $nome, $cpf, $foto, $capa,
        $localidade, $uf, $estado, $cep, $rua, $numero
    ]);
}

if (!$ok) {
    echo json_encode(["success" => false, "message" => "Erro ao salvar dados."]);
    exit;
}

// ---------------------
// SUCESSO
// ---------------------
echo json_encode([
    "success" => true,
    "message" => "Cadastro concluído!",
    "user_id" => $user_id,
    "type" => $tipo
]);
?>
