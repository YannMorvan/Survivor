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

require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/db_connection.php';

try {

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
    $encounters[$key] = [
        "source" => $encounter["source"],
        "date" => DateTime::createFromFormat("Y-m-d", $encounter["date"])->format("d/m/Y"),
    ];
}

    $query = "SELECT address FROM customers";

    $stm = $pdo->prepare($query);
    $stm->execute();
    $adresses = $stm->fetchAll(PDO::FETCH_ASSOC);

    // TODO: implement the missing graph's data


    echo json_encode([
        "status" => true,
        "data" => [
            "encounters" => $encounters,
            "events" => $events,
            "addresses" => $adresses
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}