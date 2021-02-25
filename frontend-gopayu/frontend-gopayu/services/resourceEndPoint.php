<?php
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Headers: Content-Type");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

    date_default_timezone_set('America/Bogota');
    
    $ambiente = isset($_SERVER['ONL_ACTIVE_ENVIROMENTS']) ? $_SERVER['ONL_ACTIVE_ENVIROMENTS'] : 3; // 1 Ambos - 2 Sisplay - 3 Franco 
    $registration = isset($_SERVER['ONL_REGISTRATION_ENVIROMENT']) ? $_SERVER['ONL_REGISTRATION_ENVIROMENT'] : 3; // 1 Sisplay - 2 Rfranco 

    if($ambiente == 1 || $ambiente == 2 && $registration == 1)
    {
        $uri = isset($_SERVER['SIS_API_URL']) ? $_SERVER['SIS_API_URL'] :'https://172.27.196.44:'; //URL PAS
        $uri = $uri. '31009' . $_GET['url'];
    }
    else 
    {
        $uri = 'https://apipas.betplay.com.co/ResourcesAPI/v1/'.$_GET['url'];
    }

     # Get JSON as a string
    $json_str = file_get_contents('php://input');
    # Get as an object
    $json_obj = json_decode($json_str);

    // die($json_obj->Authorization);
    $datos = array();

    // create curl resource
    $ch = curl_init();

    $remoteip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '-';
    $forewardip = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : '-';
    $serverip = isset($_SERVER['HTTP_CLIENT_IP']) ? $_SERVER['HTTP_CLIENT_IP'] : '-';

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

    $md = md5(time().mt_rand(1,1000000));
    $uuid = $md.uniqid();

    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Accept: application/json',
        'Content-Type: application/json',
        'X-Forwarded-For: '.$strxforwarded,
        'X-Request-Id: '.$uuid
    ));

    curl_setopt($ch, CURLOPT_URL, $uri);

    //return the transfer as a string
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    //Tell cURL that it should only spend 20 seconds
    //trying to connect to the URL in question.
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);

    //A given cURL operation should only take
    //15 seconds max.
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

    // $output contains the output string
    $output = curl_exec($ch);


    $contentlog = '';
    // Logs sobre la peticion
    if(curl_errno($ch)){
        echo 'Curl error: ' . curl_error($ch);
        $logfich = "/home/logs/error-general-resource".date("Ymd").".log";
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
        file_put_contents($logfich, $contentlog, FILE_APPEND);
        http_response_code(406);
        curl_close($ch);
    }
    // Fin Logs sobre la peticion

    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    http_response_code($httpcode);

    $rest = json_decode($output);

    if($_GET['url'] == '/resources/document_types' && $httpcode == 200 && ($ambiente == 3 || $registration == 2))
    {   
        $data = $rest;
        
        $rest = Array();

        foreach ($data as $row)
        {   
            $r = new stdClass();

            switch($row->code) {
                case 'ID':
                    $r->code = '3';
                break;
                case 'RES':
                    $r->code = '4';
                break;
                default:
                    $r->code = $row->code;
                break;
            }

            $r->description = $row->description;

            $rest[] = $r;
        }
    }

    echo json_encode($rest);

    // close curl resource to free up system resources
    curl_close($ch);

 ?>
