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


if (!isset($_SESSION["id_employee"]) || !isset($_SESSION["is_coach"])) {
    echo json_encode([
        "status" => false,
        "message" => "Session not found"
    ]);
    exit();
}


echo json_encode([
    "status" => true,
    "isCoach" => $_SESSION["is_coach"]
]);
