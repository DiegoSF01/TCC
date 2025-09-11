<?php
// Arquivo de entrada do sistema TCC_site

require_once 'Core/Core.php';

// Define cabeçalho JSON
header('Content-Type: application/json; charset=utf-8');

// Inicializa o Core apontando para a URL da API
$core = new Core('http://localhost:8000/api'); // URL da sua API
$core->start();
