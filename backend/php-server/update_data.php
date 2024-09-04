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


// Get employees from the API
$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/employees");
check_status($res);
$employees = $res["data"];

foreach ($employees as $i => $employee) {
    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/employees/" . $employee["id"]);
    check_status($res);
    $employees[$i] = $res["data"];
    // Add the employee to the database

    $res = get_image_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/employees/" . $employee["id"] . "/image");
    check_status($res);
    // Add the image to the database
}


// Get customers from the API



/**
 * Check the status of the response and exit if it is false
 * @param array $res        The response from the API
 * @return void
 */
function check_status($res) {
    if ($res["status"] === false) {
        echo json_encode($res);
        exit();
    }
}
