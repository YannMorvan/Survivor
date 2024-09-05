<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/db_connection.php';

$query = "SELECT * FROM customers";

$stm = $pdo->prepare($query);
$stm->execute();
$customers = $stm->fetchAll(PDO::FETCH_ASSOC);

if (empty($customers)) {
    echo json_encode([
        "status" => false,
        "message" => 'No customers found'
    ]);
    exit();
}

$customers = array_map(function ($customer) use ($pdo) {

    $query = "SELECT * FROM clothes WHERE id_customer = :id_customer";
    $stm = $pdo->prepare($query);
    $stm->execute(['id_customer' => $customer['id']]);
    $clothes = $stm->fetchAll(PDO::FETCH_ASSOC);
    $customer['clothes'] = $clothes;

    $query = "SELECT * FROM payments WHERE id_customer = :id_customer";
    $stm = $pdo->prepare($query);
    $stm->execute(['id_customer' => $customer['id']]);
    $payments = $stm->fetchAll(PDO::FETCH_ASSOC);
    $customer['payments'] = $payments;

    return $customer;
}, $customers);

usort($customers, function ($a, $b) {
    return strcmp($a['astrological_sign'], $b['astrological_sign']);
});

$groupedByAstrologicalSign = [];

foreach ($customers as $customer) {
    $astrologicalSign = $customer['astrological_sign'];
    if (!isset($groupedByAstrologicalSign[$astrologicalSign])) {
        $groupedByAstrologicalSign[$astrologicalSign] = [];
    }
    $groupedByAstrologicalSign[$astrologicalSign][] = $customer;
}

echo json_encode([
    "status" => true,
    "data" => $groupedByAstrologicalSign
]);