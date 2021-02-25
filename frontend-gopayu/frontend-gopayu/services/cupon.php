<?php 
	# header('Access-Control-Allow-Origin: http://localhost:4200');
    header("Access-Control-Allow-Headers: Content-Type, secretkey ");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    date_default_timezone_set('America/Bogota');

    error_reporting(E_ALL);
	ini_set('display_errors', 1);

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        return false;
    }

	//Define base_url
	$baseUrl = isset($_SERVER['ONL_CUPON_URL']) ? $_SERVER['ONL_CUPON_URL'] : 'https://192.168.0.82:8085';
	$secretKey = isset($_SERVER['ONL_SECRET_KEY_CUPON']) ? $_SERVER['ONL_SECRET_KEY_CUPON'] : 'testFR';

	if(isset($_GET['url']))
	{		
		$uri = $baseUrl . $_GET['url'];

		// create curl resource 
		$ch = curl_init();

		//Call
		if ($_SERVER['REQUEST_METHOD'] == 'POST') 
		{	
			$json_str = file_get_contents('php://input');
		    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_str);
		}

		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'secretKey: ' . $secretKey
        ));

		//Tell cURL that it should only spend 10 seconds
		//trying to connect to the URL in question.
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
		
		//A given cURL operation should only take
		//15 seconds max.
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		
		// set url 
		curl_setopt($ch, CURLOPT_URL, $uri);
		
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
		
		//return the transfer as a string 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		
		// $output contains the output string 
		$output = curl_exec($ch);

		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		
		http_response_code($httpcode);

		echo $output;

		if($output === false)
		{	
			http_response_code(422);
			echo 'Curl error: ' . curl_error($ch);
		}

		// close curl resource to free up system resources 
		curl_close($ch);
    }
    else 
    {
        http_response_code(400);
    }
		
 ?>
