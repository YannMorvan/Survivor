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
require_once __DIR__ . '/functions.php';


if (!isset($_POST['email']) || !isset($_POST['phone_number']) || !isset($_POST['name']) || !isset($_POST['surname']) || !isset($_POST['address']) || !isset($_POST['birth_date']) || !isset($_POST['gender']) || !isset($_POST['description']) || !isset($_POST['astrological_sign'])) {
    echo json_encode([
        "status" => false,
        "message" => "Missing required fields"
    ]);
    exit();
}


try {

    $query = "INSERT INTO customers (email, phone_number, name, surname, address, country, birth_date, gender, description, astrological_sign, id_coach) VALUES (:email, :phone_number, :name, :surname, :address, :country, :birth_date, :gender, :description, :astrological_sign, :id_coach)";

    $stm = $pdo->prepare($query);
    $res = $stm->execute([
        "email" => $_POST["email"],
        "phone_number" => $_POST["phone_number"],
        "name" => $_POST["name"],
        "surname" => $_POST["surname"],
        "address" => $_POST["address"],
        "country" => get_country_from_address($_POST["address"]),
        "birth_date" => $_POST["birth_date"],
        "gender" => $_POST["gender"],
        "description" => $_POST["description"],
        "astrological_sign" => $_POST["astrological_sign"],
        "id_coach" => $_POST["id_coach"]
    ]);


    if ($res == true) {
        echo json_encode([
            "status" => true,
            "message" => "Customer added successfully"
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Error: Customer not added"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
