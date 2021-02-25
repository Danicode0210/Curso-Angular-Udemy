<?php

class CurlRequest {
    
    private $logsFolder = '';
    private $ch = '';
    private static $instance;

    // ===============
    // Constructor
    // ===============
    function __construct(){
        $this->logsFolder = isset($_SERVER['ONL_FOLDER_LOGS']) ? $_SERVER['ONL_FOLDER_LOGS'] :'/home/logs';
    }

    public static function getInstance()
    {
        if (!isset(static::$instance)) {
            static::$instance = new static;
        }

        return static::$instance;
    }

    public function request($url, $data = '', $requestMethod = 'GET', $headers = array(), $timeRequest, $uuid, $logVersion, $strxforwarded, $isSisplay = false, $apicrm = false)
    {   
        $urlLog = explode('/', $url);
        $lastUrl = $urlLog[count($urlLog)-1];

        // create curl resource
        if(!$this->getInstance()->ch)
        {
            $this->getInstance()->ch = curl_init();
        }

        if ($requestMethod == 'POST') {
            curl_setopt($this->getInstance()->ch, CURLOPT_POSTFIELDS, $data);
        }
    
        //Tell cURL that it should only spend 20 seconds
        //trying to connect to the URL in question.
        curl_setopt($this->getInstance()->ch, CURLOPT_CONNECTTIMEOUT, 20);
    
        //A given cURL operation should only take
        //20 seconds max.
        curl_setopt($this->getInstance()->ch, CURLOPT_TIMEOUT, 20);

        // No verify SSL
        curl_setopt($this->getInstance()->ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($this->getInstance()->ch, CURLOPT_SSL_VERIFYPEER, 0);

        // Set headers
        curl_setopt($this->getInstance()->ch, CURLOPT_HTTPHEADER, $headers);

        // Set url
        curl_setopt($this->getInstance()->ch, CURLOPT_URL, $url);
    
        curl_setopt($this->getInstance()->ch, CURLOPT_CUSTOMREQUEST, $requestMethod);
    
        //return the transfer as a string
        curl_setopt($this->getInstance()->ch, CURLOPT_RETURNTRANSFER, 1);
        
        curl_setopt($this->getInstance()->ch, CURLOPT_VERBOSE, true); // Complete trace
	
        $tmpTracer = $this->logsFolder.'/tmp'.uniqid().'.log';
        
        if($isSisplay)
        {
            $tracerPath = $this->logsFolder.'/sisplay-complete-logs-operator'.date('ymd').'.log';
        }
        else 
        {
            $tracerPath = $this->logsFolder.'/complete-logs-operator'.date('ymd').'.log';
        }
        
        ini_set('track_errors', 1);

        $verbose = fopen($tmpTracer, 'w+');

        curl_setopt($this->getInstance()->ch, CURLOPT_STDERR, $verbose);

        // $response contains the response string
        $response = curl_exec($this->getInstance()->ch);

        rewind($verbose);

        $verboseLog = stream_get_contents($verbose);

        $completeLog = date('Y-m-d H:i:s')."|";
        $completeLog .= $uuid."|";
    
        file_put_contents($tracerPath, preg_replace("/\r|\n/", "", $completeLog.$verboseLog)."\n", FILE_APPEND);
    
        unlink($tmpTracer);

        //Get http_response_code
        $httpcode = curl_getinfo($this->getInstance()->ch, CURLINFO_HTTP_CODE);
        
        if(!$apicrm)
        {
            $log  = "";
            $log .= $timeRequest . '|';
            $log .= curl_getinfo($this->getInstance()->ch, CURLINFO_HTTP_CODE) . '|';
            $log .= curl_getinfo($this->getInstance()->ch, CURLINFO_TOTAL_TIME) . '|';
            $log .= curl_getinfo($this->getInstance()->ch, CURLINFO_CONNECT_TIME) . '|';
            $log .= isset($_SERVER['HTTP_X_CUSTOM_TIMES']) ? $_SERVER['HTTP_X_CUSTOM_TIMES'] : '-';
            $log .= '|';
            $log .= $uuid . '|';
            $log .= isset($_SERVER['HTTP_X_CUSTOM_HEADER']) ? $_SERVER['HTTP_X_CUSTOM_HEADER'] : '-';
            $log .= '|';
            $log .= $_SERVER['REQUEST_METHOD'] . '|';
            $log .= $logVersion . '|';
            $log .= $lastUrl."\n";

            if($isSisplay)
            {
                $logPath = $this->logsFolder.'/sisplay-general-operator' . date("Ymd") . ".log";
            }
            else 
            {
                $logPath = $this->logsFolder.'/general-operator' . date("Ymd") . ".log";
            }

            file_put_contents($logPath, $log, FILE_APPEND);

            if (curl_errno($this->getInstance()->ch)) {
                $contentlog = '';
                echo curl_error($this->getInstance()->ch). ' -';
                $logfich    = $this->logsFolder.'/error-general-operator' . date("Ymd") . ".log";
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
                $interline  = curl_getinfo($this->getInstance()->ch, CURLINFO_EFFECTIVE_URL);
                $contentlog = $contentlog . $interline;
                $interline  = "|";
                $contentlog = $contentlog . $interline;
                $interline  = $_SERVER['REQUEST_METHOD'];
                $contentlog = $contentlog . $interline;
                $interline  = "|";
                $contentlog = $contentlog . $interline;
                $interline  = 'Curl error: ' . curl_error($this->getInstance()->ch);
                $contentlog = $contentlog . $interline;
                $interline  = "\n";
                $contentlog = $contentlog . $interline;
                $interline  = "|";
                $contentlog .= $interline;
                $contentlog .= $logVersion;
                if($_GET['url'] == '/accounts')
                {
                    $interline  = "|";
                    $contentlog .= $interline . file_get_contents('php://input');
                }
                file_put_contents($logfich, $contentlog, FILE_APPEND);
                http_response_code(406);
                curl_close($this->getInstance()->ch);
            }
        }

        return array('code' => $httpcode, 'response' => $response);
    }

    public function closeSession(){
        curl_close($this->getInstance()->ch);
    }
}

?>