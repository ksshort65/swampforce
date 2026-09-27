<?php
// Lists images dropped into incoming/<section>/<chart>/. A file named <image>.url holds the proof link.
header('Content-Type: application/json'); header('Cache-Control: no-store');
$base = __DIR__; $out = new stdClass();
foreach (['betrayal','scorecard'] as $sec) {
  foreach (glob("$base/$sec/*", GLOB_ONLYDIR) as $dir) {
    $chart = basename($dir); $items = [];
    $files = glob("$dir/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}", GLOB_BRACE); sort($files);
    foreach ($files as $f) {
      $name = basename($f); $url = null;
      if (is_file("$f.url")) { $u = trim(strtok(file_get_contents("$f.url"), "\r\n")); if (preg_match('#^https?://#i', $u)) $url = $u; }
      $items[] = ['img' => "incoming/$sec/$chart/" . rawurlencode($name), 'url' => $url];
    }
    $out->{"$sec/$chart"} = $items;
  }
}
echo json_encode($out, JSON_UNESCAPED_SLASHES);
