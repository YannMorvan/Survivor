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

if (!isset($_POST["id"]) || !isset($_POST["name"]) || !isset($_POST["surname"]) || !isset($_POST["email"]) || !isset($_POST["phone_number"]) || !isset($_POST["address"]) || !isset($_POST["country"]) || !isset($_POST["gender"]) || !isset($_POST["birth_date"]) || !isset($_POST["description"]) || !isset($_POST["astrological_sign"])) {
    echo json_encode([
        "status" => false,
        "message" => "missing parameters"
    ]);
    exit();
}

try {

    if (!isset($_POST["id_coach"]) || empty($_POST["id_coach"])) {
        $query = "UPDATE customers SET name = :name, surname = :surname, email = :email, phone_number = :phone_number, address = :address, country = :country, gender = :gender, birth_date = :birth_date, description = :description, astrological_sign = :astrological_sign WHERE id = :id";

        $stmt = $pdo->prepare($query);
        $stmt->execute([
            "id" => $_POST["id"],
            "name" => $_POST["name"],
            "surname" => $_POST["surname"],
            "email" => $_POST["email"],
            "phone_number" => $_POST["phone_number"],
            "address" => $_POST["address"],
            "country" => $_POST["country"],
            "gender" => $_POST["gender"],
            "birth_date" => $_POST["birth_date"],
            "description" => $_POST["description"],
            "astrological_sign" => $_POST["astrological_sign"],
            "removed" => 0
        ]);

        echo json_encode([
            "status" => true,
            "message" => "Customer updated successfully"
        ]);

    } else {

        $query = "UPDATE customers SET name = :name, surname = :surname, email = :email, phone_number = :phone_number, address = :address, country = :country, gender = :gender, birth_date = :birth_date, description = :description, astrological_sign = :astrological_sign, id_coach = :id_coach WHERE id = :id";

        $stmt = $pdo->prepare($query);
        $stmt->execute([
            "id" => $_POST["id"],
            "name" => $_POST["name"],
            "surname" => $_POST["surname"],
            "email" => $_POST["email"],
            "phone_number" => $_POST["phone_number"],
            "address" => $_POST["address"],
            "country" => $_POST["country"],
            "gender" => $_POST["gender"],
            "birth_date" => $_POST["birth_date"],
            "description" => $_POST["description"],
            "astrological_sign" => $_POST["astrological_sign"],
            "id_coach" => $_POST["id_coach"],
            "removed" => 0
        ]);

        echo json_encode([
            "status" => true,
            "message" => "Customer updated successfully"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}