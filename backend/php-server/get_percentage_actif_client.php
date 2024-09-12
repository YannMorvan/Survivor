<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}

header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once __DIR__ . '/db_connection.php';

try {
    $current_date = date("Y-m-d");

    $query = "SELECT 
                    COUNT(DISTINCT customers.id) AS active_clients_count
                FROM 
                    customers 
                JOIN 
                    encounters 
                ON 
                    customers.id = encounters.id_customer 
                WHERE 
                    encounters.date >= :date
                    AND encounters.removed = :removed";

    $stm = $pdo->prepare($query);
    $stm->execute(["date" => $current_date, "removed" => 0]);
    $clients = $stm->fetch(PDO::FETCH_ASSOC);
    $active_clients_count = $clients['active_clients_count'];

    $query = "SELECT COUNT(*) AS total_clients_count FROM customers WHERE removed = :removed";

    $stm = $pdo->prepare($query);
    $stm->execute(["removed" => 0]);
    $total_clients = $stm->fetch(PDO::FETCH_ASSOC);
    $total_clients_count = $total_clients['total_clients_count'];

    $percentage = round(($active_clients_count / $total_clients_count) * 100, 2);

    echo json_encode([
        "status" => true,
        "data" => $percentage
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}