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
require_once __DIR__ . '/functions.php';

try {

    $query = "SELECT * FROM employees WHERE id = :id AND removed = 0";

    $stm = $pdo->prepare($query);
    $stm->execute([
        'id' => $_POST['id_coach']
    ]);
    $coach = $stm->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "coach" => $coach
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        'error' => $e->getMessage()]);
}