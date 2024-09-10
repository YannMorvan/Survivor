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


if (!isset($_POST['email']) || !isset($_POST['name']) || !isset($_POST['surname']) || !isset($_POST['birth_date']) || !isset($_POST['gender']) || !isset($_POST['work'])) {
    echo json_encode([
        "status" => false,
        "message" => "All fields are required"
    ]);
    exit();
}


try {

    $query = "INSERT INTO employees (email, password, name, surname, birth_date, gender, work) VALUES (:email, :password, :name, :surname, :birth_date, :gender, :work)";

    $stmt = $pdo->prepare($query);
    $res = $stmt->execute([
        "email" => $_POST["email"],
        "password" => isset($_POST["password"]) ? password_hash($_POST["password"], PASSWORD_DEFAULT) : null,
        "name" => $_POST["name"],
        "surname" => $_POST["surname"],
        "birth_date" => $_POST["birth_date"],
        "gender" => $_POST["gender"],
        "work" => $_POST["work"]
    ]);


    if ($res == true) {
        echo json_encode([
            "status" => true,
            "message" => "Employee added successfully"
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Error: Employee not added"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
