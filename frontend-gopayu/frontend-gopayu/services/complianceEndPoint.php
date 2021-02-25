<?php
    include 'sebp.php';

    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, Device, x-custom-version, x-custom-times, x-custom-header");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

    date_default_timezone_set('America/Bogota');

    $baseUrlCompliance = 'https://app.compliance.com.co/validador/ws/ConsultaConsolidadaService/consultaConsolidada/soloRiesgo/false';
    $logsFolder     = isset($_SERVER['ONL_FOLDER_LOGS']) ? $_SERVER['ONL_FOLDER_LOGS'] :'/home/logs'; //URL PAS

    $document_prefix = '/general-compliance';
    $response_code = '0';
    $error = false;
    $name = '';
    // $baseUrlCompliance   = 'https://demo.compliance.com.co/validador/api/RegistroConsultaService/registrarConsulta/'; // $_SERVER['ONL_URL_API_COMPLIANCE'];


    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        return false;
    }

    // if ($_SERVER['ONL_FLANG_COMPLIANCE'] == 'FALSE') {
    //     http_response_code(204);
    //     return false;
    // }

    # Get JSON as a string
    $json_str = file_get_contents('php://input');
    # Get as an object

    $json_obj = json_decode($json_str);

    $json_obj->requestIp = $_SERVER['REMOTE_ADDR'];

    // die($json_obj->Authorization);
    $datos = array();

    // create curl resource
    $ch = curl_init();

    //MmxuT2NUbHdXR2dqcWo4aUNQYVJpaWFMZXpETEgxbVo2ZGRPeDdWS2R6VT0=
    //YkoyU2JVSE14Slo0ajhkMXNyVllPQT09
    //$userCompliance = SEBP::decryption('MmxuT2NUbHdXR2dqcWo4aUNQYVJpaWFMZXpETEgxbVo2ZGRPeDdWS2R6VT0=');//SEBP::decryption($_SERVER['ONL_USER_COMPLIANCE']);
    //$passCompliance = SEBP::decryption('YkoyU2JVSE14Slo0ajhkMXNyVllPQT09');//SEBP::decryption($_SERVER['ONL_PASS_COMPLIANCE']);

    $userCompliance = isset($_SERVER['ONL_USER_COMPLIANCE']) ? SEBP::decryption($_SERVER['ONL_USER_COMPLIANCE']) : SEBP::decryption('RFNsRGJXd2RqSEpyRVZPckwrUHYwRzZDS21IcWtNK0dUVkxVZEVZb3lOYlNLNWpRVzlLdHB3ZE5CVUNqWVl3RA==');//SEBP::decryption($_SERVER['ONL_USER_COMPLIANCE']);
    $passCompliance = isset($_SERVER['ONL_PASS_COMPLIANCE']) ? SEBP::decryption($_SERVER['ONL_PASS_COMPLIANCE']) : SEBP::decryption('eVBwRVJ3OEpJRUozdzhlcnFHVnJNdz09');//SEBP::decryption($_SERVER['ONL_PASS_COMPLIANCE']);

    curl_setopt($ch, CURLOPT_USERPWD, $userCompliance . ":" . $passCompliance );

    $md   = md5(time() . mt_rand(1, 1000000));
    $uuid = $md . uniqid();

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_str);
    }

    //Tell cURL that it should only spend 10 seconds
    //trying to connect to the URL in question.
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);

    //A given cURL operation should only take
    //15 seconds max.
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);

    // set url
    curl_setopt($ch, CURLOPT_URL, $baseUrlCompliance);

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

    //return the transfer as a string
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    // $output contains the output string
    $output = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpcode === 200) {
        http_response_code($httpcode);
        $rest = json_decode($output);
        $name = trim($json_obj->name);
        $name = str_replace('  ',' ', $name);
        $name = strtoupper($name);
        $validate_date = trim($json_obj->validateDate);
        $rest_name = trim($rest->nombre);
        $rest_name = preg_replace('/\s+/', ' ', $rest_name);
        $descripcion = $rest->resultados[0]->descripcion[0];
        if ($rest->resultados[0]->lista === 'CertificarValidezFechaExpDocumentoService' && $validate_date === 'active') {
            $valid_expedition_date = explode('|', $descripcion)[2];
            $valid_expedition_date = explode(' ', $valid_expedition_date)[1];
            http_response_code(200);
            if(isset($rest->nombre) && strcmp($rest_name,$name) === 0)
            {
                if ($valid_expedition_date === 'SI') {
                    /*
                    * codigo 001 = El nombre y la fecha de expedición coinciden con lo ingresado por el usuario  
                    */
                    $response_code = '001';
                    echo json_encode(['code'=> '001']);
                } else {
                    /*
                    * codigo 003 = la fecha de expedición no es la correcta 
                    */
                    $response_code = '003';
                    echo json_encode(['code'=> '003']);
                }
            }
            else
            {   
                if(isset($rest->nombre))
                {
                    /*
                    * codigo 002 = el nombre no es correcto 
                    */
                    $response_code = '002';
                    echo json_encode(['code'=> '002']);
                }
                else 
                {
                    /*
                    * codigo 004 = la cedula no fue encontrada 
                    */
                    $response_code = '004';
                    echo json_encode(['code'=> '004']);
                }
            }
        } else {
            http_response_code(200);
            if(isset($rest->nombre) && strcmp($rest_name,$name) === 0)
            {
                /*
                * codigo 001 = El nombre coincide con lo ingresado por el usuario  
                */
                $response_code = '001';
                echo json_encode(['code'=> '001']); 
            }
            else
            {   
                if(isset($rest->nombre))
                {
                    /*
                    * codigo 002 = el nombre no es correcto 
                    */
                    $response_code = '002';
                    echo json_encode(['code'=> '002']);
                }
                else 
                {
                    /*
                    * codigo 004 = la cedula no fue encontrada 
                    */
                    $response_code = '004';
                    echo json_encode(['code'=> '004']);
                }
            }
        }
    }
    else if ($httpcode === 202) {
        /*
        * codigo 004 = la cedula no fue encontrada 
        */
        $response_code = '004';
        echo json_encode(['code'=> '004']);
    } 
    else if ($httpcode >= 403 || $httpcode === 0){
        /*
         * codigo 005 = el servicio de Compliance está abajo  
         */
        $response_code = '005';
        echo json_encode(['code'=> '005']);
        $error = true;
        $document_prefix = '/error-compliance';
    } else if ($httpcode >= 300 && $httpcode <= 499) {
        $response_code = '006';
        echo json_encode(['code'=> '006']);
    }
    /**
     * Logs
     */
    $logfich    =  $logsFolder.$document_prefix . date("Ymd") . ".log";
    $log = "\n";
    $log .= date('Y-m-d H:i:s') . '|';
    $log .= curl_getinfo($ch, CURLINFO_HTTP_CODE) . '|';
    $log .= $uuid . '|';
    $log .= curl_getinfo($ch, CURLINFO_TOTAL_TIME) . '|';
    $log .= curl_getinfo($ch, CURLINFO_CONNECT_TIME) . '|';
    $log .= isset($strxforwarded) ? $strxforwarded : '-';
    $log .= '|';
    $log .= $_SERVER['REQUEST_METHOD'] . '|';
    $log .= file_get_contents('php://input') . '|';
    $log .= $response_code . '|';
    $log .= $name . '|';

    $err = '-|-';
    if(curl_errno($ch))
    {
      $err = curl_error($ch) . '|' . $output;
    }

    $log .= $err;

    file_put_contents($logfich, $log, FILE_APPEND);
    // Fin Logs sobre la peticion

    // close curl resource to free up system resources
    curl_close($ch);
?>
