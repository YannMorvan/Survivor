<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

if (!isset($_POST['id'])) {
    echo json_encode([
        "status" => false,
        'message' => 'Missing required data'
    ]);
    exit();
}

try {

    $query = "SELECT * from employees WHERE id = :id";

    $stm = $pdo->prepare($query);
    $stm->execute([
        'id' => $_POST['id']
    ]);
    $coach = $stm->fetch(PDO::FETCH_ASSOC);
    $id_coach = $coach['id'];

    $query = "SELECT * from customers WHERE id_coach = :id_coach";

    $stm = $pdo->prepare($query);
    $stm->execute([
        'id_coach' => $id_coach
    ]);
    $customers = $stm->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        'coach' => $coach,
        'customers' => $customers
    ];

    echo json_encode([
        "status" => true,
        'data' => $response
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        'message' => $e->getMessage()
    ]);
}