<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
session_start();

require_once __DIR__ . "/functions.php";
require_once __DIR__ . "/db_connection.php";

if (!isset($_POST["id"])) {
    echo json_encode([
        "status" => false,
        "message" => "No id provided"
    ]);
    exit();
}

try {
    $sql = "SELECT * FROM customers WHERE id = :id";
    $stm = $pdo->prepare($sql);
    $stm->execute(["id" => $_POST["id"]]);
    $customer = $stm->fetch(PDO::FETCH_ASSOC);

    // TODO: check if user is authorized to view the payment data
    $paymentQuery = "SELECT * FROM payments WHERE id_customer = :id_customer";
    $paymentStm = $pdo->prepare($paymentQuery);
    $paymentStm->execute(["id_customer" => $_POST["id"]]);
    $payments = $paymentStm->fetchAll(PDO::FETCH_ASSOC);

    usort($payments, function ($a, $b) {

        $dateA = new DateTime($a["date"]);
        $dateB = new DateTime($b["date"]);
        return $dateB <=> $dateA;
    });

    $recent_payments = array_slice($payments, 0, 4);

    foreach ($recent_payments as $i => $payments) {
        $recent_payments[$i]["date"] = DateTime::createFromFormat("Y-m-d", $payments["date"])->format("d/m/Y");
    }

    $imageQuery = "SELECT * FROM customers_images WHERE id_customer = :id_customer";
    $imageStm = $pdo->prepare($imageQuery);
    $imageStm->execute(["id_customer" => $_POST["id"]]);
    $images = $imageStm->fetch(PDO::FETCH_ASSOC);

    $encountersQuery = "SELECT * FROM encounters WHERE id_customer = :id_customer";
    $encountersStm = $pdo->prepare($encountersQuery);
    $encountersStm->execute(["id_customer" => $_POST["id"]]);
    $encounters = $encountersStm->fetchAll(PDO::FETCH_ASSOC);


    $count_encounters = count($encounters);
    $count_positive_encounters = count(array_filter($encounters, function ($encounter) {

        // TODO: define the rating threshold
        $rating = 3;

        return $encounter["rating"] >= $rating;
    }));
    $count_planned_encounters = count(array_filter($encounters, function ($encounter) {
        $currentTimestamp = new DateTime("now");
        $dateTimeStamp = new DateTime($encounter["date"]);
        return $dateTimeStamp->getTimeStamp() > $currentTimestamp->getTimeStamp();
    }));

    if (empty($customer) || empty($payments) || empty($images) || empty($encounters)) {
        echo json_encode([
            "status" => false,
            "message" => "Customer data not found"
        ]);
        exit();
    }

    usort($encounters, function ($a, $b) {
        $dateA = new DateTime($a["date"]);
        $dateB = new DateTime($b["date"]);
        return $dateB <=> $dateA;
    });

    $recent_encounters = array_slice($encounters, 0, 5);

    foreach ($recent_encounters as $i => $encounter) {
        $recent_encounters[$i]["date"] = DateTime::createFromFormat("Y-m-d", $encounter["date"])->format("d/m/Y");
    }

    echo json_encode([
        "status" => true,
        "data" => [
            "id" => $customer["id"],
            "id_coach" => $customer["id_coach"],
            "name" => $customer["name"],
            "surname" => $customer["surname"],
            "email" => $customer["email"],
            "address" => $customer["address"],
            "image" => base64_encode($images["image"]),
            "total_encounters" => $count_encounters,
            "positive_encounters" => $count_positive_encounters,
            "planned_encounters" => $count_planned_encounters,
            "encounters" => $recent_encounters,
            "payment" => $recent_payments
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => $e->getMessage()
    ]);
}