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

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

try {

    $current_date = date("Y-m-d H:i:s");
    $starting_date = date("Y-m-d H:i:s", strtotime('-3 month', strtotime($current_date)));

    $query = "SELECT id, name, surname, country FROM customers WHERE join_date >= :starting_date AND join_date <= :current_date AND removed = 0";

    $stm = $pdo->prepare($query);
    $stm->execute([
        "starting_date" => $starting_date,
        "current_date" => $current_date
    ]);
    $customers = $stm->fetchAll(PDO::FETCH_ASSOC);


    $customers = array_map(function ($customer) {
        $cutomer["country_code"] = get_country_code($customer["country"]);
        return $customer;
    }, $customers);

    echo json_encode([
        "status" => true,
        "customers" => $customers
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}