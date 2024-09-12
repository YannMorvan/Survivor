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


if (!isset($_POST["id"])) {
    echo json_encode([
        "status" => false,
        "message" => "No user id provided"
    ]);
    exit();
}


try {

    $sql = "SELECT clo.type, img.image
            FROM clothes AS clo
            LEFT JOIN clothes_images AS img ON clo.id = img.id_cloth
            WHERE clo.id_customer = :id AND clo.type = :type";

    $stm = $pdo->prepare($sql);
    $stm->execute(["id" => $_POST["id"], "type" => $_POST["type"]]);
    $results = $stm->fetchAll(PDO::FETCH_ASSOC);


    if (empty($results)) {
        echo json_encode([
            "status" => false,
            "message" => "No clothes found"
        ]);
        exit();
    }


    $imagesByType = [];

    foreach ($results as $row) {
        if (isset($row["image"])) {
            $imagesByType[$row['type']][] = base64_encode($row['image']);
        }
    }


    echo json_encode([
        "status" => true,
        "data" => $imagesByType
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
    exit();
}
