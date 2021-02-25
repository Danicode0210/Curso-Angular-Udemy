<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    require 'lib/PHPMailer/src/Exception.php';
    require 'lib/PHPMailer/src/PHPMailer.php';
    require 'lib/PHPMailer/src/SMTP.php';

    header("Access-Control-Allow-Headers: Content-Type, secretKey, x-sisplay-header, Authorization");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

    date_default_timezone_set('America/Bogota');
    
    $sisplayURL     = isset($_SERVER['SIS_API_URL']) ? $_SERVER['SIS_API_URL'] :'https://172.27.196.44:'; //URL sisplay
    $francoURL   = 'https://apipas.betplay.com.co/PhysicalPaymentAPI/v1/';   //Url api
    $pinErrorsToReport = 100;                                              //Number of errors to report
    $to =  'disenadorweb@cemcolombia.co';                                  //Emails to send error report
    $tmpFolder     = isset($_SERVER['PIN_TMP_FOLDER']) ? $_SERVER['PIN_TMP_FOLDER'] :'/home/tmp/'; //URL sisplay
    $emailConf = array(
        'Host'      => "ssl://smtp.googlemail.com",                        // SMTP Mail Host
        'SMTPDebug' => 0,                                                  // enables debug information
        'SMTPAuth' => true,                                                // enable SMTP authentication
        'Port'      => 465,                                                // SMTP Port
        'Username'  => "kubopruebas@gmail.com",                            // Email address
        'Password'  => "otaku666"                                          // Email password
    );

    if(isset($_SERVER['HTTP_X_SISPLAY_HEADER']) && $_SERVER['HTTP_X_SISPLAY_HEADER'] == 'true')
    {
        $baseUrl = str_replace('https', 'http', $sisplayURL) .'31008/v1/';
    }
    else 
    {
        $baseUrl = $francoURL;
    }

    // Mail config
    $sendMail = false;                                                     // Flag to active mail sending on wrong responsess

    # Get JSON as a string
    $json_str = file_get_contents('php://input');
    # Get as an object
    $json_obj = json_decode($json_str);

    $sessionFile = $tmpFolder.'lastRetire'.$json_obj->docNumber.'.txt';

    if (file_exists($sessionFile) && file_get_contents($sessionFile) >= strtotime('-20 seconds')) 
    {
        $response = array(
            'message' => 'Debes esperar al menos 20 segundos para realizar de nuevo esta transacción'
        );    

        http_response_code(422);

        echo json_encode($response);
        die();
    }

    file_put_contents($sessionFile, strtotime(date('Y-m-d H:i:s')));

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

    $md2 = md5(time().mt_rand(1,1000000));
    $uuid2 = $md.uniqid();

    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Accept: application/json',
        'Content-Type: application/json',
        'secretKey: FA3a379pV9jm2V8J',
        'X-Forwarded-For: '.$strxforwarded,
        'X-Request-Id: '.$uuid
    ));

    $json_obj->requestIp = $_SERVER['REMOTE_ADDR'];
    $json_obj->externalUID = $uuid2;

    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($json_obj));
    // set url

    curl_setopt($ch, CURLOPT_URL, $baseUrl.'pinwithdrawal'); //"https://apipas.betplay.com.co/PhysicalPaymentAPI/v1/pinwithdrawal");

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

    //Tell cURL that it should only spend 10 seconds
    //trying to connect to the URL in question.
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);

    //A given cURL operation should only take
    //15 seconds max.
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);

    //return the transfer as a string
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    // $output contains the output string
    $output = curl_exec($ch);

    $contentlog = '';
    if(curl_errno($ch)){

        //Set default counter
        $count = 0;
        $mailSend = 'no';
        $errDate = date('Y-m-d');
        $file = '/home/logs/pin-counter.txt';

        //Increase counter
        if(file_exists($file))
        {
          $fileData = file_get_contents($file);
          $fileData = explode('|', $fileData);
          $count = intval($fileData[1]);
          $errDate = $fileData[0];
          $mailSend = $fileData[2];

          if($errDate != date('Y-m-d'))
          {
            $errDate = date('Y-m-d');
            $mailSend = 'no';
            $count = 0;
          }
          if($sendMail && $count == $pinErrorsToReport && ($mailSend == 'no' || date('Y-m-d H:i:s',strtotime($mailSend)) < date('Y-m-d H:i:s', strtotime('-1 hour'))))
          {
            $count = 0;
            sendEmailReport($pinErrorsToReport, $to, $emailConf);
            $mailSend = date('Y-m-d H:i:s');
          }
        }

        $count++;

        file_put_contents($file, $errDate.'|'.$count.'|'.$mailSend);

        echo 'Curl error: ' . curl_error($ch);
        $logfich = "/home/logs/error-general-pin".date("Ymd").".log";
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

    $rest['Code'] = $httpcode;
    $rest['data'] = json_decode($output);

    echo json_encode($rest);

    // close curl resource to free up system resources
    curl_close($ch);

    function sendEmailReport($pinErrorsToReport, $to, $emailConf)
    {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        $subject = 'PIN ERROR REPORTING';
        $mensaje   = 'Se han reportado más de '. $pinErrorsToReport. ' errores.';

        $mail = new PHPMailer(true);
        // Settings
        $mail->IsSMTP();
        $mail->CharSet = 'UTF-8';

        $mail->Host       = $emailConf['Host'];         // SMTP server example
        $mail->SMTPDebug  = $emailConf['SMTPDebug'];    // enables SMTP debug information (for testing)
        $mail->SMTPAuth   = $emailConf['SMTPAuth'];     // enable SMTP authentication
        $mail->Port       = $emailConf['Port'];         // set the SMTP port for the GMAIL server
        $mail->Username   = $emailConf['Username'];     // SMTP account username example
        $mail->Password   = $emailConf['Password'];     // SMTP account password example
        $mail->setFrom('reports@cemcolombia.co', 'Reports');
        $mail->addAddress($to);

        // Content
        // $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = $mensaje;

        $mail->send();

        echo "Mail Send";
    }

 ?>
