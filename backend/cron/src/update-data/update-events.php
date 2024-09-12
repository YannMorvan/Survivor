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


$res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/events");

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all events from the API",
        "errors" => $res["message"]
    ]);
    exit();
}

$events = $res["data"];


foreach ($events as $i => $event) {
    if (!isset($event->id)) {
        $errors[] = [
            "context" => "Get an event from the API",
            "error" => "No id found for the event"
        ];
        continue;
    }


    $res = do_event_exist_in_database($event->id);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Check if an event exists in database",
            "error" => $res["message"]
        ];
        continue;
    }
    if ($res["does_exist"] == true) {
        continue;
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/events/" . $event->id);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Get an event from the API",
            "error" => $res["message"]
        ];
        continue;
    }

    $events[$i] = $res["data"];


    $res = set_event_from_api_data($events[$i]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Set an event in database from the API data",
            "error" => $res["message"]
        ];
    }
}


echo json_encode([
    "status" => true,
    "message" => "Events updated successfully",
    "errors" => $errors
]);
