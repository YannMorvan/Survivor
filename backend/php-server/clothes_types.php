<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Origin: *');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

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

echo json_encode([
    "status" => true,
    "data" => $clothes
]);