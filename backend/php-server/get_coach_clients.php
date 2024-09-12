<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}


header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
session_start();

require_once __DIR__ . '/db_connection.php';

try {

    $query = "SELECT id, name, surname FROM customers WHERE id_coach = :id_coach AND removed = :removed";

    $stm = $pdo->prepare($query);
    $stm->execute([
        'id_coach' => $_SESSION['id_employee'],
        'removed' => 0
    ]);
    $clients = $stm->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "clients" => $clients
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        'error' => $e->getMessage()]);
}