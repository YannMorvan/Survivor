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


$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/tips");

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all tips from the API",
        "errors" => $res["message"]
    ]);
    exit();
}

$tips = $res["data"];


foreach ($tips as $i => $tip) {
    if (!isset($tip["id"])) {
        $errors[] = [
            "context" => "Get a tip from the API",
            "error" => "No id found for the tip"
        ];
        continue;
    }


    $res = set_tip_from_api_data($tip);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Set a tip in database from the API data",
            "error" => $res["message"]
        ];
    }
}


echo json_encode([
    "status" => true,
    "message" => "Data updated successfully",
    "errors" => $errors
]);
