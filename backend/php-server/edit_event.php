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
require_once __DIR__ . "/functions.php";


if (!isset($_POST["id"]) || !isset($_POST["name"]) || !isset($_POST["date"]) || !isset($_POST["duration"]) || !isset($_POST["type"]) || !isset($_POST["max_participants"]) || !isset($_POST["location_x"]) || !isset($_POST["location_y"]) || !isset($_POST["location_name"])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing mandatory fields"
    ]);
    exit();
}

try {

    $sql = "SELECT * FROM events_colors WHERE type = :type";

    $stm = $pdo->prepare($sql);
    $stm->execute(["type" => $_POST["type"]]);
    $event = $stm->fetch(PDO::FETCH_ASSOC);


    if (empty($event)) {
        $sql = "INSERT INTO events_colors (type, color) VALUES (:type, :color)";

        $stm = $pdo->prepare($sql);
        $res = $stm->execute([
            "type" => $_POST["type"],
            "color" => generate_readable_color()
        ]);

        if ($res == false) {
            echo json_encode([
                "status" => false,
                "message" => "Error: Event not updated"
            ]);
            exit();
        }
    }


    $query = "UPDATE events
            SET id_employee = :id_employee, name = :name, date = :date, duration = :duration, type = :type, max_participants = :max_participants, location_x = :location_x, location_y = :location_y, location_name = :location_name WHERE id = :id";

    $stm = $pdo->prepare($query);
    $res = $stm->execute([
        "id" => $_POST["id"],
        "id_employee" => $_SESSION["id_employee"],
        "name" => $_POST["name"],
        "date" => $_POST["date"],
        "duration" => $_POST["duration"],
        "type" => $_POST["type"],
        "max_participants" => $_POST["max_participants"],
        "location_x" => $_POST["location_x"],
        "location_y" => $_POST["location_y"],
        "location_name" => $_POST["location_name"]
    ]);

    if ($res == true) {
        echo json_encode([
            "status" => "success",
            "message" => "Event updated successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Error: Event not updated"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
