<?php
header("Content-Type: application/json; charset=UTF-8");

// Conexão com o banco
$host = "localhost:3307";
$user = "root";
$pass = "";
$db   = "opi_bd";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Erro ao conectar ao banco."]);
    exit;
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos."]);
    exit;
}

// Buscar usuário pelo e-mail
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Verifica se existe
if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Usuário não encontrado."]);
    exit;
}

$user = $result->fetch_assoc();

// Verifica senha
if (!password_verify($password, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Senha incorreta."]);
    exit;
}

// Sucesso
echo json_encode([
    "success" => true,
    "message" => "Login realizado!",
    "type" => $user['type'],
    "id" => $user['id']
]);
?>