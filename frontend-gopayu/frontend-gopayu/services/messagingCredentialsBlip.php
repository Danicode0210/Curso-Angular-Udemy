<?php
    include 'sebp.php';

    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, Device, x-custom-version, x-custom-times, x-custom-header, X-Sisplay-Header");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Content-Type: application/json');

    date_default_timezone_set('America/Bogota');

    $messaging_account = isset($_SERVER['MESSAGING_ACCOUNT_BLIP']) ? $_SERVER['MESSAGING_ACCOUNT_BLIP'] :'OExvNTlJS0FUakpNWHBjTUE4N3B0QT09';
    $messaging_password = isset($_SERVER['MESSAGING_ACCOUNT_PASSWORD_BLIP']) ? $_SERVER['MESSAGING_ACCOUNT_PASSWORD_BLIP'] : 'OFE0cjROU2Q5WFZJaW1nM21OeGh2Zz09';
    $messaging_content = isset($_SERVER['MESSAGE_CONTENT']) ? $_SERVER['MESSAGE_CONTENT'] : 'Betplay te informa que la clave de registro es ';
    $messaging_content_data_actualization = isset($_SERVER['MESSAGE_CONTENT_DATA_ACTUALIZATION']) ? $_SERVER['MESSAGE_CONTENT_DATA_ACTUALIZATION'] : 'Betplay te informa que la clave de actualización de datos es ';
    $api_url = isset($_SERVER['MESSAGING_URL']) ? $_SERVER['MESSAGING_URL_BLIP'] : 'http://smsboxapi.blipblip.co:9192/?'; 
    $logsFolder = isset($_SERVER['ONL_FOLDER_LOGS']) ? $_SERVER['ONL_FOLDER_LOGS'] :'/home/logs';
    $document_prefix = 'general-blib-blip';
    $response_code = '';
    $response_message = '';
    $response = '';
    // se genera un número aleatoreo de 6 dígitos para ser enviado
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($_GET['url'] == 'generate_message') {

            $md   = md5(time() . mt_rand(1, 1000000));
            $uuid = $md . uniqid();
            //se extrae el cuerpo de la petición
            $json_str = file_get_contents('php://input');
            $json_obj = json_decode($json_str);
            // se genera un número aleatoreo de 6 dígitos
            $random_number = mt_rand(100000, 999999);
          
            $ch = curl_init();
            $message_content = $json_obj->isRegister === 1 ? $messaging_content . $random_number : $messaging_content_data_actualization . $random_number;
            $post = array (
                'msisdn' => $json_obj->phoneNumber,
                'user' => SEBP::decryption($messaging_account),
                'password' => SEBP::decryption($messaging_password),
                'msg' => $message_content,
                'sid' => $random_number, 
                'countryCode' => 'COL'
            );
            curl_setopt ($ch,CURLOPT_URL,$api_url.http_build_query($post)) ;
            curl_setopt ($ch,CURLOPT_POST,1);
            curl_setopt ($ch,CURLOPT_RETURNTRANSFER, true);
            curl_setopt ($ch,CURLOPT_CONNECTTIMEOUT ,20);
            curl_setopt ($ch,CURLOPT_TIMEOUT, 20);
            $response= curl_exec($ch);
            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($httpcode >= 403 || $httpcode === 0) {
                $service_response['code'] = '003';
                $document_prefix = 'error-blip-blip';
                echo json_encode($service_response);
            } else if ($httpcode >= 300 && $httpcode <= 499) {
                $service_response['code'] = '003';
                $document_prefix = 'error-blip-blip';
                echo json_encode($service_response);
            } else if ($httpcode === 200) { 
                $response_array = explode('|', $response);
                $response_message = $response_array[1];
                $response_code = trim(explode('>', $response_array[0])[1]);

                if ($response_code === '1') {
                    $service_response['code'] = '001';
                    $service_response['response'] = array(
                        'code' => $random_number
                    );
                    echo json_encode($service_response);
                } else {
                    $service_response['code'] = '002';
                    $document_prefix = 'error-blip-blip';
                    echo json_encode($service_response);
                }
            }
           
            /**
             * Logs
             */
            $logfich    = $logsFolder.$document_prefix . date("Ymd") . ".log";
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
            $log .= $message_content . '|';
            $log .= $response_code . '|';
            $log .= $response_message . '|';
    
            $err = '-|-';
            if(curl_errno($ch))
            {
                $err = curl_error($ch) . '|' . $response;
            }
    
            $log .= $err;
    
            file_put_contents($logfich, $log, FILE_APPEND);

            curl_close($ch);
    
        } 
    }
?>
