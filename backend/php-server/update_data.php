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


$errors = [
    "employees" => [],
    "customers" => [],
    "encounters" => [],
    "tips" => [],
    "events" => []
];


// Get employees from the API
$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/employees");

if ($res["status"] == false) {
    $employees = [];
    $errors["employees"][] = [
        "context" => "Get all employees from the API",
        "error" => $res["message"]
    ];
} else {
    $employees = $res["data"];
}

foreach ($employees as $i => $employee) {
    if (!isset($employee["id"])) {
        $errors["employees"][] = [
            "context" => "Get an employee from the API",
            "error" => "No id found for the employee"
        ];
        continue;
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/employees/" . $employee["id"]);

    if ($res["status"] == false) {
        $errors["employees"][] = [
            "context" => "Get an employee from the API",
            "error" => $res["message"]
        ];
    } else {
        $employees[$i] = $res["data"];
        $res = set_employee_from_api_data($employees[$i]);

        if ($res["status"] == false) {
            $errors["employees"][] = [
                "context" => "Set an employee in database from the API data",
                "error" => $res["message"]
            ];
        }
    }


    $res = get_image_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/employees/" . $employee["id"] . "/image");

    if ($res["status"] == false) {
        $errors["employees"][] = [
            "context" => "Get an employee image from the API",
            "error" => $res["message"]
        ];
    } else {
        $res = set_employee_image_from_api_data($employee["id"], $res["data"]);

        if ($res["status"] == false) {
            $errors["employees"][] = [
                "context" => "Set an employee image in database from the API data",
                "error" => $res["message"]
            ];
        }
    }
}


// Get customers from the API
$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/customers");

if ($res["status"] == false) {
    $customers = [];
    $errors["customers"][] = [
        "context" => "Get all customers from the API",
        "error" => $res["message"]
    ];
} else {
    $customers = $res["data"];
}

foreach ($customers as $i => $customer) {
    if (!isset($customer["id"])) {
        $errors["customers"][] = [
            "context" => "Get a customer from the API",
            "error" => "No id found for the customer"
        ];
        continue;
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/customers/" . $customer["id"]);

    if ($res["status"] == false) {
        $errors["customers"][] = [
            "context" => "Get a customer from the API",
            "error" => $res["message"]
        ];
    } else {
        $customers[$i] = $res["data"];
        $res = set_customer_from_api_data($customers[$i]);

        if ($res["status"] == false) {
            $errors["customers"][] = [
                "context" => "Set a customer in database from the API data",
                "error" => $res["message"]
            ];
        }
    }


    $res = get_image_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/customers/" . $customer["id"] . "/image");

    if ($res["status"] == false) {
        $errors["customers"][] = [
            "context" => "Get a customer image from the API",
            "error" => $res["message"]
        ];
    } else {
        $res = set_customer_image_from_api_data($customer["id"], $res["data"]);

        if ($res["status"] == false) {
            $errors["customers"][] = [
                "context" => "Set a customer image in database from the API data",
                "error" => $res["message"]
            ];
        }
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/customers/" . $customer["id"] . "/payments_history");

    if ($res["status"] == false) {
        $errors["customers"][] = [
            "context" => "Get payments history from the API",
            "error" => $res["message"]
        ];
    } else {
        $payments = $res["data"];

        foreach ($payments as $j => $payment) {
            $res = set_customer_payment_from_api_data($customer["id"], $payment);

            if ($res["status"] == false) {
                $errors["customers"][] = [
                    "context" => "Set a payment in database from the API data",
                    "error" => $res["message"]
                ];
            }
        }
    }


    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/customers/" . $customer["id"] . "/clothes");

    if ($res["status"] == false) {
        $errors["customers"][] = [
            "context" => "Get clothes from the API",
            "error" => $res["message"]
        ];
    } else {
        $clothes = $res["data"];

        foreach ($clothes as $j => $cloth) {
            if (!isset($cloth["id"])) {
                $errors["customers"][] = [
                    "context" => "Get a cloth from the API",
                    "error" => "No id found for the cloth"
                ];
                continue;
            }


            $res = set_cloth_from_api_data($id_customer, $cloth);

            if ($res["status"] == false) {
                $errors["customers"][] = [
                    "context" => "Set a cloth in database from the API data",
                    "error" => $res["message"]
                ];
            }

            // Add the clothes to the database + images
            $res = get_image_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/clothes/" . $cloth["id"] . "/image");

            if ($res["status"] == false) {
                $errors["customers"][] = [
                    "context" => "Get a cloth image from the API",
                    "error" => $res["message"]
                ];
            } else {
                $res = set_cloth_image_from_api_data($cloth["id"], $res["data"]);

                if ($res["status"] == false) {
                    $errors["customers"][] = [
                        "context" => "Set a cloth image in database from the API data",
                        "error" => $res["message"]
                    ];
                }
            }
        }
    }
}


// Get encounters from the API
$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/encounters");
check_status($res);
$encounters = $res["data"];

foreach ($encounters as $i => $encounter) {
    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/encounters/" . $encounter["id"]);
    check_status($res);
    $encounters[$i] = $res["data"];
    // Add the encounter to the database
}



// Get tips from the API
$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/tips");
check_status($res);
$tips = $res["data"];
// Add the tips to the database


// Get events from the API
$res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/events");
check_status($res);
$events = $res["data"];

foreach ($events as $i => $event) {
    $res = get_data_from_api($_ENV["API_KEY"], $_SESSION["token"], "https://soul-connection.fr/api/events/" . $event["id"]);
    check_status($res);
    $events[$i] = $res["data"];
    // Add the event to the database
}


echo json_encode([
    "status" => true,
    "message" => "Data updated successfully"
]);
