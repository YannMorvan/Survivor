<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

try {

    $query = "SELECT * FROM employees WHERE id = :id";

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