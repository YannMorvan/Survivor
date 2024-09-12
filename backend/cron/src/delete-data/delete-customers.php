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


$res = get_customers_removed_more_than_three_years_ago();

if ($res["status"] == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error while getting all customers removed more than three years ago",
        "error" => $res["message"]
    ]);
    exit();
}

$customers = $res["data"];


foreach ($customers as $i => $customer) {
    $res = delete_customer_from_coaches_favorites($customer["id"]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Delete customer from coaches favorites",
            "error" => $res["message"]
        ];
    }


    $res = delete_customer_encounters($customer["id"]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Delete customer encounters",
            "error" => $res["message"]
        ];
    }


    $res = delete_customer_events($customer["id"]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Delete customer events",
            "error" => $res["message"]
        ];
    }


    $res = delete_customer_payments($customer["id"]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Delete customer payments",
            "error" => $res["message"]
        ];
    }


    $res = delete_customer_image($customer["id"]);

    if ($res["status"] == false) {
        $errors[] = [
            "context" => "Delete customer image",
            "error" => $res["message"]
        ];
    }


    $res = get_customer_clothes($customer["id"]);

    if ($res["status"] == false) {

        $errors[] = [
            "context" => "Get customer clothes",
            "error" => $res["message"]
        ];

    } else {

        $clothes = $res["data"];

        foreach ($clothes as $j => $clothe) {
            $res = delete_customer_clothe_image($clothe["id"]);

            if ($res["status"] == false) {
                $errors[] = [
                    "context" => "Delete customer clothe image",
                    "error" => $res["message"]
                ];
            }
        }


        $res = delete_customer_clothes($customer["id"]);

        if ($res["status"] == false) {
            $errors[] = [
                "context" => "Delete customer clothes",
                "error" => $res["message"]
            ];
        }

    }
}


$res = delete_customers_removed_more_than_three_years_ago();

if ($res["status"] == false) {
    $errors[] = [
        "context" => "Delete customers removed more than three years ago",
        "error" => $res["message"]
    ];
}


echo json_encode([
    "status" => true,
    "message" => "Customers deleted successfully",
    "errors" => $errors
]);
