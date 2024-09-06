<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: image/png');
session_start();
require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

if (!isset($_POST['type'])) {
    echo json_encode([
        "status" => false,
        "message" => "Type is required"
    ]);
    exit();
}

try {

    $query = "SELECT ci.image FROM clothes c LEFT JOIN clothes_images ci ON c.id = ci.id_cloth WHERE c.type = :type";

    $stm = $pdo->prepare($query);
    $stm->execute(["type" => $_POST['type']]);
    $clothes = $stm->fetchAll(PDO::FETCH_ASSOC);

    if (empty($clothes)) {
        echo json_encode([
            "status" => false,
            "message" => "No clothes found"
        ]);
        exit();
    }

foreach ($clothes as $key => $cloth) {
    $clothes[$key]['image'] = base64_encode($cloth['image']);
}

// Log memory usage
error_log("Memory usage: " . memory_get_usage());

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