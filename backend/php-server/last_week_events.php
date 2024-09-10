<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}


header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

try {

    $current_date = date("Y-m-d H:i:s");
    $start_of_week = date("Y-m-d H:i:s", strtotime('monday this week'));

    $query = "SELECT * FROM events WHERE date >= :start_of_week AND date <= :current_date AND removed = 0";

    $stm = $pdo->prepare($query);
    $stm->execute([
        "start_of_week" => $start_of_week,
        "current_date" => $current_date
    ]);
    $events = $stm->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "events" => $events
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "status" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
