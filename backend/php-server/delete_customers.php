<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}


header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

require_once __DIR__ . "/db_connection.php";
require_once __DIR__ . "./functions.php";

try {

    $query = "UPDATE customers SET removed = 1";

    $stm = $pdo->prepare($query);
    $stm->execute();

    echo json_encode([
        "status" => true,
        "message" => "Customers deleted successfully"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}