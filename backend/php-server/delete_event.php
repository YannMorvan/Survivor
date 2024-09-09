<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

if (!isset($_POST['id'])) {
    echo json_encode([
        "status" => false,
        "message" => "No id provided"
    ]);
}

try {

    $query = "UPDATE events SET removed = 1 WHERE id = :id";

    $stm = $pdo->prepare($query);
    $stm->execute([
        "id" => $_POST['id']
    ]);

    echo json_encode([
        "status" => true,
        "message" => "Event deleted successfully"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
