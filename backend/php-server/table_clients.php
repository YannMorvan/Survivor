<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

session_start();

require_once __DIR__ . "/functions.php";
require_once __DIR__ . "/db_connection.php";

try {

    $query = "SELECT * FROM customers WHERE removed = 0";

    $stm = $pdo->prepare($query);
    $stm->execute();
    $customers = $stm->fetchAll(PDO::FETCH_ASSOC);

    if (empty($customers)) {
        echo json_encode([
            "status" => false,
            "message" => "No customers found"
        ]);
        exit();
    }

    $customers_array = array_filter(array_map(function ($customer) use ($pdo) {

        $paymentQuery = "SELECT * FROM payments WHERE id_customer = :id_customer";
        $paymentStm = $pdo->prepare($paymentQuery);
        $paymentStm->execute(["id_customer" => $customer["id"]]);
        $payments = $paymentStm->fetch(PDO::FETCH_ASSOC);

        $imageQuery = "SELECT * FROM customers_images WHERE id_customer = :id_customer";
        $imageStm = $pdo->prepare($imageQuery);
        $imageStm->execute(["id_customer" => $customer["id"]]);
        $images = $imageStm->fetch(PDO::FETCH_ASSOC);

        return [
            "id" => $customer["id"],
            "name" => $customer["name"],
            "surname" => $customer['surname'],
            "image" => base64_encode($images["image"]),
            "email" => $customer["email"],
            "phone_number" => $customer["phone_number"],
            "payement_method" => $payments["method"],
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
