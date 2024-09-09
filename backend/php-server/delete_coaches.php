<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

try {

    $query = "DELETE FROM employees WHERE work = :work AND work = :work2";

    $stm = $pdo->prepare($query);
    $stm->execute([
        "work" => "coach",
        "work2" => "Coach"
    ]);

    echo json_encode([
        "status" => true,
        "message" => "Coaches deleted successfully"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}