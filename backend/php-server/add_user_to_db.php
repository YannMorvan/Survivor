<?php

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

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
    $query = "INSERT INTO customers (email, phone_number, name, surname, address, birth_date, gender, description, astrological_sign) VALUES (:email, :phone_number, :name, :surname, :address, :birth_date, :gender, :description, :astrological_sign)";
    
    $stm = $pdo->prepare($query);

    $stm->bindParam(':email', $_POST['email']);
    $stm->bindParam(':phone_number', $_POST['phone_number']);
    $stm->bindParam(':name', $_POST['name']);
    $stm->bindParam(':surname', $_POST['surname']);
    $stm->bindParam(':address', $_POST['address']);
    $stm->bindParam(':birth_date', $_POST['birth_date']);
    $stm->bindParam(':gender', $_POST['gender']);
    $stm->bindParam(':description', $_POST['description']);
    $stm->bindParam(':astrological_sign', $_POST['astrological_sign']);
    
    $stm->execute();
    
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
