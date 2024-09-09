<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


if (!isset($_ENV["API_KEY"])) {
    echo json_encode([
        "status" => false,
        "message" => "API key is not set"
    ]);
    exit();
}

if (!isset($_ENV["API_EMAIL"]) || !isset($_ENV["API_PASSWORD"])) {
    echo json_encode([
        "status" => false,
        "message" => "Email or password or both are not provided"
    ]);
    exit();
}


$res = login($_ENV["API_KEY"], $_ENV["API_EMAIL"], $_ENV["API_PASSWORD"]);

if ($res["status"] == false) {
    echo json_encode($res);
    exit();
}


echo json_encode([
    "status" => true,
    "message" => "Logged in successfully",
    "token" => $res["token"]
]);



/**
 * Login a user with the API and get the token.
 * @param string $api_key       API key
 * @param string $email         Email of the user
 * @param string $password      Password of the user
 * @return array                Token of the user
 */
function login($api_key, $email, $password)
{
    $url = "https://soul-connection.fr/api/employees/login";
    $data = [
        "email" => $email,
        "password" => $password
    ];
    $header = [
        "Content-Type: application/json",
        "X-Group-Authorization: $api_key"
    ];


    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => $header,
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    curl_close($ch);


    if ($code == 401) {
        return [
            "status" => false,
            "message" => "Invalid credentials"
        ];
    }

    $response = json_decode($response);

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
        "token" => $response->access_token
    ];
}
