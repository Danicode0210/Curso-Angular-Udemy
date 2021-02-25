<?php
    define('METHOD','AES-256-CBC');
    define('SECRET_KEY','83TPL4Y@CEM');
    define('SECRET_IV','1550863950');

    class SEBP {
        public static function encryption($string){
            $output= false;
            $key = hash('sha256', SECRET_KEY);
            $iv = substr(hash('sha256', SECRET_IV), 0, 16);
            $output = openssl_encrypt($string, METHOD, $key, 0, $iv);
            $output = base64_encode($output);
            return $output;
        }

        public static function decryption($string){
            $key = hash('sha256', SECRET_KEY);
            $iv = substr(hash('sha256', SECRET_IV), 0, 16);
            $output = openssl_decrypt(base64_decode($string), METHOD, $key, 0, $iv);
            return $output;
        }

    }

?>