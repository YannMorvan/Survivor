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

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

if (!isset($_POST['email']) || !isset($_POST['phone_number']) || !isset($_POST['name']) || !isset($_POST['surname']) || !isset($_POST['address']) || !isset($_POST['birth_date']) || !isset($_POST['gender']) || !isset($_POST['description']) || !isset($_POST['astrological_sign'])) {
    echo json_encode([
        "status" => false,
        "message" => "Missing required fields"
    ]);
    exit();
}

try {
    $query = "INSERT INTO customers (email, phone_number, name, surname, address, birth_date, gender, description, astrological_sign, id_coach, removed) VALUES (:email, :phone_number, :name, :surname, :address, :birth_date, :gender, :description, :astrological_sign, :id_coach, :removed)";

    $stm = $pdo->prepare($query);

    $stm->execute([
        "email" => $_POST["email"],
        "phone_number" => $_POST["phone_number"],
        "name" => $_POST["name"],
        "surname" => $_POST["surname"],
        "address" => $_POST["address"],
        "birth_date" => $_POST["birth_date"],
        "gender" => $_POST["gender"],
        "description" => $_POST["description"],
        "astrological_sign" => $_POST["astrological_sign"],
        "id_coach" => $_POST["id_coach"],
        "removed" => 0
    ]);
    echo json_encode([
        "status" => true,
        "message" => "User added successfully"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
