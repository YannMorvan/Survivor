<?php

const DB_PATH = __DIR__ . "/db_connection.php";



/**
 * Get data from the API.
 * @param string $api_key       API key
 * @param string $token         Token of the user
 * @param string $url           URL of the API
 * @param bool $image           If the data is an image or not
 * @return array                Data from the API
 */
function get_from_api($api_key, $token, $url, $image = false)
{
    $header = [
        "Content-Type: " . ($image ? "image/png" : "application/json"),
        "X-Group-Authorization: $api_key",
        "Authorization: Bearer $token"
    ];


    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => $header,
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    curl_close($ch);


    $response = json_decode($response);

    if ($code == 404) {
        return [
            "status" => false,
            "message" => $response->detail
        ];
    }

    if ($code == 422) {
        return [
            "status" => false,
            "message" => $response->detail[0]->msg
        ];
    }

    if ($code != 200) {
        return [
            "status" => false,
            "message" => isset($error) ? $error : "An error occurred"
        ];
    }

    return [
        "status" => true,
        "data" => $response
    ];
}



/**
 * Get data from the API.
 * @param string $api_key       API key
 * @param string $token         Token of the user
 * @param string $url           URL of the API
 * @return array                Data from the API
 */
function get_data_from_api($api_key, $token, $url)
{
    return get_from_api($api_key, $token, $url);
}



/**
 * Get image from the API.
 * @param string $api_key       API key
 * @param string $token         Token of the user
 * @param string $url           URL of the API
 * @return array                Image from the API
 */
function get_image_from_api($api_key, $token, $url)
{
    return get_from_api($api_key, $token, $url, true);
}



/**
 * Set an employee in database from the API data.
 * @param array $employee       Employee data from the API
 * @return array                Status of the operation
 */
function set_employee_from_api_data($employee)
{
    require_once DB_PATH;

    if (!isset($employee["id"]) || !isset($employee["email"]) || !isset($employee["name"]) || !isset($employee["surname"]) || !isset($employee["birth_date"]) || !isset($employee["gender"]) || !isset($employee["work"])) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }

    $sql = "INSERT INTO employees
            (id, email, name, surname, birth_date, gender, work)
            VALUES (:id, :email, :name, :surname, :birth_date, :gender, :work)
            ON DUPLICATE KEY UPDATE
            email = :email, name = :name, surname = :surname, birth_date = :birth_date, gender = :gender, work = :work"; 

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $employee["id"],
        "email" => $employee["email"],
        "name" => $employee["name"],
        "surname" => $employee["surname"],
        "birth_date" => $employee["birth_date"],
        "gender" => $employee["gender"],
        "work" => $employee["work"]
    ]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    } else {
        return [
            "status" => true
        ];
    }
}



/**
 * Set an employee image in database from the API data.
 * @param int $id_employee      ID of the employee
 * @param string $image         Image of the employee
 * @return array                Status of the operation
 */
function set_employee_image_from_api_data($id_employee, $image)
{
    require_once DB_PATH;

    $sql = "INSERT INTO employees_images (id_employee, image) VALUES (:id_employee, :image) ON DUPLICATE KEY UPDATE image = :image";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id_employee" => $id_employee,
        "image" => $image
    ]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    } else {
        return [
            "status" => true
        ];
    }
}



/**
 * Set a customer in database from the API data.
 * @param array $customer       Customer data from the API
 * @return array                Status of the operation
 */
function set_customer_from_api_data($customer)
{
    require_once DB_PATH;

    if (!isset($customer["id"]) || !isset($customer["email"]) || !isset($customer["phone_number"]) || !isset($customer["name"]) || !isset($customer["surname"]) || !isset($customer["address"]) || !isset($customer["birth_date"]) || !isset($customer["gender"]) || !isset($customer["description"]) || !isset($customer["astrological_sign"])) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }

    $sql = "INSERT INTO customers
            (id, email, phone_number, name, surname, address, birth_date, gender, description, astrological_sign)
            VALUES (:id, :email, :phone_number, :name, :surname, :address, :birth_date, :gender, :description, :astrological_sign)
            ON DUPLICATE KEY UPDATE
            email = :email, phone_number = :phone_number, name = :name, surname = :surname, address = :address, birth_date = :birth_date, gender = :gender, description = :description, astrological_sign = :astrological_sign";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $customer["id"],
        "email" => $customer["email"],
        "phone_number" => $customer["phone_number"],
        "name" => $customer["name"],
        "surname" => $customer["surname"],
        "address" => $customer["address"],
        "birth_date" => $customer["birth_date"],
        "gender" => $customer["gender"],
        "description" => $customer["description"],
        "astrological_sign" => $customer["astrological_sign"]
    ]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    } else {
        return [
            "status" => true
        ];
    }
}



/**
 * Set a customer image in database from the API data.
 * @param int $id_customer      ID of the customer
 * @param string $image         Image of the customer
 * @return array                Status of the operation
 */
function set_customer_image_from_api_data($id_customer, $image)
{
    require_once DB_PATH;

    $sql = "INSERT INTO customers_images (id_customer, image) VALUES (:id_customer, :image) ON DUPLICATE KEY UPDATE image = :image";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id_customer" => $id_customer,
        "image" => $image
    ]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    } else {
        return [
            "status" => true
        ];
    }
}



/**
 * Set a customer payment in database from the API data.
 * @param int $id_customer      ID of the customer
 * @param array $payment        Payment data from the API
 * @return array                Status of the operation
 */
function set_customer_payment_from_api_data($id_customer, $payment)
{
    require_once DB_PATH;

    if (!isset($payment["id"]) || !isset($payment["date"]) || !isset($payment["method"]) || !isset($payment["amount"]) || !isset($payment["comment"])) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }

    $sql = "INSERT INTO customers_payments
            (id, id_customer, date, method, amount, comment)
            VALUES (:id, :id_customer, :date, :method, :amount, :comment)
            ON DUPLICATE KEY UPDATE
            date = :date, method = :method, amount = :amount, comment = :comment";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $payment["id"],
        "id_customer" => $id_customer,
        "date" => $payment["date"],
        "method" => $payment["method"],
        "amount" => $payment["amount"],
        "comment" => $payment["comment"]
    ]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    } else {
        return [
            "status" => true
        ];
    }
}



/**
 * Set a customer cloth in database from the API data.
 * @param int $id_customer      ID of the customer
 * @param array $cloth          Cloth data from the API
 * @return array                Status of the operation
 */
function set_cloth_from_api_data($id_customer, $cloth)
{
    require_once DB_PATH;

    if (!isset($cloth["id"]) || !isset($cloth["type"])) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }

    $sql = "INSERT INTO clothes
            (id, id_customer, type)
            VALUES (:id, :id_customer, :type)
            ON DUPLICATE KEY UPDATE
            type = :type";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $cloth["id"],
        "id_customer" => $id_customer,
        "type" => $cloth["type"]
    ]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    } else {
        return [
            "status" => true
        ];
    }
}



/**
 * Set a cloth image in database from the API data.
 * @param int $id_cloth         ID of the cloth
 * @param string $image         Image of the cloth
 * @return array                Status of the operation
 */
function set_cloth_image_from_api_data($id_cloth, $image)
{
    require_once DB_PATH;

    $sql = "INSERT INTO clothes_images (id_cloth, image) VALUES (:id_cloth, :image) ON DUPLICATE KEY UPDATE image = :image";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id_cloth" => $id_cloth,
        "image" => $image
    ]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    } else {
        return [
            "status" => true
        ];
    }
}



/**
 * Set an event in database from the API data.
 * @param array $encounter          Encounter data from the API
 * @return array                    Status of the operation
 */
function set_encounter_from_api_data($encounter)
{
    require_once DB_PATH;

    if (!isset($id) || !isset($encounter["customer_id"]) || !isset($encounter["date"]) || !isset($encounter["rating"]) || !isset($encounter["comment"]) || !isset($encounter["source"])) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }

    $sql = "INSERT INTO encounters
            (id, id_customer, date, rating, comment, source)
            VALUES (:id, :id_customer, :date, :rating, :comment, :source)
            ON DUPLICATE KEY UPDATE
            id_customer = :id_customer, date = :date, rating = :rating, comment = :comment, source = :source";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $encounter["id"],
        "id_customer" => $encounter["customer_id"],
        "date" => $encounter["date"],
        "rating" => $encounter["rating"],
        "comment" => $encounter["comment"],
        "source" => $encounter["source"]
    ]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    } else {
        return [
            "status" => true
        ];
    }
}



/**
 * Set a tip in database from the API data.
 * @param array $tip            Tip data from the API
 * @return array                Status of the operation
 */
function set_tip_from_api_data($tip)
{
    require_once DB_PATH;

    if (!isset($tip["id"]) || !isset($tip["title"]) || !isset($tip["tip"])) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }

    $sql = "INSERT INTO tips (id, title, tip) VALUES (:id, :title, :tip) ON DUPLICATE KEY UPDATE title = :title, tip = :tip";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $tip["id"],
        "title" => $tip["title"],
        "tip" => $tip["tip"]
    ]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    } else {
        return [
            "status" => true
        ];
    }
}
