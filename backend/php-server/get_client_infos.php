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

try {

    if ($_ENV["is_coach"]) {
        $query = "SELECT id, name, surname FROM customers WHERE removed = :removed, id_coach = :id_coach";
        $stm = $pdo->prepare($query);
        $stm->execute(["removed" => 0, "id_coach" => $_SESSION["id"]]);
    } else {
        $query = "SELECT id, name, surname FROM customers WHERE removed = :removed";
        $stm = $pdo->prepare($query);
        $stm->execute(["removed" => 0]);
    }

    $customers = $stm->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "data" => $customers
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}