<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . "/../functions.php";


parse_str(implode("&", array_slice($argv, 1)), $_POST);

$res = check_api_key_and_token($_ENV["API_KEY"], $_POST["token"]);

if ($res["status"] == false) {
    echo json_encode($res);
    exit();
}


$errors = [];


$res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/encounters");

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


    $res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/encounters/" . $encounter->id);

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
