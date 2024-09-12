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


$res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/employees");

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


    $res = do_employee_exist_in_database($employee->id);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Check if an employee exists in database",
            "error" => $res["message"]
        ];
        continue;
    }
    if ($res["does_exist"] == true) {
        continue;
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/employees/" . $employee->id);

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


    $res = get_image_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/employees/" . $employee->id . "/image");

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
