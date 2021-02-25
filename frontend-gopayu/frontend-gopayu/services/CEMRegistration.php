<?php


    /**
     * key arrangement
     */
    $secret_object = array(

    	"897a84794faf17e7197bbb67592ebbe8",
    	"db0c2d4a59315fef886e42573a314984",
    	"cfe7f3089c01b29c68bdb451ffa4e872",
    	"a79b2f3c14e0ddbddfeac71a9145ddf8",
    	"15808ef7f88a9f5f7ab061d3386e9ca5"
    );
    $secret = $_SERVER['HTTP_SECRETKEY'];
    /**
     * Secrect key 
     */
    if(!isset($_SERVER['HTTP_SECRETKEY']) || !in_array($secret, $secret_object)){

    	return http_response_code(401); 

    	return false;
    }
    

    if(isset($_GET['url'])){

    	// variable params
    	$params = "";

    	$md   = md5(time() . mt_rand(1, 1000000));

    	$uuid = $md . uniqid();

		$timeRequest = date('Y-m-d H:i:s',time());   // Current time

		$validate_params = explode("/", $_GET['url']);
    	        // check what kind of services is
		if($validate_params[1] == "regions" || $validate_params[1] == "cities") {

    	            // we have to validate if the services have the parameters
			if(isset($_GET['countryCode'])){

				$params = "?countryCode=".$_GET['countryCode'];

			}else if(isset($_GET['regionCode'])){

				$params = "?regionCode=".$_GET['regionCode'];

			}else {

				http_response_code(400);
				return;
			}

		}

		// Production
		$baseUrlResources = 'https://apipas.betplay.com.co/ResourcesAPI/v1/';
		// Develop
		// $baseUrlResources   = 'https://demo.compliance.com.co/validador/api/RegistroConsultaService/registrarConsulta/'; // $_SERVER['ONL_URL_API_COMPLIANCE'];


		$data['url'] = $baseUrlResources.$_GET['url'].$params;

		$data['request_Method'] = $_SERVER['REQUEST_METHOD'];

		$info = curl_process($data);

		echo json_encode($info);

		return;
	}

	include 'sebp.php';

	header("Access-Control-Allow-Headers: Content-Type, Authorization");
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

	date_default_timezone_set('America/Bogota');
    
	// Production
    // $baseUrlCompliance = 'https://app.compliance.com.co/validador/api/ConsultaConsolidadaService/consultaConsolidada/soloRiesgo/false';
    // Develop
    $baseUrlCompliance   = 'https://demo.compliance.com.co/validador/api/RegistroConsultaService/registrarConsulta/'; // $_SERVER['ONL_URL_API_COMPLIANCE'];

	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		http_response_code(200);
		return false;
	}

    # Get JSON as a string
	$json_str = file_get_contents('php://input');

    # Get as an object
	$json_obj = json_decode($json_str);

	$json_obj->requestIp = $_SERVER['REMOTE_ADDR'];

	$name_validate = $json_obj->firstName." ".$json_obj->firstName2." ".$json_obj->lastName." ".$json_obj->lastName2;

    /*
    * Build the array 
    */
    $validate_user = array(

    	"datoConsultar" => $json_obj->documentNumber,
    	"tipoDocumento" => ($json_obj->documentType == 'ID') ? 'cc' : 'ce',
    	"name" => $name_validate
    );

    $data['info'] = $validate_user;

    $data['url'] = $baseUrlCompliance;

    /**
     * Production
     */
    // $data['userCompliance'] = SEBP::decryption('Q3RHczlQRDFGUUlOYXJKc3k4dmRWeU9iZnlCTkVCeHJrOWFqQlFSTlp4Yz0=');//SEBP::decryption($_SERVER['ONL_USER_COMPLIANCE']);
    // $data['passCompliance'] = SEBP::decryption('WEZpQkdYZDJwakhxcHF4N1B2NnAvbFJCV1Ryajk4WktqVTkyMXN5V3QwZz0=');//SEBP::decryption($_SERVER['ONL_PASS_COMPLIANCE']);
    /**
     * Develop
     */
    $data['userCompliance'] = SEBP::decryption('MmxuT2NUbHdXR2dqcWo4aUNQYVJpaWFMZXpETEgxbVo2ZGRPeDdWS2R6VT0=');//SEBP::decryption($_SERVER['ONL_USER_COMPLIANCE']);
    $data['passCompliance'] = SEBP::decryption('YkoyU2JVSE14Slo0ajhkMXNyVllPQT09');//SEBP::decryption($_SERVER['ONL_PASS_COMPLIANCE']);

    $data['request_Method'] = $_SERVER['REQUEST_METHOD'];

    $response_curl = curl_process($data);

    
    $response = array();

    $name = trim($name_validate);
    $name = str_replace('  ',' ', $name);
    $name = strtoupper($name);
    $name = str_replace('ñ','Ñ', $name);

    $validate_process_name = false;
    // echo isset($response_curl->nombre) && $response_curl->nombre === $name;
    if(isset($response_curl->nombre) && $response_curl->nombre === $name)
    {
    	$baseUrlRFranco = "http://integration.mediatechsolutions.es:59815/v1/accounts";

    	$data['request_Method'] = $_SERVER['REQUEST_METHOD'];

    	$data['info'] = $json_obj;
    	$data['url'] = $baseUrlRFranco;


    	$curl_response = curl_process($data);

    	echo json_encode($curl_response);
    }
    else
    {   
    	if(isset($rest->nombre))
    	{
    		$response = array(

    			"validationErrors" => $obj = [

    				array(  "errorCode" => "InvalidRealName" )

    			]


    		);

    		$validate_process_name = true;

    		http_response_code(422);

    		echo json_encode($response);

    	}
    	else 
    	{

    		$response = array(

    			"validationErrors" => $obj = [

    				array(  "errorCode" => "documentNotFound" )

    			]

    		);

    		$validate_process_name = true;

    		http_response_code(422);


    	}

    }

    curl_close($ch);

    if($validate_process_name){

    	echo json_encode($response);
    	return;

    }


    


    function curl_process ($data) {

    	$timeRequest = date('Y-m-d H:i:s',time());   // Current time

    	$md   = md5(time() . mt_rand(1, 1000000));

    	$uuid = $md . uniqid();

    	$ch = curl_init();

    	$remoteip   = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '-';
    	$forewardip = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : '-';
    	$serverip   = isset($_SERVER['HTTP_CLIENT_IP']) ? $_SERVER['HTTP_CLIENT_IP'] : '-';

    	$strxforwarded = '';

    	if ($forewardip != null && $forewardip != '') {

    		$strxforwarded = $forewardip;

    		if ($serverip != null && $serverip != '') {

    			$strxforwarded = $strxforwarded . ', ' . $serverip;

    		}

    	} else {

    		if ($serverip != null && $serverip != '') {

    			$strxforwarded = $strxforwarded . $serverip;

    		}
    	}

    	if(isset($data['userCompliance'])){

    		curl_setopt($ch, CURLOPT_USERPWD, $data['userCompliance'] . ":" . $data['passCompliance'] );

    	}

    	

    	if ($data['request_Method'] == 'POST') {

    		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));

    		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data['info']));

    	}

        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20); //Tell cURL that it should only spend 20 seconds trying to connect to the URL in question.
        
        curl_setopt($ch, CURLOPT_TIMEOUT, 20); // A given cURL operation should only take 20 seconds max.
        
        curl_setopt($ch, CURLOPT_URL, $data['url']); // set url
        
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $data['request_Method']);
        
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //return the transfer as a string
        
        if($data['request_Method'] != "POST"){

        	curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4); // Fixing failed to connect

        	curl_setopt($ch, CURLOPT_VERBOSE, true);

        	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Length: 0'));

        }

        $output = curl_exec($ch); // $output contains the output string

        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        /*
        *
        * Register log
        *
        */
        
        $log  = "";
        $log .= $timeRequest . '|';
        $log .= curl_getinfo($ch, CURLINFO_HTTP_CODE) . '|';
        $log .= curl_getinfo($ch, CURLINFO_TOTAL_TIME) . '|';
        $log .= curl_getinfo($ch, CURLINFO_CONNECT_TIME) . '|';
        $log .= isset($_SERVER['HTTP_X_CUSTOM_TIMES']) ? $_SERVER['HTTP_X_CUSTOM_TIMES'] : '-';
        $log .= '|';
        $log .= $uuid . '|';
        $log .= isset($_SERVER['HTTP_X_CUSTOM_HEADER']) ? $_SERVER['HTTP_X_CUSTOM_HEADER'] : '-';
        $log .= '|';
        $log .= $_SERVER['REQUEST_METHOD'] . '|';
        $log .= $logVersion . '|';
        $log .= $lastUrl."\n";

        file_put_contents($logPath, $log, FILE_APPEND);

        $contentlog = '';
        $contentlogtime = '';

        if (curl_errno($ch)) {

        	curl_error($ch). ' -';
        	$logfich    = "/home/logs/error-CEMRegistration-resources" . date("Ymd") . ".log";
        	$interline  = date("Y-m-d H:i:s");
        	$contentlog = $contentlog . $interline;
        	$interline  = "|";
        	$contentlog = $contentlog . $interline;
        	$interline  = $uuid;
        	$contentlog = $contentlog . $interline;
        	$interline  = "|";
        	$contentlog = $contentlog . $interline;
        	$interline  = $strxforwarded;
        	$contentlog = $contentlog . $interline;
        	$interline  = "|";
        	$contentlog = $contentlog . $interline;
        	$interline  = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        	$contentlog = $contentlog . $interline;
        	$interline  = "|";
        	$contentlog = $contentlog . $interline;
        	$interline  = $_SERVER['REQUEST_METHOD'];
        	$contentlog = $contentlog . $interline;
        	$interline  = "|";
        	$contentlog = $contentlog . $interline;
        	$interline  = 'Curl error: ' . curl_error($ch);
        	$contentlog = $contentlog . $interline;
        	$interline  = "\n";
        	$contentlog = $contentlog . $interline;
        	$interline  = "|";
        	$contentlog .= $interline;
        	$contentlog .= $logVersion;
        	if($_GET['url'] == '/accounts')
        	{
        		$interline  = "|";
        		$contentlog .= $interline . $url.$params;
        	}
        	file_put_contents($logfich, $contentlog, FILE_APPEND);

        	http_response_code(406);

        	curl_close($ch);

        	return;

        }
        /*
        *
        * End register log
        *
        */

        http_response_code($httpcode);

        $rest = json_decode($output);

        return $rest;

    }

    ?>