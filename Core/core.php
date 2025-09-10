<?php
class Core
{
    public function start($urlGet)
    {
        $debug = true; // Ative só para debug, desligue em produção

        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); // ex: /api/usuario/15
        if ($debug) {
            error_log("[Core DEBUG] REQUEST_URI=" . ($_SERVER['REQUEST_URI'] ?? '') . " | PATH={$path}");
        }

        // --- tratamento de arquivos estáticos ---
        if (preg_match('/\.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$/i', $path)) {

            // mantém /api na URL, mas ignora na hora de procurar no disco
            $relative = $path;
            if (strpos($relative, '/api/') === 0) {
                $relative = substr($relative, 4); // remove apenas "/api"
            }

            $relative = '/' . ltrim(urldecode($relative), '/');

            $candidates = [
                __DIR__ . '/../Views' . $relative,
                __DIR__ . '/..' . $relative,
                __DIR__ . '/../public' . $relative,
            ];

            if ($debug) {
                error_log("[Core DEBUG] relative={$relative}");
                error_log("[Core DEBUG] candidates=" . implode(' | ', $candidates));
            }

            foreach ($candidates as $candidate) {
                $file = realpath($candidate) ?: $candidate;
                if ($file && is_file($file) && is_readable($file)) {
                    $projectRoot = realpath(__DIR__ . '/..');
                    if ($projectRoot && strpos($file, $projectRoot) !== 0) {
                        continue; // segurança
                    }

                    $mimes = [
                        'css'  => 'text/css',
                        'js'   => 'application/javascript',
                        'png'  => 'image/png',
                        'jpg'  => 'image/jpeg',
                        'jpeg' => 'image/jpeg',
                        'gif'  => 'image/gif',
                        'ico'  => 'image/x-icon',
                        'svg'  => 'image/svg+xml',
                        'webp' => 'image/webp'
                    ];
                    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                    $mime = $mimes[$ext] ?? 'application/octet-stream';

                    header('Content-Type: ' . $mime);
                    header('Content-Length: ' . filesize($file));
                    header('Cache-Control: public, max-age=86400');
                    if ($debug) error_log("[Core DEBUG] Servindo: {$file} (mime={$mime})");
                    readfile($file);
                    exit;
                }
            }

            if ($debug) error_log("[Core DEBUG] Arquivo estático não encontrado para path={$path}");
            http_response_code(404);
            exit("Arquivo {$path} não encontrado");
        }

        // --- roteamento da API ---
        // remove prefixo "/api" da URL
        $url = $path;
        if (strpos($url, '/api/') === 0) {
            $url = substr($url, 5); // remove "/api/"
        } elseif ($url === '/api') {
            $url = '';
        }

        $url = trim($url, '/');
        $urlPartes = $url !== '' ? explode('/', $url) : [];

        if (!empty($urlPartes[0])) {
            $controller = 'Controller\\' . ucfirst($urlPartes[0]) . 'Controller';
        } else {
            $controller = 'Controller\\LoginController'; // controller padrão
        }

        $id = $urlPartes[1] ?? null;

        if (!class_exists($controller)) {
            http_response_code(404);
            echo json_encode(['erro' => 'Controller não encontrado']);
            exit;
        }
        $controllerInstance = new $controller();

        $method = $_SERVER['REQUEST_METHOD'];
        switch ($method) {
            case 'GET':
                $action = $id ? 'show' : 'index';
                break;
            case 'POST':
                $action = 'store';
                break;
            case 'PUT':
                $action = 'update';
                parse_str(file_get_contents("php://input"), $_PUT);
                $_REQUEST = $_PUT;
                break;
            case 'DELETE':
                $action = 'delete';
                break;
            default:
                http_response_code(405);
                echo json_encode(['erro' => 'Método não permitido']);
                exit;
        }

        if (!method_exists($controllerInstance, $action)) {
            http_response_code(404);
            echo json_encode(['erro' => 'Método não encontrado']);
            exit;
        }

        $response = call_user_func_array([$controllerInstance, $action], [$id]);

        $isJsonRequest = isset($_SERVER['HTTP_ACCEPT']) &&
                         strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

        if ($isJsonRequest) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($response);
            return;
        }

        return;
    }
}

