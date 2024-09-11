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


if (!isset($_POST["id"])) {
    echo json_encode([
        "status" => false,
        "message" => "No id provided"
    ]);
    exit();
}


try {

    $query = "SELECT image FROM customers_images WHERE id_customer = :id_customer";

    $stm = $pdo->prepare($query);
    $stm->execute(["id_customer" => $_POST["id"]]);
    $image = $stm->fetch(PDO::FETCH_ASSOC);


    if (!empty($image)) {
        echo json_encode([
            "status" => true,
            "data" => base64_encode($image["image"])
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "No image found"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => $e->getMessage()
    ]);
}
