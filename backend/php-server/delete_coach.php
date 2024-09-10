<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}


header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require_once __DIR__ . '/db_connection.php';


if (!isset($_POST['id'])) {
    echo json_encode([
        "status" => false,
        "message" => "No id provided"
    ]);
}


try {

    $query = "UPDATE employees SET removed = :removed WHERE id = :id";

    $stm = $pdo->prepare($query);
    $res = $stm->execute([
        "id" => $_POST['id'],
        "removed" => 1
    ]);

    if ($res == true) {
        echo json_encode([
            "status" => true,
            "message" => "Coach deleted successfully"
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Error: Coach not deleted"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
