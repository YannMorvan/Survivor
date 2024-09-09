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


$res = get_employees_removed_more_than_three_years_ago();

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all employees removed more than three years ago",
        "error" => $res["message"]
    ]);
    exit();
}

$employees = $res["data"];


foreach ($employees as $i => $employee) {
    $res = delete_coach_favorites($employee["id"]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Delete coach favorites",
            "error" => $res["message"]
        ];
    }


    $res = remove_id_coach_from_customers($employee["id"]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Remove id coach from customers",
            "error" => $res["message"]
        ];
    }


    $res = delete_employee_image($employee["id"]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Delete employee image",
            "error" => $res["message"]
        ];
    }


    $res = get_coach_events($employee["id"]);

    if ($res["status"] == false) {

        $errors[] = [
            "context" => "Get coach events",
            "error" => $res["message"]
        ];

    } else {

        $events = $res["data"];

        foreach ($events as $j => $event) {
            $res = delete_event_customers($event["id"]);

            if ($res["status"] == false) {
                $errors[] = [
                    "context" => "Delete event customers",
                    "error" => $res["message"]
                ];
                continue;
            }

        }


        $res = delete_coach_events($employee["id"]);

        if ($res["status"] == false) {
            $errors[] = [
                "context" => "Delete coach events",
                "error" => $res["message"]
            ];
        }

    }
}


$res = delete_employees_removed_more_than_three_years_ago();

if ($res["status"] == false) {
    $errors[] = [
        "context" => "Delete employees removed more than three years ago",
        "error" => $res["message"]
    ];
}


echo json_encode([
    "status" => true,
    "message" => "Employees deleted successfully",
    "errors" => $errors
]);
