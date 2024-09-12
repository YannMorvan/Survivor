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

const ASTROLOGICAL_SIGNS_PERIODS = [
    "Aries" => [
        "start_month" => 3,
        "start_day" => 21,
        "end_month" => 4,
        "end_day" => 19
    ],
    "Taurus" => [
        "start_month" => 4,
        "start_day" => 20,
        "end_month" => 5,
        "end_day" => 20
    ],
    "Gemini" => [
        "start_month" => 5,
        "start_day" => 21,
        "end_month" => 6,
        "end_day" => 20
    ],
    "Cancer" => [
        "start_month" => 6,
        "start_day" => 21,
        "end_month" => 7,
        "end_day" => 22
    ],
    "Leo" => [
        "start_month" => 7,
        "start_day" => 23,
        "end_month" => 8,
        "end_day" => 22
    ],
    "Virgo" => [
        "start_month" => 8,
        "start_day" => 23,
        "end_month" => 9,
        "end_day" => 22
    ],
    "Libra" => [
        "start_month" => 9,
        "start_day" => 23,
        "end_month" => 10,
        "end_day" => 22
    ],
    "Scorpio" => [
        "start_month" => 10,
        "start_day" => 23,
        "end_month" => 11,
        "end_day" => 21
    ],
    "Sagittarius" => [
        "start_month" => 11,
        "start_day" => 22,
        "end_month" => 12,
        "end_day" => 21
    ],
    "Capricorn" => [
        "start_month" => 12,
        "start_day" => 22,
        "end_month" => 1,
        "end_day" => 19
    ],
    "Aquarius" => [
        "start_month" => 1,
        "start_day" => 20,
        "end_month" => 2,
        "end_day" => 18
    ],
    "Pisces" => [
        "start_month" => 2,
        "start_day" => 19,
        "end_month" => 3,
        "end_day" => 20
    ]
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



/**
 * Convert an hexadecimal color to RGB.
 * @param string $hex           Hexadecimal color
 * @return array                RGB color
 */
function hex_to_rgb($hex)
{
    $hex = str_replace("#", "", $hex);

    if (strlen($hex) == 3) {
        $r = hexdec(str_repeat(substr($hex, 0, 1), 2));
        $g = hexdec(str_repeat(substr($hex, 1, 1), 2));
        $b = hexdec(str_repeat(substr($hex, 2, 1), 2));
    } else {
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
    }

    return [$r, $g, $b];
}



/**
 * Get the luminance of a color.
 * @param array $rgb            RGB color
 * @return float                Luminance
 */
function get_luminance($rgb)
{
    foreach ($rgb as &$value) {
        $value /= 255;
        $value = ($value <= 0.03928) ? $value / 12.92 : pow(($value + 0.055) / 1.055, 2.4);
    }

    return 0.2126 * $rgb[0] + 0.7152 * $rgb[1] + 0.0722 * $rgb[2];
}



/**
 * Get the contrast ratio between a color and white.
 * @param string $hex_color     Hexadecimal color
 * @param string $white         Hexadecimal white color
 * @return float
 */
function get_contrast_ratio($hex_color, $white = "#FFFFFF")
{
    $rgb1 = hex_to_rgb($hex_color);
    $rgb2 = hex_to_rgb($white);

    $luminance1 = get_luminance($rgb1);
    $luminance2 = get_luminance($rgb2);

    $contrast_ratio = ($luminance1 + 0.05) / ($luminance2 + 0.05);

    if ($contrast_ratio < 1) {
        $contrast_ratio = 1 / $contrast_ratio;
    }

    return $contrast_ratio;
}



/**
 * Generate a random hexadecimal color.
 * @return string               Hexadecimal color
 */
function generate_random_color()
{
    return sprintf("#%06X", mt_rand(0, 0xFFFFFF));
}



/**
 * Generate a readable color with a contrast ratio greater than a threshold.
 * @param float $contrast_threshold     Contrast ratio threshold
 * @return string                       Hexadecimal color
 */
function generate_readable_color($contrast_threshold = 4.0)
{
    do {
        $new_color = generate_random_color();
        $contrast = get_contrast_ratio($new_color);
    } while ($contrast < $contrast_threshold);

    return $new_color;
}



/**
 * Get the astrological sign from a birth date.
 * @param DateTime $birth_date    Birth date
 * @return bool|string            Astrological sign
 */
function get_astrological_sign_from_birth_date($birth_date)
{
    $birth_month = intval($birth_date->format("n"));
    $birth_day = intval($birth_date->format("j"));

    foreach (ASTROLOGICAL_SIGNS_PERIODS as $sign => $period) {
        if (($birth_month == $period["start_month"] && $birth_day >= $period["start_day"]) || ($birth_month == $period["end_month"] && $birth_day <= $period["end_day"])) {
            return $sign;
        }
    }

    return false;
}
