<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}


header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
session_start();

require_once __DIR__ . "/db_connection.php";
require_once __DIR__ . "/functions.php";


try {

    if ($_ENV["is_coach"]) {
        $query = "SELECT * FROM customers WHERE removed = :removed, id_coach = :id_coach";
        $stm = $pdo->prepare($query);
        $stm->execute(["removed" => 0, "id_coach" => $_SESSION["id"]]);
    } else {
        $query = "SELECT * FROM customers WHERE removed = :removed";
        $stm = $pdo->prepare($query);
        $stm->execute(["removed" => 0]);
    }

    $customers = $stm->fetchAll(PDO::FETCH_ASSOC);


    if (empty($customers)) {
        echo json_encode([
            "status" => false,
            "message" => "No customers found"
        ]);
        exit();
    }


    $customers_array = array_filter(array_map(function ($customer) use ($pdo) {

        $paymentQuery = "SELECT * FROM payments WHERE id_customer = :id_customer ORDER BY date DESC";

        $paymentStm = $pdo->prepare($paymentQuery);
        $paymentStm->execute(["id_customer" => $customer["id"]]);
        $payments = $paymentStm->fetch(PDO::FETCH_ASSOC);

        return [
            "id" => $customer["id"],
            "name" => $customer["name"],
            "surname" => $customer['surname'],
            "email" => $customer["email"],
            "phone_number" => $customer["phone_number"],
            "payement_method" => $_SESSION['is_coach'] ? (empty($payments) ? [] : $payments["method"]) : [],
            "country" => $customer["country"],
            "country_code" => get_country_code($customer["country"]),
        ];
    }, $customers));

    echo json_encode([
        "status" => true,
        "data" => array_values($customers_array)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => $e->getMessage()
    ]);
}
