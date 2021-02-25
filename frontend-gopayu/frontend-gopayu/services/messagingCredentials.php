<?php
    include 'sebp.php';

    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, Device, x-custom-version, x-custom-times, x-custom-header, X-Sisplay-Header");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Content-Type: application/json');

    date_default_timezone_set('America/Bogota');

    $messaging_account = isset($_SERVER['MESSAGING_ACCOUNT']) ? $_SERVER['MESSAGING_ACCOUNT'] :'dURCMDJCc2FaalBiY0tJcWl3allxdz09';
    $messaging_apikey = isset($_SERVER['MESSAGING_APIKEY']) ? $_SERVER['MESSAGING_APIKEY'] :'RUZPbFlZbkt2ZWJQV2lPalRkRmRLUnViSVg1RkdhZWNZaEVhVTJaOFFXYz0=';
    $messaging_token = isset($_SERVER['MESSAGING_TOKEN']) ? $_SERVER['MESSAGING_TOKEN'] :'c1FkVFpiODBRV3NGa2NlSFpwbDJYd3U5dDh6VnFTK215SFozdTB1a2sxOWF4eHEwYkVuUmU4N2h2Qk5LOXVHMQ==';
    $api_url = isset($_SERVER['MESSAGING_URL']) ? $_SERVER['MESSAGING_URL'] : 'https://api101.hablame.co/api/sms/v2.1/send/'; 
    $sms_prioritario = isset($_SERVER['PRIORITY_MESSAGE']) ? $_SERVER['PRIORITY_MESSAGE'] : 1;
    $messaging_content = isset($_SERVER['MESSAGE_CONTENT']) ? $_SERVER['MESSAGE_CONTENT'] : 'Betplay te informa que la clave de registro es ';
    $messaging_content_data_actualization = isset($_SERVER['MESSAGE_CONTENT_DATA_ACTUALIZATION']) ? $_SERVER['MESSAGE_CONTENT_DATA_ACTUALIZATION'] : 'Betplay te informa que la clave de actualización de datos es ';
    $logsFolder = isset($_SERVER['ONL_FOLDER_LOGS']) ? $_SERVER['ONL_FOLDER_LOGS'] :'/home/logs';
    $document_prefix = 'general-hablame';

    $message_content = '';
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
                'account' => SEBP::decryption($messaging_account),
                'apiKey' => SEBP::decryption($messaging_apikey),
                'token' => SEBP::decryption($messaging_token),
                'toNumber' => $json_obj->phoneNumber,
                'sms' => $message_content,
                'isPriority' => $sms_prioritario
            );
            curl_setopt ($ch,CURLOPT_URL,$api_url) ;
            curl_setopt ($ch,CURLOPT_POST,1);
            curl_setopt ($ch,CURLOPT_POSTFIELDS, $post);
            curl_setopt ($ch,CURLOPT_RETURNTRANSFER, true);
            curl_setopt ($ch,CURLOPT_CONNECTTIMEOUT ,20);
            curl_setopt ($ch,CURLOPT_TIMEOUT, 20);
            $response= curl_exec($ch);
            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($httpcode >= 403 || $httpcode === 0) {
                $service_response['code'] = '003';
                $document_prefix = 'error-hablame';
                echo json_encode($service_response);
            } else if ($httpcode >= 300 && $httpcode <= 499) {
                $service_response['code'] = '003';
                $document_prefix = 'error-hablame';
                echo json_encode($service_response);
            } else if ($httpcode === 202) {
                $response= json_decode($response ,true);
                if ($response != null) {
                    if ($response["status"] == '1x000' ){
                        $service_response['code'] = '001';
                        $service_response['response'] = array(
                            'code' => $random_number
                        );
                        echo json_encode($service_response);
                    } else {
                        $service_response['code'] = '002';
                        $document_prefix = 'error-hablame';
                        echo json_encode($service_response);
                    }
                } else {
                    $service_response['code'] = '003';
                    $document_prefix = 'error-hablame';
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
            $log .= file_get_contents('php://input') . '|' . json_encode($response) . '|' . $message_content . '|';
    
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
