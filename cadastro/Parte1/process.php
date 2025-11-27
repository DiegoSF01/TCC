<?php

// Validar se foi enviado por POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Método inválido.");
} 
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;
$confirm = $_POST['confirmPassword'] ?? null;

if (!$email || !$password || !$confirm) {
    die("Erro: campos incompletos.");
}

if ($password !== $confirm) {
    die("Erro: as senhas não coincidem.");
}
// SALVAR NA SESSÃO PARA A SEGUNDA ETAPA
$_SESSION['email'] = $email;
$_SESSION['password'] = $password;

// REDIRECIONAR PARA A SEGUNDA ETAPA
header("Location: Parte2/index.html");
exit();
?>