<?php

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if ($origin == $_ENV["FRONT_HOST"]) {
    header("Access-Control-Allow-Origin: " . $_ENV["FRONT_HOST"]);
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}


header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require_once __DIR__ . '/db_connection.php';


try {

    $query = "SELECT id, name, surname FROM employees WHERE work = :work AND removed = :removed";

    $stm = $pdo->prepare($query);
    $stm->execute([
        'work' => 'coach',
        'removed' => 0
    ]);
    $coaches = $stm->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($coaches)) {
        echo json_encode([
            "status" => true,
            "coaches" => $coaches
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "No coaches found"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        'error' => $e->getMessage()]);
}
