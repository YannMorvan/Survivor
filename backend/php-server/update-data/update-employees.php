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


$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/employees");

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all employees from the API",
        "errors" => $res["message"]
    ]);
    exit();
}

$employees = $res["data"];


foreach ($employees as $i => $employee) {
    if (!isset($employee->id)) {
        $errors[] = [
            "context" => "Get an employee from the API",
            "error" => "No id found for the employee"
        ];
        continue;
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/employees/" . $employee->id);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Get an employee from the API",
            "error" => $res["message"]
        ];
    } else {
        $employees[$i] = $res["data"];
        $res = set_employee_from_api_data($employees[$i]);

        if ($res["status"] == false) {
            $errors[] = [
                "context" => "Set an employee in database from the API data",
                "error" => $res["message"]
            ];
        }
    }


    $res = get_image_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/employees/" . $employee->id . "/image");

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Get an employee image from the API",
            "error" => $res["message"]
        ];
    } else {
        $res = set_employee_image_from_api_data($employee->id, $res["data"]);

        if ($res["status"] == false) {
            $errors[] = [
                "context" => "Set an employee image in database from the API data",
                "error" => $res["message"]
            ];
        }
    }
}


echo json_encode([
    "status" => true,
    "message" => "Employees updated successfully",
    "errors" => $errors
]);
