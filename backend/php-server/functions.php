<?php

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
            "message" => $response->detail[0]->msgs
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
