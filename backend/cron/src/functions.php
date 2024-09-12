<?php

const DB_PATH = __DIR__ . "/db_connection.php";



/**
 * Check if the API key and the token are set.
 * @param string $api_key       API key
 * @param string $token         Token of the user
 * @return array                Status of the operation
 */
function check_api_key_and_token($api_key, $token)
{
    if (!isset($api_key)) {
        return [
            "status" => false,
            "message" => "Environment variable API_KEY is not set"
        ];
    }

    if (!isset($token)) {
        return [
            "status" => false,
            "message" => "No token found. Please login"
        ];
    }

    return [
        "status" => true
    ];
}



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


    if ($image == false) {
        $response = json_decode($response);
    }


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
 * Get the country where an address is located.
 * @param string $address       Address
 * @return array                Data of the country
 */
function get_country_from_address($address)
{
    $address = urlencode($address);


    $header = [
        "Content-Type: application/json"
    ];

    $ch = curl_init("https://api.geoapify.com/v1/geocode/search?text={$address}&apiKey={$_ENV["GEOAPIFY_API_KEY"]}");

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => $header,
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    curl_close($ch);


    if ($code != 200) {
        return [
            "status" => false,
            "code" => $code,
            "error" => $error
        ];
    }


    $response = json_decode($response, true);

    if (isset($response["features"][0]["properties"]["country"])) {
        return [
            "status" => true,
            "country" => $response["features"][0]["properties"]["country"]
        ];
    } else {
        return [
            "status" => false,
            "error" => "Country not found"
        ];
    }
}



/**
 * Set an employee in database from the API data.
 * @param object $employee      Employee data from the API
 * @return array                Status of the operation
 */
function set_employee_from_api_data($employee)
{
    require DB_PATH;

    if (!isset($employee->id) || !isset($employee->email) || !isset($employee->name) || !isset($employee->surname) || !isset($employee->birth_date) || !isset($employee->gender) || !isset($employee->work)) {
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
        "id" => $employee->id,
        "email" => $employee->email,
        "name" => $employee->name,
        "surname" => $employee->surname,
        "birth_date" => $employee->birth_date,
        "gender" => $employee->gender,
        "work" => $employee->work
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
    require DB_PATH;

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
 * @param object $customer      Customer data from the API
 * @return array                Status of the operation
 */
function set_customer_from_api_data($customer)
{
    require DB_PATH;

    if (!isset($customer->id) || !isset($customer->email) || !isset($customer->phone_number) || !isset($customer->name) || !isset($customer->surname) || !isset($customer->address) || !isset($customer->birth_date) || !isset($customer->gender) || !isset($customer->description) || !isset($customer->astrological_sign)) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }


    $res = get_country_from_address($customer->address);

    if ($res["status"] == false) {
        $country = null;
    } else {
        $country = $res["country"];
    }


    $sql = "INSERT INTO customers
            (id, email, phone_number, name, surname, address, country, birth_date, gender, description, astrological_sign)
            VALUES (:id, :email, :phone_number, :name, :surname, :address, :country, :birth_date, :gender, :description, :astrological_sign)
            ON DUPLICATE KEY UPDATE
            email = :email, phone_number = :phone_number, name = :name, surname = :surname, address = :address, country = :country, birth_date = :birth_date, gender = :gender, description = :description, astrological_sign = :astrological_sign";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $customer->id,
        "email" => $customer->email,
        "phone_number" => $customer->phone_number,
        "name" => $customer->name,
        "surname" => $customer->surname,
        "address" => $customer->address,
        "country" => $country,
        "birth_date" => $customer->birth_date,
        "gender" => $customer->gender,
        "description" => $customer->description,
        "astrological_sign" => $customer->astrological_sign
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
    require DB_PATH;

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
 * @param object $payment       Payment data from the API
 * @return array                Status of the operation
 */
function set_customer_payment_from_api_data($id_customer, $payment)
{
    require DB_PATH;

    if (!isset($payment->id) || !isset($payment->date) || !isset($payment->payment_method) || !isset($payment->amount) || !isset($payment->comment)) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }

    $sql = "INSERT INTO payments
            (id, id_customer, date, method, amount, comment)
            VALUES (:id, :id_customer, :date, :method, :amount, :comment)
            ON DUPLICATE KEY UPDATE
            date = :date, method = :method, amount = :amount, comment = :comment";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $payment->id,
        "id_customer" => $id_customer,
        "date" => $payment->date,
        "method" => $payment->payment_method,
        "amount" => $payment->amount,
        "comment" => $payment->comment
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
 * Get the IDs of the customers.
 * @return array        IDs of the customers
 */
function get_customers_ids()
{
    require DB_PATH;

    $sql = "SELECT id FROM customers";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute();

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "data" => $rows
    ];
}



/**
 * Set a customer cloth in database from the API data.
 * @param int $id_customer      ID of the customer
 * @param object $cloth         Cloth data from the API
 * @return array                Status of the operation
 */
function set_cloth_from_api_data($id_customer, $cloth)
{
    require DB_PATH;

    if (!isset($cloth->id) || !isset($cloth->type)) {
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
        "id" => $cloth->id,
        "id_customer" => $id_customer,
        "type" => $cloth->type
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
    require DB_PATH;

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
 * @param object $encounter     Encounter data from the API
 * @return array                Status of the operation
 */
function set_encounter_from_api_data($encounter)
{
    require DB_PATH;

    if (!isset($encounter->id) || !isset($encounter->customer_id) || !isset($encounter->date) || !isset($encounter->rating) || !isset($encounter->comment) || !isset($encounter->source)) {
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
        "id" => $encounter->id,
        "id_customer" => $encounter->customer_id,
        "date" => $encounter->date,
        "rating" => $encounter->rating,
        "comment" => $encounter->comment,
        "source" => $encounter->source
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
 * @param object $tip           Tip data from the API
 * @return array                Status of the operation
 */
function set_tip_from_api_data($tip)
{
    require DB_PATH;

    if (!isset($tip->id) || !isset($tip->title) || !isset($tip->tip)) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }

    $sql = "INSERT INTO tips (id, title, tip) VALUES (:id, :title, :tip) ON DUPLICATE KEY UPDATE title = :title, tip = :tip";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $tip->id,
        "title" => $tip->title,
        "tip" => $tip->tip
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
 * @param object $event         Event data from the API
 * @return array                Status of the operation
 */
function set_event_from_api_data($event)
{
    require DB_PATH;

    if (!isset($event->id) || !isset($event->name) || !isset($event->date) || !isset($event->duration) || !isset($event->max_participants) || !isset($event->location_x) || !isset($event->location_y) || !isset($event->type) || !isset($event->employee_id) || !isset($event->location_name)) {
        return [
            "status" => false,
            "message" => "Missing data"
        ];
    }

    $sql = "INSERT INTO events
            (id, name, date, duration, max_participants, location_x, location_y, type, id_employee, location_name)
            VALUES (:id, :name, :date, :duration, :max_participants, :location_x, :location_y, :type, :id_employee, :location_name)
            ON DUPLICATE KEY UPDATE
            name = :name, date = :date, duration = :duration, max_participants = :max_participants, location_x = :location_x, location_y = :location_y, type = :type, id_employee = :id_employee, location_name = :location_name";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute([
        "id" => $event->id,
        "name" => $event->name,
        "date" => $event->date,
        "duration" => $event->duration,
        "max_participants" => $event->max_participants,
        "location_x" => $event->location_x,
        "location_y" => $event->location_y,
        "type" => $event->type,
        "id_employee" => $event->employee_id,
        "location_name" => $event->location_name
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
 * Get IDs of the employees removed more than three years ago.
 * @return array                IDs of the employees
 */
function get_employees_removed_more_than_three_years_ago()
{
    require DB_PATH;

    $sql = "SELECT id FROM employees WHERE remove_date <= DATE_SUB(NOW(), INTERVAL 3 YEAR)";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute();

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "data" => $rows
    ];
}



/**
 * Delete a coach favorites from the database.
 * @param int $id_coach         ID of the coach
 * @return array                Status of the operation
 */
function delete_coach_favorites($id_coach)
{
    require DB_PATH;

    $sql = "DELETE FROM coach_favorites WHERE id_coach = :id_coach";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_coach" => $id_coach]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Remove a coach from the customers.
 * @param mixed $id_coach       ID of the coach
 * @return array                Status of the operation
 */
function remove_id_coach_from_customers($id_coach)
{
    require DB_PATH;

    $sql = "UPDATE customers SET id_coach = NULL WHERE id_coach = :id_coach";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_coach" => $id_coach]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete an employee image from the database.
 * @param int $id_employee      ID of the employee
 * @return array                Status of the operation
 */
function delete_employee_image($id_employee)
{
    require DB_PATH;

    $sql = "DELETE FROM employees_images WHERE id_employee = :id_employee";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_employee" => $id_employee]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Get the events of a coach.
 * @param int $id_coach         ID of the coach
 * @return array                Events of the coach
 */
function get_coach_events($id_coach)
{
    require DB_PATH;

    $sql = "SELECT id FROM events WHERE id_employee = :id_coach";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_coach" => $id_coach]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "data" => $rows
    ];
}



/**
 * Delete the customers of an event.
 * @param int $id_event         ID of the event
 * @return array                Status of the operation
 */
function delete_event_customers($id_event)
{
    require DB_PATH;

    $sql = "DELETE FROM events_customers WHERE id_event = :id_event";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_event" => $id_event]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete an event from the database.
 * @param int $id_coach         ID of the coach
 * @return array                Status of the operation
 */
function delete_coach_events($id_coach)
{
    require DB_PATH;

    $sql = "DELETE FROM events WHERE id_employee = :id_coach";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_coach" => $id_coach]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete the employees removed more than three years ago.
 * @return array                Status of the operation
 */
function delete_employees_removed_more_than_three_years_ago()
{
    require DB_PATH;

    $sql = "DELETE FROM employees WHERE remove_date <= DATE_SUB(NOW(), INTERVAL 3 YEAR)";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute();

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Get the IDs of the customers removed more than three years ago.
 * @return array                IDs of the customers
 */
function get_customers_removed_more_than_three_years_ago()
{
    require DB_PATH;

    $sql = "SELECT id FROM customers WHERE remove_date <= DATE_SUB(NOW(), INTERVAL 3 YEAR)";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute();

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "data" => $rows
    ];
}



/**
 * Delete a customer from coaches favorites.
 * @param int $id_customer      ID of the customer
 * @return array                Status of the operation
 */
function delete_customer_from_coaches_favorites($id_customer)
{
    require DB_PATH;

    $sql = "DELETE FROM coach_favorites WHERE id_customer = :id_customer";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_customer" => $id_customer]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete the customer encounters.
 * @param int $id_customer      ID of the customer
 * @return array                Status of the operation
 */
function delete_customer_encounters($id_customer)
{
    require DB_PATH;

    $sql = "DELETE FROM encounters WHERE id_customer = :id_customer";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_customer" => $id_customer]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete the customer events.
 * @param int $id_customer      ID of the customer
 * @return array                Status of the operation
 */
function delete_customer_events($id_customer)
{
    require DB_PATH;

    $sql = "DELETE FROM events_customers WHERE id_customer = :id_customer";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_customer" => $id_customer]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete the customer payments.
 * @param int $id_customer      ID of the customer
 * @return array                Status of the operation
 */
function delete_customer_payments($id_customer)
{
    require DB_PATH;

    $sql = "DELETE FROM payments WHERE id_customer = :id_customer";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_customer" => $id_customer]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete a customer image from the database.
 * @param int $id_customer      ID of the customer
 * @return array                Status of the operation
 */
function delete_customer_image($id_customer)
{
    require DB_PATH;

    $sql = "DELETE FROM customers_images WHERE id_customer = :id_customer";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_customer" => $id_customer]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Get the IDs of a customer clothes.
 * @param int $id_customer      ID of the customer
 * @return array                Status of the operation
 */
function get_customer_clothes($id_customer)
{
    require DB_PATH;

    $sql = "SELECT id FROM clothes WHERE id_customer = :id_customer";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_customer" => $id_customer]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "data" => $rows
    ];
}



/**
 * Delete a customer clothe image from the database.
 * @param int $id_clothe        ID of the clothe
 * @return array                Status of the operation
 */
function delete_customer_clothe_image($id_clothe)
{
    require DB_PATH;

    $sql = "DELETE FROM clothes_images WHERE id_cloth = :id_cloth";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_cloth" => $id_clothe]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete the customer clothes.
 * @param int $id_customer      ID of the customer
 * @return array                Status of the operation
 */
function delete_customer_clothes($id_customer)
{
    require DB_PATH;

    $sql = "DELETE FROM clothes WHERE id_customer = :id_customer";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_customer" => $id_customer]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete the customers removed more than three years ago.
 * @return array                Status of the operation
 */
function delete_customers_removed_more_than_three_years_ago()
{
    require DB_PATH;

    $sql = "DELETE FROM customers WHERE remove_date <= DATE_SUB(NOW(), INTERVAL 3 YEAR)";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute();

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Delete the encounters removed more than three years ago.
 * @return array                IDs of the encounters
 */
function delete_encounters_removed_more_than_three_years_ago()
{
    require DB_PATH;

    $sql = "DELETE FROM encounters WHERE remove_date <= DATE_SUB(NOW(), INTERVAL 3 YEAR)";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute();

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Get the IDs of the events removed more than three years ago.
 * @return array                IDs of the events
 */
function get_events_removed_more_than_three_years_ago()
{
    require DB_PATH;

    $sql = "SELECT id FROM events WHERE remove_date <= DATE_SUB(NOW(), INTERVAL 3 YEAR)";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute();

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "data" => $rows
    ];
}



/**
 * Delete the events removed more than three years ago.
 * @return array                Status of the operation
 */
function delete_events_removed_more_than_three_years_ago()
{
    require DB_PATH;

    $sql = "DELETE FROM events WHERE remove_date <= DATE_SUB(NOW(), INTERVAL 3 YEAR)";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute();

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    return [
        "status" => true
    ];
}



/**
 * Get wether an employee exists in the database or not.
 * @param int $id_employee      ID of the employee
 * @return array                Status of the operation
 */
function do_employee_exist_in_database($id_employee)
{
    require DB_PATH;

    $sql = "SELECT id FROM employees WHERE id = :id_employee";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_employee" => $id_employee]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $row = $stm->fetch(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "does_exist" => !empty($row)
    ];
}



/**
 * Get wether a customer exists in the database or not.
 * @param int $id_customer      ID of the customer
 * @return array                Status of the operation
 */
function do_customer_exist_in_database($id_customer)
{
    require DB_PATH;

    $sql = "SELECT id FROM customers WHERE id = :id_customer";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_customer" => $id_customer]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $row = $stm->fetch(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "does_exist" => !empty($row)
    ];
}



/**
 * Get wether an encounter exists in the database or not.
 * @param int $id_encounter     ID of the encounter
 * @return array                Status of the operation
 */
function do_encounter_exist_in_database($id_encounter)
{
    require DB_PATH;

    $sql = "SELECT id FROM encounters WHERE id = :id_encounter";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_encounter" => $id_encounter]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $row = $stm->fetch(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "does_exist" => !empty($row)
    ];
}



/**
 * Get wether an event exists in the database or not.
 * @param int $id_event         ID of the event
 * @return array                Status of the operation
 */
function do_event_exist_in_database($id_event)
{
    require DB_PATH;

    $sql = "SELECT id FROM events WHERE id = :id_event";

    $stm = $pdo->prepare($sql);
    $res = $stm->execute(["id_event" => $id_event]);

    if ($res == false) {
        return [
            "status" => false,
            "message" => "Error executing the query"
        ];
    }

    $row = $stm->fetch(PDO::FETCH_ASSOC);

    return [
        "status" => true,
        "does_exist" => !empty($row)
    ];
}
