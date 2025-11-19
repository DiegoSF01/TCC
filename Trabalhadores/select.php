<?php
// Conexão ao banco
$host = "localhost";
$user = "root";
$pass = "";
$db   = "opi_bd";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro ao conectar: " . $conn->connect_error);
}

// ID do usuário que você deseja buscar
$id_user = $_GET['id'] ?? 0;

// Consulta: junta users + prestador
$sql = "
    SELECT 
        users.id,
        users.email,
        users.type,
        prestador.nome,
        prestador.cpf,
        prestador.telefone,
        prestador.cep,
        prestador.rua,
        prestador.numero,
        prestador.bairro,
        prestador.complemento,
        prestador.localidade,
        prestador.estado,
        prestador.id_categoria,
        prestador.foto,
        prestador.banner
    FROM users
    INNER JOIN prestador ON prestador.id_user = users.id
    WHERE users.id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_user);
$stmt->execute();
$result = $stmt->get_result();

// Se achou algo
if ($result->num_rows > 0) {

    $row = $result->fetch_assoc();

    // Preenchendo variáveis
    $email       = $row['email'];
    $type        = $row['type'];
    $nome        = $row['nome'];
    $cpf         = $row['cpf'];
    $telefone    = $row['telefone'];
    $cep         = $row['cep'];
    $rua         = $row['rua'];
    $numero      = $row['numero'];
    $bairro      = $row['bairro'];
    $complemento = $row['complemento'];
    $localidade  = $row['localidade'];
    $estado      = $row['estado'];
    $categoria   = $row['id_categoria'];
    $foto        = $row['foto'];
    $banner      = $row['banner'];

    echo "<pre>";
    print_r($row);
    echo "</pre>";

} else {
    echo "Nenhum registro encontrado.";
}

?>