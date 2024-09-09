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


parse_str(implode("&", array_slice($argv, 1)), $_POST);

if (!isset($_POST["token"])) {
    echo json_encode([
        "status" => false,
        "message" => "No token found. Please login"
    ]);
    exit();
}


$errors = [];


$res = get_customers_ids();

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all customers from the database",
        "errors" => $res["message"]
    ]);
    exit();
}

$customers_data = $res["data"];


foreach ($customers_data as $i => $customer) {
    if (!isset($customer["id"])) {
        $errors[] = [
            "context" => "Get a customer from the database",
            "error" => "No id found for the customer"
        ];
        continue;
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/customers/" . $customer["id"] . "/clothes");

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Get clothes from the API",
            "error" => $res["message"]
        ];
    } else {
        $clothes = $res["data"];

        foreach ($clothes as $j => $cloth) {
            if (!isset($cloth->id)) {
                $errors[] = [
                    "context" => "Get a cloth from the API",
                    "error" => "No id found for the cloth"
                ];
                continue;
            }


            $res = set_cloth_from_api_data($customer["id"], $cloth);

            if ($res["status"] == false) {
                $errors[] = [
                    "context" => "Set a cloth in database from the API data",
                    "error" => $res["message"]
                ];
            }


            $res = get_image_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/clothes/" . $cloth->id . "/image");

            if ($res["status"] == false) {
                $errors[] = [
                    "context" => "Get a cloth image from the API",
                    "error" => $res["message"]
                ];
            } else {
                $res = set_cloth_image_from_api_data($cloth->id, $res["data"]);

                if ($res["status"] == false) {
                    $errors[] = [
                        "context" => "Set a cloth image in database from the API data",
                        "error" => $res["message"]
                    ];
                }
            }
        }
    }
}


echo json_encode([
    "status" => true,
    "message" => "Clothes updated successfully",
    "errors" => $errors
]);
