<?php 

    //================
    // API CRM Middleware
    // - Prevent Options Request
    // - Optimize performance
    // - Control request to direct apicrm 
    //================
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

    date_default_timezone_set('America/Bogota');

    if($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
    {
        return http_response_code(200);
    }

    //================
    // Includes CURL Request Class
    //================
    require_once('./class/CurlRequest.php');

    //================
    // Base url
    //================
    // $base_url = 'http://192.168.0.82:9000/api/v1'; 
    // $base_url = 'http://192.168.0.82:9001/api/v1';
    $base_url = 'https://apicrm.betplay.com.co/api/v1';

    //================
    // Make CURL Request
    //================
    main($base_url);

    function main($base_url){

        // Recive complement url
        if(isset($_GET['url']))
        {   
            // Create uri
            $url = $base_url . $_GET['url'];

            // Create curl object
            $curl = new CurlRequest();

            //Set body
            $body = null;

            // Get body
            if($_SERVER['REQUEST_METHOD'] == 'POST')
            {
                $body = file_get_contents('php://input');
            }

            // Set headers
            $headers = array(
                'Accept: application/json',
                'Content-Type: application/json'
            );

            if (isset($_SERVER['HTTP_AUTHORIZATION'])) 
            {
                $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
            }

            // Make request
            $response = $curl->request($url, $body, $_SERVER['REQUEST_METHOD'], $headers, 0, 0, 0, 0, true, true);

            if($response)
            {   
                http_response_code($response['code']);

                echo $response['response'];
            }
        }
        else
        {
            http_response_code(400);
        }
    }

?>