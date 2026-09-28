<?php
/**
 * Приём заявок с формы и пересылка в Telegram.
 * Работает на обычном PHP-хостинге (Beget, Timeweb, REG.RU и любой другой).
 * Код написан под PHP 7.1+ без конструкций из PHP 8.
 *
 * Настройка: рядом с этим файлом создайте config.php — образец в config.example.php.
 * Файл config.php не должен попадать в репозиторий.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond($ok, $error = null)
{
    $payload = $ok ? array('ok' => true) : array('ok' => false, 'error' => $error);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean_value($value, $max = 300)
{
    if (!is_string($value)) {
        return '';
    }
    $value = trim($value);
    if ($value === '') {
        return '';
    }
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return substr($value, 0, $max);
}

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'method_not_allowed');
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    respond(false, 'not_configured');
}

$config = require $configPath;
$token = isset($config['token']) ? trim((string) $config['token']) : '';
$chatId = isset($config['chat_id']) ? trim((string) $config['chat_id']) : '';

if ($token === '' || $chatId === '') {
    respond(false, 'not_configured');
}

$raw = file_get_contents('php://input');
$input = json_decode((string) $raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

$name = clean_value(isset($input['name']) ? $input['name'] : '', 120);
$contact = clean_value(isset($input['contact']) ? $input['contact'] : '', 120);
$page = clean_value(isset($input['page']) ? $input['page'] : '', 200);
$message = clean_value(isset($input['message']) ? $input['message'] : '', 2000);

if ($message === '') {
    respond(false, 'empty_message');
}

$lines = array(
    '<b>Новая заявка с сайта</b>',
    '',
    '<b>Имя:</b> ' . ($name !== '' ? $name : '—'),
    '<b>Контакт:</b> ' . ($contact !== '' ? $contact : '—'),
);
if ($page !== '') {
    $lines[] = '<b>Страница:</b> ' . $page;
}
$lines[] = '';
$lines[] = $message;

$payload = json_encode(array(
    'chat_id' => $chatId,
    'text' => implode("\n", $lines),
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
), JSON_UNESCAPED_UNICODE);

$url = 'https://api.telegram.org/bot' . $token . '/sendMessage';

if (function_exists('curl_init')) {
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 20);
    $result = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($result === false || $status !== 200) {
        respond(false, 'telegram_' . ($status > 0 ? $status : 'network_error'));
    }
} else {
    $context = stream_context_create(array(
        'http' => array(
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $payload,
            'timeout' => 20,
            'ignore_errors' => true,
        ),
    ));
    if (@file_get_contents($url, false, $context) === false) {
        respond(false, 'network_error');
    }
}

respond(true);
