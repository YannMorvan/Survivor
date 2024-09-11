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

    $sql = "SELECT * FROM employees WHERE id = :id AND removed = :removed";

    $stm = $pdo->prepare($sql);
    $stm->execute([
        "id" => $_POST["id_coach"],
        "removed" => 0
    ]);
    $coach = $stm->fetch(PDO::FETCH_ASSOC);


    if (empty($coach)) {
        echo json_encode([
            "status" => false,
            "message" => "Coach not found"
        ]);
        exit();
    }

    $coach["customers"] = [];


    $sql = "SELECT id, name, surname FROM customers WHERE id_coach = :id_coach AND removed = :removed";

    $stm = $pdo->prepare($sql);
    $stm->execute([
        "id_coach" => $_POST["id_coach"],
        "removed" => 0
    ]);
    $customers = $stm->fetchAll(PDO::FETCH_ASSOC);


    if (!empty($customers)) {

        foreach ($customers as $i => $cus) {
            $sql = "SELECT date, rating, comment, source FROM encounters WHERE id_customer = :id_customer AND removed = :removed";

            $stm = $pdo->prepare($sql);
            $stm->execute([
                "id_customer" => $cus["id"],
                "removed" => 0
            ]);
            $encounters = $stm->fetchAll(PDO::FETCH_ASSOC);

            $coach["customers"][] = [
                "id" => $cus["id"],
                "name" => $cus["name"],
                "surname" => $cus["surname"],
                "encounters" => $encounters
            ];
        }

    }


    echo json_encode([
        "status" => true,
        "coach" => $coach
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "error" => $e->getMessage()]);
}
