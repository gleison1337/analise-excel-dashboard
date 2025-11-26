<?php
$filename = $_POST["filename"] ?? "";
$filepath = "data/" . basename($filename);

if (file_exists($filepath)) {
    unlink($filepath);
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Arquivo não encontrado."]);
}
?>
