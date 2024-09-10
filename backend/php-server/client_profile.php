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


if (!isset($_POST["id"])) {
    echo json_encode([
        "status" => false,
        "message" => "No id provided"
    ]);
    exit();
}


try {

    $sql = "SELECT
                cust.id, cust.id_coach, cust.name, cust.surname, cust.email, cust.address, cust.phone_number, cust.birth_date, cust.gender, cust.astrological_sign, cust.description
                cust_img.image,
                COUNT(enc.id) AS total_encounters, COUNT(enc.rating >= 3 OR NULL) AS positive_encounters, COUNT(enc.date > NOW() OR NULL) AS planned_encounters
            FROM customers AS cust
            LEFT JOIN customers_images AS cust_img ON cust.id = cust_img.id_customer
            WHERE cust.id = :id
            GROUP BY cust.id";

    $stm = $pdo->prepare($sql);
    $stm->execute(["id" => $_POST["id"]]);
    $customer = $stm->fetch(PDO::FETCH_ASSOC);


    if (empty($customer)) {
        echo json_encode([
            "status" => false,
            "message" => "Customer data not found"
        ]);
        exit();
    }


    $sql = "SELECT * FROM payments WHERE id_customer = :id_customer ORDER BY date DESC LIMIT 5";

    $stm = $pdo->prepare($sql);
    $stm->execute(["id_customer" => $_POST["id"]]);
    $payments = $stm->fetchAll(PDO::FETCH_ASSOC);

    foreach ($payments as $i => $pay) {
        $payments[$i]["date"] = DateTime::createFromFormat("Y-m-d", $pay["date"])->format("d/m/Y");
    }


    $sql = "SELECT * FROM encounters WHERE id_customer = :id_customer ORDER BY date DESC LIMIT 5";

    $stm = $pdo->prepare($sql);
    $stm->execute(["id_customer" => $_POST["id"]]);
    $encounters = $stm->fetchAll(PDO::FETCH_ASSOC);

    foreach ($encounters as $i => $enc) {
        $encounters[$i]["date"] = DateTime::createFromFormat("Y-m-d", $enc["date"])->format("d/m/Y");
    }


    echo json_encode([
        "status" => true,
        "data" => [
            "id" => $customer["id"],
            "id_coach" => $customer["id_coach"] ? $customer["id_coach"] : null,
            "name" => $customer["name"],
            "surname" => $customer["surname"],
            "email" => $customer["email"],
            "address" => $customer["address"],
            "phone_number" => $customer["phone_number"],
            "birth_date" => $customer["birth_date"],
            "gender" => $customer["gender"],
            "astrological_sign" => $customer["astrological_sign"],
            "description" => $customer["description"],
            "image" => isset($customer["image"]) ? base64_encode($customer["image"]) : null,
            "total_encounters" => $customer["total_encounters"],
            "positive_encounters" => $customer["positive_encounters"],
            "planned_encounters" => $customer["planned_encounters"],
            "encounters" => $encounters,
            "payment" => $_SESSION["is_coach"] ? [] : $payments
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => $e->getMessage()
    ]);
}
