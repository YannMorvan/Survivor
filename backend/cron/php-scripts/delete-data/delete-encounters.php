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


$res = delete_encounters_removed_more_than_three_years_ago();

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all encounters removed more than three years ago",
        "error" => $res["message"]
    ]);
    exit();
}


echo json_encode([
    "status" => true,
    "message" => "Encounters removed successfully"
]);
