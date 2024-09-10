<?php

const DB_PATH = __DIR__ . "/db_connection.php";

const COUNTRIES = [
    "Afghanistan" => "AF",
    "Albania" => "AL",
    "Algeria" => "DZ",
    "Andorra" => "AD",
    "Angola" => "AO",
    "Antigua and Barbuda" => "AG",
    "Argentina" => "AR",
    "Armenia" => "AM",
    "Australia" => "AU",
    "Austria" => "AT",
    "Azerbaijan" => "AZ",
    "Bahamas" => "BS",
    "Bahrain" => "BH",
    "Bangladesh" => "BD",
    "Barbados" => "BB",
    "Belarus" => "BY",
    "Belgium" => "BE",
    "Belize" => "BZ",
    "Benin" => "BJ",
    "Bhutan" => "BT",
    "Bolivia" => "BO",
    "Bosnia and Herzegovina" => "BA",
    "Botswana" => "BW",
    "Brazil" => "BR",
    "Brunei Darussalam" => "BN",
    "Bulgaria" => "BG",
    "Burkina Faso" => "BF",
    "Burundi" => "BI",
    "Cabo Verde" => "CV",
    "Cambodia" => "KH",
    "Cameroon" => "CM",
    "Canada" => "CA",
    "Central African Republic" => "CF",
    "Chad" => "TD",
    "Chile" => "CL",
    "China" => "CN",
    "Colombia" => "CO",
    "Comoros" => "KM",
    "Congo" => "CG",
    "Congo, Democratic Republic of the" => "CD",
    "Costa Rica" => "CR",
    "Croatia" => "HR",
    "Cuba" => "CU",
    "Cyprus" => "CY",
    "Czech Republic" => "CZ",
    "Denmark" => "DK",
    "Djibouti" => "DJ",
    "Dominica" => "DM",
    "Dominican Republic" => "DO",
    "Ecuador" => "EC",
    "Egypt" => "EG",
    "El Salvador" => "SV",
    "Equatorial Guinea" => "GQ",
    "Eritrea" => "ER",
    "Estonia" => "EE",
    "Eswatini" => "SZ",
    "Ethiopia" => "ET",
    "Fiji" => "FJ",
    "Finland" => "FI",
    "France" => "FR",
    "Gabon" => "GA",
    "Gambia" => "GM",
    "Georgia" => "GE",
    "Germany" => "DE",
    "Ghana" => "GH",
    "Greece" => "GR",
    "Grenada" => "GD",
    "Guatemala" => "GT",
    "Guinea" => "GN",
    "Guinea-Bissau" => "GW",
    "Guyana" => "GY",
    "Haiti" => "HT",
    "Honduras" => "HN",
    "Hungary" => "HU",
    "Iceland" => "IS",
    "India" => "IN",
    "Indonesia" => "ID",
    "Iran" => "IR",
    "Iraq" => "IQ",
    "Ireland" => "IE",
    "Israel" => "IL",
    "Italy" => "IT",
    "Jamaica" => "JM",
    "Japan" => "JP",
    "Jordan" => "JO",
    "Kazakhstan" => "KZ",
    "Kenya" => "KE",
    "Kiribati" => "KI",
    "Korea, Democratic People's Republic of" => "KP",
    "Korea, Republic of" => "KR",
    "Kuwait" => "KW",
    "Kyrgyzstan" => "KG",
    "Lao People's Democratic Republic" => "LA",
    "Latvia" => "LV",
    "Lebanon" => "LB",
    "Lesotho" => "LS",
    "Liberia" => "LR",
    "Libya" => "LY",
    "Liechtenstein" => "LI",
    "Lithuania" => "LT",
    "Luxembourg" => "LU",
    "Madagascar" => "MG",
    "Malawi" => "MW",
    "Malaysia" => "MY",
    "Maldives" => "MV",
    "Mali" => "ML",
    "Malta" => "MT",
    "Marshall Islands" => "MH",
    "Mauritania" => "MR",
    "Mauritius" => "MU",
    "Mexico" => "MX",
    "Micronesia (Federated States of)" => "FM",
    "Moldova" => "MD",
    "Monaco" => "MC",
    "Mongolia" => "MN",
    "Montenegro" => "ME",
    "Morocco" => "MA",
    "Mozambique" => "MZ",
    "Myanmar" => "MM",
    "Namibia" => "NA",
    "Nauru" => "NR",
    "Nepal" => "NP",
    "Netherlands" => "NL",
    "New Zealand" => "NZ",
    "Nicaragua" => "NI",
    "Niger" => "NE",
    "Nigeria" => "NG",
    "North Macedonia" => "MK",
    "Norway" => "NO",
    "Oman" => "OM",
    "Pakistan" => "PK",
    "Palau" => "PW",
    "Palestine, State of" => "PS",
    "Panama" => "PA",
    "Papua New Guinea" => "PG",
    "Paraguay" => "PY",
    "Peru" => "PE",
    "Philippines" => "PH",
    "Poland" => "PL",
    "Portugal" => "PT",
    "Qatar" => "QA",
    "Romania" => "RO",
    "Russian Federation" => "RU",
    "Rwanda" => "RW",
    "Saint Kitts and Nevis" => "KN",
    "Saint Lucia" => "LC",
    "Saint Vincent and the Grenadines" => "VC",
    "Samoa" => "WS",
    "San Marino" => "SM",
    "Sao Tome and Principe" => "ST",
    "Saudi Arabia" => "SA",
    "Senegal" => "SN",
    "Serbia" => "RS",
    "Seychelles" => "SC",
    "Sierra Leone" => "SL",
    "Singapore" => "SG",
    "Slovakia" => "SK",
    "Slovenia" => "SI",
    "Solomon Islands" => "SB",
    "Somalia" => "SO",
    "South Africa" => "ZA",
    "South Sudan" => "SS",
    "Spain" => "ES",
    "Sri Lanka" => "LK",
    "Sudan" => "SD",
    "Suriname" => "SR",
    "Sweden" => "SE",
    "Switzerland" => "CH",
    "Syrian Arab Republic" => "SY",
    "Taiwan, Province of China" => "TW",
    "Tajikistan" => "TJ",
    "Tanzania, United Republic of" => "TZ",
    "Thailand" => "TH",
    "Timor-Leste" => "TL",
    "Togo" => "TG",
    "Tonga" => "TO",
    "Trinidad and Tobago" => "TT",
    "Tunisia" => "TN",
    "Turkey" => "TR",
    "Turkmenistan" => "TM",
    "Tuvalu" => "TV",
    "Uganda" => "UG",
    "Ukraine" => "UA",
    "United Arab Emirates" => "AE",
    "United Kingdom of Great Britain and Northern Ireland" => "GB",
    "United States of America" => "US",
    "Uruguay" => "UY",
    "Uzbekistan" => "UZ",
    "Vanuatu" => "VU",
    "Venezuela (Bolivarian Republic of)" => "VE",
    "Viet Nam" => "VN",
    "Yemen" => "YE",
    "Zambia" => "ZM",
    "Zimbabwe" => "ZW"
];



/**
 * Get the country code from the country name.
 * @param string $country       Country name
 * @return bool|string          Country code or false if not found
 */
function get_country_code($country)
{
    $country = ucwords(strtolower($country));

    if (array_key_exists($country, COUNTRIES)) {
        return COUNTRIES[$country];
    } else {
        return false;
    }
}



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
