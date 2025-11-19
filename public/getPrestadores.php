<?php
header("Content-Type: application/json");

// Conexão com o banco
$host = "localhost";
$user = "root";
$pass = "";
$db = "opi_bd";
$port = 3307;

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die(json_encode(["error" => "Erro na conexão: " . $conn->connect_error]));
}

// Consulta unindo todas as tabelas
$sql = "
    SELECT 
        users.email,
        prestador.nome,
        prestador.uf,
        prestador.cidade,
        contatos.telefone
    FROM users
    INNER JOIN prestador ON prestador.user_id = users.id
    INNER JOIN contatos ON contatos.user_id = users.id
";

$result = $conn->query($sql);

$prestadores = [];

while ($row = $result->fetch_assoc()) {
    $prestadores[] = $row;
}

echo json_encode($prestadores);
?>
