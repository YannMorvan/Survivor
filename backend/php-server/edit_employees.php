<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/functions.php';

if (!isset($_POST['id']) || !isset($_POST['name']) || !isset($_POST['surname']) || !isset($_POST['email']) || !isset($_POST['phone_number'])) {
    echo json_encode([
        "status" => false,
        "message" => "Missing required fields"
    ]);
    exit();
}

try {
    if (!isset($_POST['password']) ||  empty($_POST['password'])) {
        $query = "UPDATE employees SET name = :name, surname = :surname, email = :email, phone_number = :phone_number  WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'surname' => $_POST['surname'],
            'email' => $_POST['email'],
            'phone_number' => $_POST['phone_number'],
            "removed" => 0
        ]);
    } else {
        $query = "UPDATE employees SET name = :name, surname = :surname, email = :email, phone_number = :phone_number, password = :password WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'surname' => $_POST['surname'],
            'password' => password_hash($_POST['password'], PASSWORD_DEFAULT),
            'email' => $_POST['email'],
            'phone_number' => $_POST['phone_number'],
            "removed" => 0
        ]);
    }

    echo json_encode([
        "status" => true,
        "message" => "Employee updated successfully"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
