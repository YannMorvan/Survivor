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


if (!isset($_POST["id"]) || !isset($_POST["name"]) || !isset($_POST["surname"]) || !isset($_POST["email"]) || !isset($_POST["phone_number"]) || !isset($_POST["address"]) || !isset($_POST["gender"]) || !isset($_POST["birth_date"]) || !isset($_POST["description"]) || !isset($_POST["astrological_sign"])) {
    echo json_encode([
        "status" => false,
        "message" => "missing parameters"
    ]);
    exit();
}

try {

    $params = [
        "id" => $_POST["id"],
        "name" => $_POST["name"],
        "surname" => $_POST["surname"],
        "email" => $_POST["email"],
        "phone_number" => $_POST["phone_number"],
        "address" => $_POST["address"],
        "country" => get_country_from_address($_POST["address"]),
        "gender" => $_POST["gender"],
        "birth_date" => $_POST["birth_date"],
        "description" => $_POST["description"],
        "astrological_sign" => $_POST["astrological_sign"]
    ];


    $sql = "UPDATE customers
            SET name = :name, surname = :surname, email = :email, phone_number = :phone_number, address = :address, country = :country, gender = :gender, birth_date = :birth_date, description = :description, astrological_sign = :astrological_sign";

    if (isset($_POST["id_coach"])) {
        $sql .= ", id_coach = :id_coach";
        $params["id_coach"] = $_POST["id_coach"];
    }

    $sql .= " WHERE id = :id";

    $stmt = $pdo->prepare($sql);
    $res = $stmt->execute($params);

    if ($res == true) {
        echo json_encode([
            "status" => true,
            "message" => "Customer updated successfully"
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Error: Customer not updated"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
