<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}


header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once __DIR__ . "/db_connection.php";

try {

    $sql = "SELECT
                emp.id, emp.name, emp.surname, emp.email, emp.phone_number,
                COUNT(cus.id) AS amount_customer
            FROM employees AS emp
            LEFT JOIN customers AS cus ON emp.id = cus.id_coach
            WHERE emp.removed = :removed
            GROUP BY emp.id";

    $stm = $pdo->prepare($sql);
    $stm->execute(["removed" => 0]);
    $employees = $stm->fetchAll(PDO::FETCH_ASSOC);


    if (!empty($employees)) {
        echo json_encode([
            "status" => true,
            "data" => $employees
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "No employees found"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => $e->getMessage()
    ]);
}
