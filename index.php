<?php
// Arquivo de entrada do sistema TCC_site

require_once 'Core/Core.php';

// Configura CORS (necessário se for consumir via navegador/JS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Resposta imediata para requisições OPTIONS (pré-flight do CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Inicializa o Core apontando para a URL da API
$core = new Core('http://localhost:8000/api');
$core->start();
