<?php
class Core
{
    private $apiBaseUrl;

    public function __construct($apiBaseUrl)
    {
        // URL base da API  http://172.26.0.1:8000/api
        $this->apiBaseUrl = rtrim($apiBaseUrl, '/');
    }

    public function start()
    {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); 
        $method = $_SERVER['REQUEST_METHOD'];

        // Remove prefixo /api/ se existir
        if (strpos($path, '/api/') === 0) {
            $path = substr($path, 5); // remove "/api/"
        }

        $url = $this->apiBaseUrl . '/' . ltrim($path, '/');

        // Prepara dados para POST/PUT
        $data = [];
        if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
            $input = file_get_contents("php://input");
            $data = json_decode($input, true) ?: [];
        }

        // Chama a API
        $response = $this->callApi($url, $method, $data);

        // Retorna resposta final
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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

        if (in_array($method, ['POST', 'PUT', 'PATCH']) && !empty($data)) {
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
            return [
                'error' => 'Invalid JSON response',
                'raw' => $result,
                'http_code' => $httpCode
            ];
        }

        return [
            'status' => $httpCode,
            'data' => $decoded
        ];
    }
}
