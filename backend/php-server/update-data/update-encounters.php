<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
session_start();

require_once __DIR__ . "/functions.php";


if (!isset($_ENV["API_KEY"])) {
    echo json_encode([
        "status" => false,
        "message" => "Environment variable API_KEY is not set"
    ]);
    exit();
}

if (!isset($_SESSION["token"])) {
    echo json_encode([
        "status" => false,
        "message" => "No token found. Please login"
    ]);
    exit();
}


$errors = [];


$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/encounters");
check_status($res);
$encounters = $res["data"];

foreach ($encounters as $i => $encounter) {
    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/encounters/" . $encounter["id"]);
    check_status($res);
    $encounters[$i] = $res["data"];
    // Add the encounter to the database
}


echo json_encode([
    "status" => true,
    "message" => "Data updated successfully"
]);
