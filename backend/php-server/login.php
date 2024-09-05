<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
session_start();

require_once __DIR__ . "/functions.php";


if (!isset($_ENV["API_KEY"])) {
    echo json_encode([
        "status" => false,
        "message" => "API key is not set"
    ]);
    exit();
}


if (!isset($_POST["email"]) || !isset($_POST["password"])) {
    echo json_encode([
        "status" => false,
        "message" => "Email or password or both are not provided"
    ]);
    exit();
}


$res = login($_ENV["API_KEY"], $_POST["email"], $_POST["password"]);

if ($res["status"] == false) {
    echo json_encode($res);
}


$_SESSION["token"] = $res["token"];

echo json_encode([
    "status" => true,
    "message" => "Logged in successfully"
]);
