<?php
$target_dir = "data/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0755, true);
}

if ($_FILES["file"]["type"] === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    $target_file = $target_dir . basename($_FILES["file"]["name"]);
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Falha ao mover o arquivo."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Tipo de arquivo inválido."]);
}
?>
