<?php
/**
 * Приём заявок с формы и пересылка в Telegram.
 * Работает на обычном PHP-хостинге (Beget, Timeweb, REG.RU и любой другой).
 *
 * Настройка: рядом с этим файлом создайте config.php — образец в config.example.php.
 * Файл config.php не должен попадать в репозиторий.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(bool $ok, ?string $error = null): never
{
    echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error], JSON_UNESCAPED_UNICODE);
    exit;
}

function clean(mixed $value, int $max = 300): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = trim($value);
    return mb_substr($value, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    respond(false, 'method_not_allowed');
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    respond(false, 'not_configured');
}

/** @var array{token?: string, chat_id?: string} $config */
$config = require $configPath;
$token = (string) ($config['token'] ?? '');
$chatId = (string) ($config['chat_id'] ?? '');

if ($token === '' || $chatId === '') {
    respond(false, 'not_configured');
}

$raw = file_get_contents('php://input') ?: '';
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

$name = clean($input['name'] ?? '', 120);
$contact = clean($input['contact'] ?? '', 120);
$page = clean($input['page'] ?? '', 200);
$message = clean($input['message'] ?? '', 2000);

if ($message === '') {
    respond(false, 'empty_message');
}

$lines = [
    '<b>Новая заявка с сайта</b>',
    '',
    '<b>Имя:</b> ' . ($name !== '' ? $name : '—'),
    '<b>Контакт:</b> ' . ($contact !== '' ? $contact : '—'),
];
if ($page !== '') {
    $lines[] = '<b>Страница:</b> ' . $page;
}
$lines[] = '';
$lines[] = $message;

$payload = json_encode([
    'chat_id' => $chatId,
    'text' => implode("\n", $lines),
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
], JSON_UNESCAPED_UNICODE);

$url = 'https://api.telegram.org/bot' . $token . '/sendMessage';

if (function_exists('curl_init')) {
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $result = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($result === false || $status !== 200) {
        respond(false, 'telegram_' . ($status ?: 'network_error'));
    }
} else {
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $payload,
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ]);
    $result = @file_get_contents($url, false, $context);
    if ($result === false) {
        respond(false, 'network_error');
    }
}

respond(true);
