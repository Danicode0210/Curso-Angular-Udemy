<?php

    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);

    // header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, Device, x-custom-version, x-custom-times, x-custom-header, X-Sisplay-Header");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Content-Type: application/json');

    date_default_timezone_set('America/Bogota');

    require('./class/SisPlay.php');
    require('./class/CurlRequest.php');

    if(isset($_GET['timer']))
    {
        echo time();
        die();
    }

    if($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
    {
        http_response_code(200);
        die();
    }

    // if(isset($_GET['url']) && strpos($_GET['url'], '/transactions'))
    // {
    //     http_response_code(422);
    //     die();
    // }

    $ambiente = isset($_SERVER['ONL_ACTIVE_ENVIROMENTS']) ? $_SERVER['ONL_ACTIVE_ENVIROMENTS'] : 1; // 1 Ambos - 2 Sisplay - 3 Franco
    $registration = isset($_SERVER['ONL_REGISTRATION_ENVIROMENT']) ? $_SERVER['ONL_REGISTRATION_ENVIROMENT'] : 1; // 1 Sisplay - 2 Rfranco
    $validateLocation = true;                     // Flag to validate the location
    $androidVersion = 'v1.0.19';                     //Android app current version
    $androidNextVersion = 'v1.0.20';                 //Android app current version
    $iosCurrentVersion     = 'v1.0.11';                     // IOS app current version
    $iosNextVersion     = 'v1.0.12';                     // IOS app current version
    $webVersion     = '3.0.17';                     // Web current version
    $timeRequest    = date('Y-m-d H:i:s',time());   // Current time
    $baseUrl        = isset($_SERVER['ONL_API_URL']) ? $_SERVER['ONL_API_URL'] :'https://apipas.betplay.com.co/OperatorWebsiteAPI/v1/'; //URL PAS
    $sisplayURL     = isset($_SERVER['SIS_API_URL']) ? $_SERVER['SIS_API_URL'] :'https://172.27.196.44:'; //URL PAS
    $logVersion     = isset($_SERVER['HTTP_DEVICE']) ? $_SERVER['HTTP_DEVICE'] : $_SERVER['HTTP_X_CUSTOM_VERSION']; //Version depending from the device;
    $_SERVER['HTTP_CF_IPCOUNTRY'] = 'CO'; // Disable country roule
    $logsFolder     = isset($_SERVER['ONL_FOLDER_LOGS']) ? $_SERVER['ONL_FOLDER_LOGS'] :'/home/logs'; //URL PAS

    if(isset($_SERVER['HTTP_DEVICE']))
    {
        $devArray = explode('-', $_SERVER['HTTP_DEVICE']);

        if(count($devArray) == 2)
        {
            if(preg_match("/android/", $_SERVER['HTTP_DEVICE']))
            {
                $deviceVersion = $androidVersion;
                $deviceNextVersion = $androidNextVersion;
            }
            else if(preg_match("/ios/", $_SERVER['HTTP_DEVICE']))
            {
                $deviceVersion = $iosCurrentVersion;
                $deviceNextVersion = $iosNextVersion;
            }
        }

        if(isset($deviceVersion) && ($devArray[1] != $deviceVersion && $devArray[1] != $deviceNextVersion))
        {
            if(!(preg_match("/ios/", $_SERVER['HTTP_DEVICE']) && validateIOS()))
            {
                http_response_code(306);
                die();
            }
        }

        if(($_SERVER['HTTP_CF_IPCOUNTRY'] != 'CO' && $validateLocation) && !(preg_match("/ios/", $_SERVER['HTTP_DEVICE']) && validateIOS()))
        {
            geoLocalValidation();
        }
    }
    else
    {
        if(($_SERVER['HTTP_CF_IPCOUNTRY'] != 'CO' && $validateLocation))
        {
            geoLocalValidation();
        }
        if($_SERVER['HTTP_X_CUSTOM_VERSION']==null || $_SERVER['HTTP_X_CUSTOM_VERSION']== '' || $_SERVER['HTTP_X_CUSTOM_VERSION']!= $webVersion){
            http_response_code(505);
            die('No access');
        }
    }

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        return false;
    }

    if($_GET['url'] != '/v1/transferwithdrawal')
    {
        # Get JSON as a string
        $json_str = file_get_contents('php://input');
    }
    else
    {
        $json_str = array(
            'accountNumber' => $_POST['accountNumber'],
            'bankCode' => $_POST['bankCode'],
            'amount' => $_POST['amount'],
            'accountType' => $_POST['accountType'],
            'paymentMethod' => $_POST['paymentMethod'],
            'externalUID' => $_POST['externalUID'],
            'valorRetencion' => $_POST['valorRetencion'],
            'valoraRetirar' => $_POST['valoraRetirar']
        );

        if(isset($_FILES['foto']))
        {
            $fileName = uniqid().'.jpg';
            $filePath = '/home/tmp/'.$fileName;

            createThumbnail($_FILES['foto']['tmp_name'],800,800,$filePath);

            compressImage($filePath, $filePath, 60);

            $img1 = file_get_contents($filePath);

            $img64 = str_replace('data:image/jpeg;base64,', '', base64_encode($img1));

            unlink($filePath);

            $json_str['formulario'] = $img64;

            $json_str = json_encode($json_str);
        }
        else
        {
            $json_str = json_encode($json_str);
        }
    }

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

    $md   = md5(time() . mt_rand(1, 1000000));
    $uuid = $md . uniqid();
    $curl = CurlRequest::getInstance();
    $sisplay = new SisPlay();
    $logPath    = $logsFolder.'/general-operator' . date("Ymd") . ".log";
    $urlLog = explode('/', $_GET['url']);
    $lastUrl = $urlLog[count($urlLog)-1];

    if(isset($_SERVER['HTTP_REFERER']))
    {
      if(preg_match('/tienda/', $_SERVER['HTTP_REFERER']))
      {
        $logVersion = 'T'.$logVersion;
      }
      else
      {
        $logVersion = 'W'.$logVersion;
      }
    }

    if($_GET['url'])
    {
        if(strpos($_GET['url'], 'accounts/sessions'))
        {
            $headers = array(
                'Accept: application/json',
                'Content-Type: application/json',
                'X-Forwarded-For: ' . $strxforwarded,
                'X-Request-Id: ' . $uuid
            );

            if($ambiente == 1 || $ambiente == 2)
            {
                // Sysplay url
                $uri = $sisplayURL . $sisplay->getPort($_GET['url']) .  $_GET['url'];
                $isSisplay = true;

                // Validate sisplay's player
                $response = $curl->request($uri, $json_str, 'POST', $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);
            }
            else
            {
                $response['code'] = '404';
            }

            if($response['code'] == '404' && ($ambiente == 1 || $ambiente == 3))
            {
                // Try to login with franco
                $uri = $baseUrl . $_GET['url'];
                $uri = str_replace('v1//', 'v1/', $uri);
                $isSisplay = false;

                $response = $curl->request($uri, $json_str, 'POST', $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);

                if($response['code'] == 200)
                {
                    $data = new stdClass();

                    $data->session = json_decode($response['response']);

                    $uri = $baseUrl .  '/accounts/me/profile';
                    $isSisplay = false;

                    $headers[] = 'Authorization:' . $data->session->accessToken;

                    $profile = $curl->request($uri, '', 'GET', $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);

                    if($profile['code'] == 200)
                    {
                        $data->profile = json_decode($profile['response']);

                        $response['response'] = json_encode($data);

                        $uri = $baseUrl .  '/accounts/me/balance';

                        $isSisplay = false;

                        $headers[] = 'Authorization:' . $data->session->accessToken;

                        $balance = $curl->request($uri, '', 'GET', $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);

                        if($balance['code'] == 200)
                        {
                            $data->balance = json_decode($balance['response']);

                            $response['response'] = json_encode($data);
                        }
                        else
                        {
                            $response['code'] = 422;
                            $response['response'] = json_encode(array('message' => 'Error al recuperar el balance'));
                        }

                        $curl->closeSession();
                    }
                    {
                        $response['code'] = 422;
                        $response['response'] = json_encode(array('message' => 'Error al recuperar el profile'));
                    }
                }
            }
            else
            {
                if($response['code'] == 200)
                {
                    $response['code'] = 203;

                    $data = new stdClass();

                    $data->session = json_decode($response['response']);

                    $uri = $sisplayURL . $sisplay->getPort('accounts/me/profile') .  '/accounts/me/profile';
                    $isSisplay = true;

                    $headers[] = 'Authorization:' . $data->session->accessToken;

                    $profile = $curl->request($uri, '', 'GET', $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);

                    if($profile['code'] == 200)
                    {
                        $data->profile = json_decode($profile['response']);

                        $response['response'] = json_encode($data);

                        $uri = $sisplayURL . $sisplay->getPort('accounts/me/balance') .  '/accounts/me/balance';
                        $isSisplay = true;

                        $headers[] = 'Authorization:' . $data->session->accessToken;

                        $balance = $curl->request($uri, '', 'GET', $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);

                        if($balance['code'] == 200)
                        {
                            $data->balance = json_decode($balance['response']);

                            $response['response'] = json_encode($data);
                        }
                        else
                        {
                            $response['code'] = 401;
                        }

                        $curl->closeSession();
                    }
                    else
                    {
                        $response['code'] = 401;
                    }
                }
                else if($response['code'] == 202)
                {
                    $customResponse = json_decode($response['response']);
                    $customResponse->isSisplay = true;

                    $response['response'] = json_encode($customResponse);
                }
                else if($ambiente == 2 && $response['code'] != 403)
                {
                    $response['code'] = 401;
                }
            }

            http_response_code($response['code']);

            echo $response['response'];
        }
        else if(strpos($_GET['url'], 'forgotten-password-email'))
        {
            if($ambiente == 1 || $ambiente == 2)
            {
                // Sysplay url
                $uri = $sisplayURL . $sisplay->getPort($_GET['url']) .  $_GET['url'];
                $isSisplay = true;

                $headers = array(
                    'Accept: application/json',
                    'Content-Type: application/json',
                    'X-Forwarded-For: ' . $strxforwarded,
                    'X-Request-Id: ' . $uuid
                );

                $response = $curl->request($uri, "{}", $_SERVER['REQUEST_METHOD'], $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);

                $curl->closeSession();

                if($response['code'] == 200)
                {
                    http_response_code($response['code']);
                    echo $response['response'];
                    return true;
                }
            }

            $uri = $baseUrl .  $_GET['url'];
            $isSisplay = false;

            $response = $curl->request($uri, "{}", $_SERVER['REQUEST_METHOD'], $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);

            $curl->closeSession();

            http_response_code($response['code']);
            echo $response['response'];
        }
        else if($_GET['url'] == '/accounts' && ($ambiente == 1 || $ambiente == 2) && $registration == 1)
        {
            $headers = array(
                'Accept: application/json',
                'Content-Type: application/json',
                'X-Forwarded-For: ' . $strxforwarded,
                'X-Request-Id: ' . $uuid
            );

            // Sysplay url
            $uri = $sisplayURL . $sisplay->getPort($_GET['url']) .  $_GET['url'];
            $isSisplay = true;

            // Validate sisplay's player
            $response = $curl->request($uri, $json_str, 'POST', $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);

            $curl->closeSession();

            http_response_code($response['code']);

            echo $response['response'];

        }
        else
        {
            if(($ambiente == 1 || $ambiente == 2) && isset($_SERVER['HTTP_X_SISPLAY_HEADER']) && $_SERVER['HTTP_X_SISPLAY_HEADER'] == 'true')
            {
                if(preg_match('/game-launch-url/', $_GET['url']) > 0)
                {
                    $body = json_decode($json_str);

                    if($body->integrationChannelCode == 'KAMBI')
                    {
                        $_GET['url'] = str_replace('/accounts/me/game-launch-url', '/games/kambi/authenticate-wallet', $_GET['url']);
                    }
                    else if($body->integrationChannelCode == 'Patagonia')
                    {
                        $_GET['url'] = str_replace('/accounts/me/game-launch-url', '/accounts/game-launch-url/'.$body->gameCode, $_GET['url']);
                        $_SERVER['REQUEST_METHOD'] = 'GET';
                    }
                }

                $uri = $sisplayURL . $sisplay->getPort($_GET['url']) .  $_GET['url'];
                $isSisplay = true;

                if(preg_match('/transactions/', $_GET['url']) > 0)
                {
                	$_SERVER['REQUEST_URI'] = str_replace($_GET['startDateTime'], date('Y-m-d', strtotime($_GET['startDateTime'])), $_SERVER['REQUEST_URI']);
                	$_SERVER['REQUEST_URI'] = str_replace($_GET['endDateTime'], date('Y-m-d', strtotime($_GET['endDateTime'])), $_SERVER['REQUEST_URI']);
                }

                if (preg_match('/withdrawalresourses/', $_GET['url']) > 0 || preg_match('/transferwithdrawal/', $_GET['url']) > 0 || preg_match('/validretention/', $_GET['url']) > 0)
                {
                    $uri = str_replace('https', 'http', $uri);
                    // die($uri);
                }

            }
            else
            {
                $uri = $baseUrl .  $_GET['url'];
                $uri = str_replace('v1//', 'v1/', $uri);
                $isSisplay = false;
            }

            $uriExp = explode('?', str_replace('/services/operatorEndPoint.php?', '', $_SERVER['REQUEST_URI']));
            if (count($uriExp) > 1) {
                $uriExp = str_replace($_GET['url'], '', $uriExp);
                $uriExp = str_replace('url=', '', $uriExp);
                $uri = $uri . '?' . $uriExp[1];
            }

            $headers = array(
                'Accept: application/json',
                'Content-Type: application/json',
                'X-Forwarded-For: ' . $strxforwarded,
                'X-Request-Id: ' . $uuid
            );

            if (isset($_SERVER['HTTP_AUTHORIZATION']))
            {
                $headers[] = 'Authorization:' . $_SERVER['HTTP_AUTHORIZATION'];
            }

            if($_GET['url'] == '/accounts')
            {
                $registrationData = json_decode($json_str);

                $documentTypes = array( '3' => 'ID' , '4' => 'RES');
                $registrationData->personTitle = "MR";
                $registrationData->currency = "COP";
                $registrationData->language = "SPA";
                $registrationData->securityQuestion = "N/A";
                $registrationData->documentType = $documentTypes[$registrationData->documentType];


                $json_str = json_encode($registrationData);
            }

            $response = $curl->request($uri, $json_str, $_SERVER['REQUEST_METHOD'], $headers, $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay);

            http_response_code($response['code']);

            echo $response['response'];

        }

        return true;
    }
    else
    {
        die("No Access");
    }


    if($json_obj)
    {
        $json_obj->requestIp = $_SERVER['REMOTE_ADDR'];
    }

    $tmpTracer = $logsFolder.'/tmp'.uniqid().'.log';

    $tracerPath = $logsFolder.'/complete-logs-operator'.date('ymd').'.log';

    ini_set('track_errors', 1);

    $verbose = fopen($tmpTracer, 'w+');

    curl_setopt($ch, CURLOPT_STDERR, $verbose);

    // $output contains the output string
    $output = curl_exec($ch);

    rewind($verbose);

    $verboseLog = stream_get_contents($verbose);

    // if(curl_getinfo($ch, CURLINFO_HTTP_CODE) == 0)
    // {
    //     $completeLog .= date('Y-m-d H:i:s')."|";
    //     $completeLog .= $uuid."|";
    //     file_put_contents($tracerPath, preg_replace("/\r|\n/", "", $completeLog.$verboseLog)."\n", FILE_APPEND);
    // }

    unlink($tmpTracer);

    /**
    *
    *   New Logs
    *
    */

    $reqData = json_decode(file_get_contents('php://input'));

    if(isset($reqData->password))
    {
      $reqData->password = '';
    }

    if(isset($reqData->accessToken))
    {
      $reqData->accessToken = '';
    }

    $RFRest = json_decode($output);

    if($RFRest)
    {
      if(isset($RFRest->accessToken))
      {
        $RFRest->accessToken = '';
      }
    }

    function geoLocalValidation()
    {
        try {
            $ip = $_SERVER['REMOTE_ADDR'];
            $geourl = "http://api.ipstack.com/".$_SERVER['REMOTE_ADDR']."?access_key=92cd9147e64fc9c5ce16e36dc5abd7b6";
            $ip_data = file_get_contents($geourl);
            $ip_data = json_decode($ip_data);

            $country_code = $ip_data->country_code;

            if($country_code !== 'CO')
            {
                throw new Exception("Error Processing Request", 1);
            }
        } catch (Exception $e) {
            http_response_code(418);
            die();
        }
    }

    function validateIOS()
    {
        // Accounts blank list
        $list = array(
            'marlenytest',
            'carlosamora'
        );

        # Get JSON as a string
        $json_str = file_get_contents('php://input');
        # Get as an object
        $json_obj = json_decode($json_str);
        # Variable to save userName
        $userName = '';
        $isKambi = false;

        if($json_obj)
        {
            if(isset($json_obj->userName))
            {
                $userName = $json_obj->userName;
            }

            if(isset($json_obj->integrationChannelCode))
            {
                $isKambi = true;
            }
        }
        else
        {
            # Validate custom field header
            if(isset($_SERVER['HTTP_X_CUSTOM_HEADER']))
            {
                $userName = isset($_SERVER['HTTP_X_CUSTOM_HEADER']);
            }
        }

        return (in_array($userName, $list) || $isKambi);
    }

    function createThumbnail($path,$newWidth,$newHeight,$moveToDir)
	{
	    $mime = getimagesize($path);

	    if($mime['mime']=='image/png'){ $src_img = imagecreatefrompng($path); }
	    if($mime['mime']=='image/jpg'){ $src_img = imagecreatefromjpeg($path); }
	    if($mime['mime']=='image/jpeg'){ $src_img = imagecreatefromjpeg($path); }
	    if($mime['mime']=='image/pjpeg'){ $src_img = imagecreatefromjpeg($path); }

	    $old_x = imageSX($src_img);
	    $old_y = imageSY($src_img);

	    if($old_x > $old_y)
	    {
	        $thumb_w    =   $newWidth;
	        $thumb_h    =   $old_y/$old_x*$newWidth;
	    }

	    if($old_x < $old_y)
	    {
	        $thumb_w    =   $old_x/$old_y*$newHeight;
	        $thumb_h    =   $newHeight;
	    }

	    if($old_x == $old_y)
	    {
	        $thumb_w    =   $newWidth;
	        $thumb_h    =   $newHeight;
	    }

	    $dst_img        =   ImageCreateTrueColor($thumb_w,$thumb_h);

	    imagecopyresampled($dst_img,$src_img,0,0,0,0,$thumb_w,$thumb_h,$old_x,$old_y);


	    // New save location
	    $new_thumb_loc = $moveToDir ;

	    if($mime['mime']=='image/png'){ $result = imagepng($dst_img,$new_thumb_loc,8); }
	    if($mime['mime']=='image/jpg'){ $result = imagejpeg($dst_img,$new_thumb_loc,80); }
	    if($mime['mime']=='image/jpeg'){ $result = imagejpeg($dst_img,$new_thumb_loc,80); }
	    if($mime['mime']=='image/pjpeg'){ $result = imagejpeg($dst_img,$new_thumb_loc,80); }

	    imagedestroy($dst_img);
	    imagedestroy($src_img);
	    return $result;
    }

    function compressImage($source, $destination, $quality) {

        $info = getimagesize($source);

        if ($info['mime'] == 'image/jpeg')
          $image = imagecreatefromjpeg($source);

        elseif ($info['mime'] == 'image/gif')
          $image = imagecreatefromgif($source);

        elseif ($info['mime'] == 'image/png')
          $image = imagecreatefrompng($source);

        imagejpeg($image, $destination, $quality);

      }
?>
