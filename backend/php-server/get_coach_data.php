<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

try {

    $query = "SELECT id, name, surname FROM employees WHERE work = :work OR work = :work2";

    $stm = $pdo->prepare($query);
    $stm->execute([
        'work' => 'coach',
        'work2' => 'Coach'
    ]);

    $coaches = $stm->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "coaches" => $coaches
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        'error' => $e->getMessage()]);
}
