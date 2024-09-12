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


if (!isset($_POST['type'])) {
    echo json_encode([
        "status" => false,
        "message" => "Type is required"
    ]);
    exit();
}


try {

    if (!$_ENV["is_coach"]) {
        $query = "SELECT ci.image FROM clothes c LEFT JOIN clothes_images ci ON c.id = ci.id_cloth WHERE c.type = :type";

        $stm = $pdo->prepare($query);
        $stm->execute(["type" => $_POST['type']]);

    } else {

        $query = "SELECT ci.image FROM clothes c LEFT JOIN clothes_images ci ON ci.id = ci.id_cloth LEFT JOIN clients cl ON c.id_client = cl.id WHERE cl.id_coach = :id_coach AND c.type = :type";

        $stm = $pdo->prepare($query);
        $stm->execute(["type" => $_POST["type"], "id_coach" => $_SESSION["id"]]);
    }

    $clothes = $stm->fetchAll(PDO::FETCH_ASSOC);

    if (empty($clothes)) {
        echo json_encode([
            "status" => false,
            "message" => "No clothes found"
        ]);
        exit();
    }

    foreach ($clothes as $key => $cloth) {
        $clothes[$key]['image'] = base64_encode($cloth['image']);
    }

    echo json_encode([
        "status" => true,
        "data" => $clothes
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}