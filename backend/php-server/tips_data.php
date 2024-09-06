<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

try {

    $query = "SELECT title, tip FROM tips";

    $stm = $pdo->prepare($query);
    $stm->execute();
    $tips = $stm->fetchAll(PDO::FETCH_ASSOC);

    if (empty($tips)) {
        echo json_encode([
            "status" => false,
            "message" => 'No tips found'
        ]);
        exit();
    }

    echo json_encode([
        "status" => true,
        "data" => $tips
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => $e->getMessage()
    ]);
}