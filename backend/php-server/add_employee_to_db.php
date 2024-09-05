<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

if (!isset($_POST['email']) || !isset($_POST['name']) || !isset($_POST['surname']) || !isset($_POST['birth_date']) || !isset($_POST['gender']) || !isset($_POST['work'])) {
    echo json_encode([
        "status" => false,
        "message" => "All fields are required"
    ]);
    exit();
}

try {
    $query = "INSERT INTO employees (email, name, surname, birth_date, gender, work) VALUES (:email, :name, :surname, :birth_date, :gender, :work)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        'email' => $_POST['email'],
        'name' => $_POST['name'],
        'surname' => $_POST['surname'],
        'birth_date' => $_POST['birth_date'],
        'gender' => $_POST['gender'],
        'work' => $_POST['work']
    ]);

    echo json_encode([
        "status" => true,
        "message" => "Employee added successfully"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
