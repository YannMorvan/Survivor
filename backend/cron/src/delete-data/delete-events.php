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


$res = get_events_removed_more_than_three_years_ago();

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all events removed more than three years ago",
        "error" => $res["message"]
    ]);
    exit();
}

$events = $res["data"];


foreach ($events as $i => $event) {
    $res = delete_event_customers($event["id"]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Delete event customers",
            "error" => $res["message"]
        ];
    }
}


$res = delete_events_removed_more_than_three_years_ago();

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "context" => "Delete events removed more than three years ago",
        "error" => $res["message"]
    ]);
    exit();
}


echo json_encode([
    "status" => true,
    "message" => "Events removed successfully",
    "errors" => $errors
]);
