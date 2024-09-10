<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}


header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once __DIR__ . '/db_connection.php';


try {

    $query = "SELECT DISTINCT type FROM clothes";

    $stm = $pdo->prepare($query);
    $stm->execute();
    $clothes = $stm->fetchAll(PDO::FETCH_ASSOC);


    if (empty($clothes)) {
        echo json_encode([
            "status" => false,
            "message" => "No clothes found"
        ]);
        exit();
    }


    echo json_encode([
        "status" => true,
        "data" => $clothes
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
