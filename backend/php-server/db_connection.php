<?php

$dsn = "mysql:host=localhost;dbname=" . $_ENV["MYSQL_DATABASE"] . ";charset=utf8mb4";
$user = "root";
$pwd = $_ENV["MYSQL_ROOT_PASSWORD"];

try {
    $pdo = new PDO($dsn, $user, $pwd);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print("Error!: " . $e->getMessage() . "<br/>");
    exit();
}
