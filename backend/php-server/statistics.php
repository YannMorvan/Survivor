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

    $sql = "SELECT
                ev.id_employee, ev.name, ev.date, ev.duration, ev.type, ev.max_participants, ev.location_x, ev.location_y, ev.location_name,
                co.color
            FROM events AS ev
            LEFT JOIN events_colors AS co ON ev.type = co.event_type
            WHERE removed = :removed";

    $stm = $pdo->prepare($sql);
    $stm->execute(["removed" => 0]);
    $events = $stm->fetchAll(PDO::FETCH_ASSOC);


    $query = "SELECT * FROM encounters WHERE removed = :removed";

    $stm = $pdo->prepare($query);
    $stm->execute(["removed" => 0]);
    $encounters = $stm->fetchAll(PDO::FETCH_ASSOC);

    foreach ($encounters as $key => $encounter) {
        $encounters[$key]["date"] = DateTime::createFromFormat("Y-m-d", $encounter["date"])->format("d/m/Y");
    }


    $query = "SELECT address, country FROM customers WHERE removed = :removed";

    $stm = $pdo->prepare($query);
    $stm->execute(["removed" => 0]);
    $adresses = $stm->fetchAll(PDO::FETCH_ASSOC);

    // TODO: implement the missing graph's data


    echo json_encode([
        "status" => true,
        "data" => [
            "encounters" => $encounters,
            "events" => $events,
            "addresses" => $adresses
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
