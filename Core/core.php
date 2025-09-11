<?php
class Core
{
    private $apiBaseUrl;

    public function __construct($apiBaseUrl)
    {
        // URL base da API, ex: http://localhost:8000/api
        $this->apiBaseUrl = rtrim($apiBaseUrl, '/');
    }

    public function start()
    {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); // ex: /api/login
        $method = $_SERVER['REQUEST_METHOD'];

        // Remove prefixo /api se existir
        if (strpos($path, '/api/') === 0) {
            $path = substr($path, 4); // remove "/api"
        }

        $url = $this->apiBaseUrl . $path;

        // Prepara os dados para POST/PUT
        $data = [];
        if ($method === 'POST' || $method === 'PUT') {
            $input = file_get_contents("php://input");
            $data = json_decode($input, true) ?: [];
        }

        $response = $this->callApi($url, $method, $data);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($response);
    }

    private function callApi($url, $method = 'GET', $data = [])
    {
        $ch = curl_init();

        if ($method === 'GET' && !empty($data)) {
            $url .= '?' . http_build_query($data);
        }

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if (($method === 'POST' || $method === 'PUT') && !empty($data)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        }

        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);
            return ['error' => $error];
        }

        curl_close($ch);

        $decoded = json_decode($result, true);
        if ($decoded === null) {
            return ['error' => 'Invalid JSON response', 'raw' => $result, 'http_code' => $httpCode];
        }

        return $decoded;
    }
}
