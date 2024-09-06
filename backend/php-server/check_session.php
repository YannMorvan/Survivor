<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
session_start();


if (!isset($_SESSION["token"]) || !isset($_SESSION["is_coach"])) {
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
