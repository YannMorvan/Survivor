<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

if (!isset($_POST["id"])) {
    echo json_encode([
        "status" => false,
        "message" => "No user id provided"
    ]);
    exit();
}

try {
    $query = "SELECT type FROM clothes";

    $stm = $pdo->prepare($query);
    $stm->execute();
    $clothes = $stm->fetchAll(PDO::FETCH_ASSOC);
    $uniqueTypes = array_unique(array_column($clothes, 'type'));

    $imagesByType = [];

    foreach ($uniqueTypes as $type) {
        $imagesByType[$type] = [];
    }
    $query = "SELECT c.type, ci.image from clothes c JOIN clothes_images ci ON c.id = ci.id_cloth WHERE c.id_customer = :id";
    $stm = $pdo->prepare($query);
    $stm->execute(["id" => $_POST["id"]]);
    $results = $stm->fetchAll(PDO::FETCH_ASSOC);

    foreach ($results as $row) {
        $imagesByType[$row['type']][] = base64_encode($row['image']);
    }

    echo json_encode([
        "status" => true,
        "data" => $imagesByType
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
    exit();
}
