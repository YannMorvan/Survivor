<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
session_start();

require_once __DIR__ . "/functions.php";
require_once __DIR__ . "/db_connection.php";


if (!isset($_ENV["API_KEY"])) {
    echo json_encode([
        "status" => false,
        "message" => "API key is not set"
    ]);
    exit();
}


if (!isset($_POST["email"]) || !isset($_POST["password"])) {
    echo json_encode([
        "status" => false,
        "message" => "Email or password or both are not provided"
    ]);
    exit();
}


$sql = "SELECT id, work FROM employees WHERE email = :email";

$stm = $pdo->prepare($sql);
$res = $stm->execute(["email" => $_POST["email"]]);

if ($res == false) {
    echo json_encode([
        "status" => false,
        "message" => "Error executing the query"
    ]);
    exit();
}

$row = $stm->fetch(PDO::FETCH_ASSOC);

if (empty($row)) {
    echo json_encode([
        "status" => false,
        "message" => "Email not found"
    ]);
    exit();
}

$is_coach = $row["work"] == "Coach" || $row["work"] == "coach";


$res = login($_ENV["API_KEY"], $_POST["email"], $_POST["password"]);

if ($res["status"] == false) {
    echo json_encode($res);
    exit();
}


$_SESSION["token"] = $res["token"];
$_SESSION["id_employee"] = $row["id"];
$_SESSION["is_coach"] = $is_coach;

echo json_encode([
    "status" => true,
    "message" => "Logged in successfully",
    "isCoach" => $is_coach
]);
