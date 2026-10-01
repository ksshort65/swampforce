<?php
// SwampForce: the small backend for admin.html.
// - First visit: Karen creates her own password. Only its password_hash is stored, in
//   data/private/admin-password.php (web access to data/private is blocked by .htaccess,
//   and the file starts with an exit line, so even if it were opened it shows nothing).
// - After that she logs in (PHP session).
// - Save adds one entry to data/database.json: file lock, validation, a timestamped backup
//   copy in data/private/backups, then an atomic write (temporary file + rename).
// Works with PHP 7.4 or newer.

declare(strict_types=1);

const SF_PRIVATE = __DIR__ . '/private';
const SF_HASH_FILE = SF_PRIVATE . '/admin-password.php';
const SF_DB_FILE = __DIR__ . '/database.json';
const SF_LOCK_FILE = SF_PRIVATE . '/database.lock';
const SF_BACKUPS = SF_PRIVATE . '/backups';
const SF_STATUSES = ['Verified', 'Debunked', 'Research'];
const SF_IDLE_SECONDS = 8 * 3600;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function sf_out(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function sf_fail(int $code, string $message): void
{
    sf_out($code, ['ok' => false, 'error' => $message]);
}

function sf_https(): bool
{
    if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') return true;
    if (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443') return true;
    return isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower((string) $_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https';
}

function sf_start_session(): void
{
    $path = rtrim(str_replace('\\', '/', dirname((string) ($_SERVER['SCRIPT_NAME'] ?? '/data/save.php'))), '/') . '/';
    session_name('SFADMIN');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => $path,
        'secure' => sf_https(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();
    if (!empty($_SESSION['in']) && (time() - (int) ($_SESSION['seen'] ?? 0)) > SF_IDLE_SECONDS) {
        $_SESSION = [];
    }
    if (!empty($_SESSION['in'])) $_SESSION['seen'] = time();
}

function sf_password_hash_stored(): ?string
{
    if (!is_file(SF_HASH_FILE)) return null;
    $raw = (string) file_get_contents(SF_HASH_FILE);
    if (preg_match('/^HASH:(\S+)$/m', $raw, $m)) return $m[1];
    return null;
}

function sf_logged_in(): bool
{
    return !empty($_SESSION['in']) && sf_password_hash_stored() !== null;
}

function sf_log_in(): string
{
    session_regenerate_id(true);
    $_SESSION['in'] = true;
    $_SESSION['seen'] = time();
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

function sf_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 20000) sf_fail(400, 'The request was too large.');
    $data = json_decode($raw, true);
    if (!is_array($data)) sf_fail(400, 'The request could not be read.');
    return $data;
}

function sf_require_token(): void
{
    $sent = (string) ($_SERVER['HTTP_X_SF_TOKEN'] ?? '');
    if (!sf_logged_in()) sf_fail(401, 'Please log in again.');
    if ($sent === '' || !hash_equals((string) ($_SESSION['csrf'] ?? ''), $sent)) sf_fail(403, 'Please log in again.');
}

function sf_ensure_private(): void
{
    if (!is_dir(SF_PRIVATE) && !@mkdir(SF_PRIVATE, 0755, true)) sf_fail(500, 'The private folder could not be created.');
    if (!is_dir(SF_BACKUPS) && !@mkdir(SF_BACKUPS, 0755, true)) sf_fail(500, 'The backups folder could not be created.');
    $deny = "# No web access to anything in this folder (password hash, backups, lock file).\n"
        . "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n"
        . "<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n";
    if (!is_file(SF_PRIVATE . '/.htaccess')) @file_put_contents(SF_PRIVATE . '/.htaccess', $deny);
}

function sf_clean_text(string $s): string
{
    $s = str_replace(["\r\n", "\r"], "\n", $s);
    $s = preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', $s);
    if ($s === null) sf_fail(400, 'The headline has characters that could not be read.');
    return trim(preg_replace('/\s+/u', ' ', $s) ?? '');
}

function sf_length(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

$action = (string) ($_GET['action'] ?? '');
$method = (string) ($_SERVER['REQUEST_METHOD'] ?? 'GET');
sf_start_session();

if ($action === 'state' && $method === 'GET') {
    $in = sf_logged_in();
    sf_out(200, [
        'ok' => true,
        'passwordSet' => sf_password_hash_stored() !== null,
        'loggedIn' => $in,
        'token' => $in ? (string) ($_SESSION['csrf'] ?? '') : null,
    ]);
}

if ($method !== 'POST') sf_fail(405, 'Not allowed.');
$ctype = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
if (strpos($ctype, 'application/json') !== 0) sf_fail(415, 'The request could not be read.');

if ($action === 'setup') {
    $in = sf_input();
    $pw = (string) ($in['password'] ?? '');
    $again = (string) ($in['confirm'] ?? '');
    if (sf_password_hash_stored() !== null) sf_fail(409, 'A password has already been set. Please log in.');
    if (sf_length($pw) < 8) sf_fail(400, 'The password must be at least 8 characters.');
    if (strlen($pw) > 200) sf_fail(400, 'The password is too long.');
    if (!hash_equals($pw, $again)) sf_fail(400, 'The two passwords do not match.');
    sf_ensure_private();
    $hash = password_hash($pw, PASSWORD_DEFAULT);
    // "x" creates the file only if it does not exist yet, so only one first-time setup can win.
    $fh = @fopen(SF_HASH_FILE, 'x');
    if ($fh === false) sf_fail(409, 'A password has already been set. Please log in.');
    fwrite($fh, "<?php exit; ?>\nHASH:" . $hash . "\n");
    fclose($fh);
    @chmod(SF_HASH_FILE, 0600);
    sf_out(200, ['ok' => true, 'token' => sf_log_in()]);
}

if ($action === 'login') {
    $in = sf_input();
    $pw = (string) ($in['password'] ?? '');
    $hash = sf_password_hash_stored();
    if ($hash === null) sf_fail(409, 'No password has been set yet.');
    if ($pw === '' || strlen($pw) > 200 || !password_verify($pw, $hash)) {
        sleep(2); // slows down guessing
        sf_fail(401, 'That password is not right.');
    }
    if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
        $tmp = SF_HASH_FILE . '.tmp';
        if (@file_put_contents($tmp, "<?php exit; ?>\nHASH:" . password_hash($pw, PASSWORD_DEFAULT) . "\n") !== false) {
            @chmod($tmp, 0600);
            @rename($tmp, SF_HASH_FILE);
        }
    }
    sf_out(200, ['ok' => true, 'token' => sf_log_in()]);
}

if ($action === 'logout') {
    sf_require_token();
    $_SESSION = [];
    session_destroy();
    sf_out(200, ['ok' => true]);
}

if ($action === 'add') {
    sf_require_token();
    $in = sf_input();
    $headline = sf_clean_text((string) ($in['headline'] ?? ''));
    $source = trim((string) ($in['source'] ?? ''));
    $status = (string) ($in['status'] ?? '');
    $category = trim((string) ($in['category'] ?? ''));

    if ($headline === '') sf_fail(400, 'Please type a headline.');
    if (sf_length($headline) > 1000) sf_fail(400, 'The headline is too long (1,000 characters at most).');
    if ($source === '') sf_fail(400, 'Please paste the source evidence link.');
    if (strlen($source) > 2000 || !preg_match('#^https?://#i', $source) || filter_var($source, FILTER_VALIDATE_URL) === false) {
        sf_fail(400, 'The source link must be a full web address starting with http:// or https://');
    }
    if (!in_array($status, SF_STATUSES, true)) sf_fail(400, 'Please choose a status.');

    sf_ensure_private();
    $lock = fopen(SF_LOCK_FILE, 'c');
    if ($lock === false || !flock($lock, LOCK_EX)) sf_fail(500, 'The data file is busy. Please try again.');

    $raw = @file_get_contents(SF_DB_FILE);
    if ($raw === false) sf_fail(500, 'The data file could not be read.');
    $db = json_decode($raw); // objects stay objects, so nothing in the file changes shape
    if (!is_object($db) || !isset($db->entries) || !is_array($db->entries) || !isset($db->categories) || !is_array($db->categories)) {
        sf_fail(500, 'The data file is not in the expected format. Nothing was saved.');
    }
    if ($category !== '') {
        $known = false;
        foreach ($db->categories as $c) {
            if (is_object($c) && isset($c->key) && $c->key === $category) $known = true;
        }
        if (!$known) sf_fail(400, 'Please choose a topic from the list.');
    }

    $now = time();
    $id = 'new-' . gmdate('YmdHis', $now) . '-' . bin2hex(random_bytes(3));
    $entry = (object) [
        'id' => $id,
        'category' => $category === '' ? null : $category,
        'headline' => $headline,
        'sources' => [(object) ['label' => $source, 'href' => $source]],
        'status' => $status,
        'layers' => (object) ['tile' => $category === '' ? null : $category],
        'added' => gmdate('Y-m-d\TH:i:s\Z', $now),
    ];
    $db->entries[] = $entry;

    $flags = JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_LINE_TERMINATORS | JSON_PRESERVE_ZERO_FRACTION | JSON_PRETTY_PRINT;
    $json = json_encode($db, $flags);
    if ($json === false) sf_fail(500, 'The entry could not be saved.');
    // One space per level (PHP writes four), the same layout the file already uses.
    $json = preg_replace_callback('/^( +)/m', function ($m) {
        return str_repeat(' ', intdiv(strlen($m[1]), 4));
    }, $json) . "\n";
    if (json_decode($json) === null) sf_fail(500, 'The entry could not be saved.');

    $backup = SF_BACKUPS . '/database-' . gmdate('Ymd-His', $now) . '-' . bin2hex(random_bytes(2)) . '.json';
    if (!@copy(SF_DB_FILE, $backup)) sf_fail(500, 'The backup copy could not be made. Nothing was saved.');

    $tmp = @tempnam(__DIR__, '.database-');
    if ($tmp === false || @file_put_contents($tmp, $json) !== strlen($json)) {
        if ($tmp) @unlink($tmp);
        sf_fail(500, 'The data file could not be written. Nothing was saved.');
    }
    @chmod($tmp, 0644); // database.json stays readable by everyone
    if (!@rename($tmp, SF_DB_FILE)) {
        @unlink($tmp);
        sf_fail(500, 'The data file could not be replaced. Nothing was saved.');
    }
    flock($lock, LOCK_UN);
    fclose($lock);

    sf_out(200, [
        'ok' => true,
        'entry' => $entry,
        'total' => count($db->entries),
        'backup' => basename($backup),
    ]);
}

sf_fail(404, 'Unknown request.');
