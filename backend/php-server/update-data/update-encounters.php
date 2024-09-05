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

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all encounters from the API",
        "errors" => $res["message"]
    ]);
    exit();
}

$encounters = $res["data"];


foreach ($encounters as $i => $encounter) {
    if (!isset($encounter->id)) {
        $errors[] = [
            "context" => "Get an encounter from the API",
            "error" => "No id found for the encounter"
        ];
        continue;
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/encounters/" . $encounter->id);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Get an encounter from the API",
            "error" => $res["message"]
        ];
        continue;
    }

    $encounters[$i] = $res["data"];


    $res = set_encounter_from_api_data($encounters[$i]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Set an encounter in database from the API data",
            "error" => $res["message"]
        ];
    }
}


echo json_encode([
    "status" => true,
    "message" => "Encounters updated successfully",
    "errors" => $errors
]);
