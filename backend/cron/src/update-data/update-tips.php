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


$res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/tips");

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
    "message" => "Tips updated successfully",
    "errors" => $errors
]);
