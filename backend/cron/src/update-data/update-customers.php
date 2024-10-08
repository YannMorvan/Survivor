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


$res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/customers");

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


    $res = do_customer_exist_in_database($customer->id);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Check if a customer exists in database",
            "error" => $res["message"]
        ];
        continue;
    }
    if ($res["does_exist"] == true) {
        continue;
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/customers/" . $customer->id);

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


    $res = get_image_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/customers/" . $customer->id . "/image");

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


    $res = get_data_from_api($_ENV["API_KEY"], $_POST["token"], "https://soul-connection.fr/api/customers/" . $customer->id . "/payments_history");

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
