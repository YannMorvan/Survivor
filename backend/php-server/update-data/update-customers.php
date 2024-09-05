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


$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/customers");

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all customers from the API",
        "errors" => $res["message"]
    ]);
    exit();
}

$customers = $res["data"];


foreach ($customers as $i => $customer) {
    if (!isset($customer->id)) {
        $errors[] = [
            "context" => "Get a customer from the API",
            "error" => "No id found for the customer"
        ];
        continue;
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/customers/" . $customer->id);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Get a customer from the API",
            "error" => $res["message"]
        ];
    } else {
        $customers[$i] = $res["data"];
        $res = set_customer_from_api_data($customers[$i]);

        if ($res["status"] == false) {
            $errors[] = [
                "context" => "Set a customer in database from the API data",
                "error" => $res["message"]
            ];
        }
    }


    $res = get_image_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/customers/" . $customer->id . "/image");

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Get a customer image from the API",
            "error" => $res["message"]
        ];
    } else {
        $res = set_customer_image_from_api_data($customer->id, $res["data"]);

        if ($res["status"] == false) {
            $errors[] = [
                "context" => "Set a customer image in database from the API data",
                "error" => $res["message"]
            ];
        }
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/customers/" . $customer->id . "/payments_history");

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Get payments history from the API",
            "error" => $res["message"]
        ];
    } else {
        $payments = $res["data"];

        foreach ($payments as $j => $payment) {
            $res = set_customer_payment_from_api_data($customer->id, $payment);

            if ($res["status"] == false) {
                $errors[] = [
                    "context" => "Set a payment in database from the API data",
                    "error" => $res["message"]
                ];
            }
        }
    }
}


echo json_encode([
    "status" => true,
    "message" => "Customers updated successfully",
    "errors" => $errors
]);
