<?php

header('Access-Control-Allow-Origin: *');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

try {
    $query = "SELECT type FROM clothes";

    $stm = $pdo->prepare($query);
    $stm->execute();
    $clothes = $stm->fetchAll(PDO::FETCH_ASSOC);

if (empty($clothes)) {
    echo json_encode([
        "status" => false,
        "message" => "No clothes found"
    ]);
    exit();
}

$types = [];

foreach ($clothes as $clothe) {
    if (!in_array($clothe['type'], $types)) {
        $types[] = $clothe['type'];
    }
}

$clothes = array_values($types);

    echo json_encode([
        "status" => true,
        "data" => $clothes
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
