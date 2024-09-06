<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
session_start();


$_SESSION["token"] = null;
$_SESSION["is_coach"] = null;
$_SESSION["id_employee"] = null;


echo json_encode([
    "status" => true,
    "message" => "Disconnected successfully"
]);
