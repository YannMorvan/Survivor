<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

if (!isset($_POST["id"]) || !isset($_POST["id_employee"]) || !isset($_POST["name"]) || !isset($_POST["date"]) || !isset($_POST["duration"]) || !isset($_POST["type"]) || !isset($_POST["max_participants"]) || !isset($_POST["location_x"]) || !isset($_POST["location_y"]) || !isset($_POST["location_name"])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing mandatory fields'
    ]);
    exit();
}

try {

    $query = "UPDATE events SET id_employee = :id_employee, name = :name, date = :date, duration = :duration, type = :type, max_participants = :max_participants, location_x = :location_x, location_y = :location_y, location_name = :location_name WHERE id = :id";

    $stm = $pdo->prepare($query);
    $stm->execute([
        "id" => $_POST["id"],
        "id_employee" => $_POST["id_employee"],
        "name" => $_POST["name"],
        "date" => $_POST["date"],
        "duration" => $_POST["duration"],
        "type" => $_POST["type"],
        "max_participants" => $_POST["max_participants"],
        "location_x" => $_POST["location_x"],
        "location_y" => $_POST["location_y"],
        "location_name" => $_POST["location_name"],
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Event updated successfully'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}