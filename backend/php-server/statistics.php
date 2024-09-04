<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/fuctions.php';
require_once __DIR__ . '/db_connection.php';

$query = "SELECT * FROM events";

$stm = $pdo->prepare($query);
$stm->execute();
$events = $stm->fetchAll(PDO::FETCH_ASSOC);

if (empty($events)) {
    echo json_encode([
        "status" => false,
        "message" => "No events found"
    ]);
    exit();
}

$query = "SELECT * FROM encounters";

$stm = $pdo->prepare($query);
$stm->execute();
$encounters = $stm->fetchAll(PDO::FETCH_ASSOC);

if (empty($encounters)) {
    echo json_encode([
        "status" => false,
        "message" => "No encounters found"
    ]);
    exit();
}

foreach ($encounters as $key => $encounter) {
    $encounters[$key] = $encounter["source"];
}

// TODO: implement the missing graph's data


echo json_encode([
    "status" => true,
    "data" =>  [
        "encounters" => $encounters,
        "events" => $events
    ]
]);