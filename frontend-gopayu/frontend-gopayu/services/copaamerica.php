<?php 
	
	// if(	$_SERVER['HTTP_ORIGIN'] == 'http://localhost:8080' || 
	// 	$_SERVER['HTTP_ORIGIN'] == 'http://192.168.0.28' || 
	// 	$_SERVER['HTTP_ORIGIN'] == 'http://192.168.0.31' || 
	// 	$_SERVER['HTTP_ORIGIN'] == 'https://betplay.com.co')
	// {
 //    	header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
	// }
	header("Access-Control-Allow-Headers: Content-Type");
	header('Access-Control-Allow-Methods: POST, OPTIONS');


	if($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
	{
		http_response_code(200);
		exit();
	}

	//Validate method request
	if($_SERVER['REQUEST_METHOD'] != 'POST')
	{
		http_response_code(405);
		exit();
	}

	// Url
	$uri = 'http://190.69.24.54:9080/api/users.php';

	// create curl resource 
	$ch = curl_init();

	//Call
	if ($_SERVER['REQUEST_METHOD'] == 'POST') 
	{
    	$json_str = file_get_contents('php://input');
	    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_str);
	}
	
	//Tell cURL that it should only spend 10 seconds
	//trying to connect to the URL in question.
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
	
	//A given cURL operation should only take
	//15 seconds max.
	curl_setopt($ch, CURLOPT_TIMEOUT, 20);
	
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

	// close curl resource to free up system resources 
	curl_close($ch);
	
 ?>