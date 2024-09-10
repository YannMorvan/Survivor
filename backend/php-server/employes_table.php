<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}


header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once __DIR__ . "/functions.php";
require_once __DIR__ . "/db_connection.php";

try {

    $query = "SELECT * FROM employees WHERE removed = 0";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $employes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($employes)) {
        echo json_encode([
            "status" => false,
            "message" => "No employes found"
        ]);
        exit();
    }

    $employes_array = array_filter(array_map(function ($employe) use ($pdo) {

        $query = "SELECT * FROM customers WHERE id_coach = :id";

        $stm = $pdo->prepare($query);
        $stm->execute(["id" => $employe["id"]]);
        $amount_customer = count($stm->fetchAll(PDO::FETCH_ASSOC));

        return [
            "id" => $employe["id"],
            "name" => $employe["name"],
            "surname" => $employe["surname"],
            "email" => $employe["email"],
            "phone_number" => $employe["phone_number"],
            "amount_customer" => $amount_customer
        ];
    }, $employes));

    echo json_encode([
        "status" => true,
        "data" => array_values($employes_array)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => $e->getMessage()
    ]);
}