<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Opcional para testes

$files = glob(__DIR__ . "/data/*.xlsx");
$nomes = array_map("basename", $files);
echo json_encode($nomes);
?>
