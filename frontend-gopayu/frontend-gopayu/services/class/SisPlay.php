<?php

class SisPlay {
     
    private $ports = array(
        'REGISTRATION'      => '31001',
        'AUTHENTICATION'    => '31002',
        'LIMITS'            => '31003',
        'PROFILE'           => '31004',
        'EXCLUSION'         => '31005',
        'TRANSACTIONS'      => '31006',
        'RECOVERY'          => '31007',
        'PAYMENT'           => '31008',
        'RESOURCES'         => '31009',
        'KAMBI'             => '31011',
        'GAMES'             => '31012',
        'DEPOSITS'          => '31013',
        'ORCHESTATOR'       => '31183',
        'POKER'             => '31185'
    ); 

    function __construct(){

    }

    public function getPort($urlFragment)
    {
        switch ($urlFragment) {
            case (preg_match('/balance/', $urlFragment) > 0 || preg_match('/bonuses/', $urlFragment) > 0 || preg_match('/transactions/', $urlFragment) > 0):
                $port = $this->ports['TRANSACTIONS'];
                break;
            case (preg_match('/withdrawalresourses/', $urlFragment) > 0 || preg_match('/transferwithdrawal/', $urlFragment) > 0 || preg_match('/validretention/', $_GET['url']) > 0):
                $port = $this->ports['PAYMENT'];
                break;
            case (preg_match('/esa/', $urlFragment) > 0):
                $port = $this->ports['POKER'];
                break;
            case (preg_match('/deposits/', $urlFragment) > 0):
                $port = $this->ports['DEPOSITS'];
                break;
            case (preg_match('/password/',$urlFragment) > 0):
                $port = $this->ports['RECOVERY'];
                break;
            case (preg_match('/game-launch-url\/[A-Za-z]*/i', $urlFragment) > 0):
                $port = $this->ports['GAMES'];
                break;
            case (preg_match('/game-launch-url/', $urlFragment) > 0):
                $port = $this->ports['ORCHESTATOR'];
                break;
            case (preg_match('/accounts/', $urlFragment) > 0 && preg_match('/sessions/', $urlFragment) == 0 && preg_match('/accounts\/me/', $urlFragment) == 0):
                $port = $this->ports['REGISTRATION'];
                break;
            case (preg_match('/accept-terms/',$urlFragment) > 0):
                $port = $this->ports['AUTHENTICATION'];
                break;
            case (preg_match('/profile/',$urlFragment) > 0  || preg_match('/terms/',$urlFragment) > 0 || preg_match('/documents/',$urlFragment) > 0):
                $port = $this->ports['PROFILE'];
                break;
            case (preg_match('/kambi/',$urlFragment) > 0):
                $port = $this->ports['KAMBI'];
                break;
            case (preg_match('/auto-limits/',$urlFragment) > 0 || preg_match('/session-limits/',$urlFragment) > 0):
                $port = $this->ports['LIMITS'];
                break;
            case (preg_match('/self-exclusions/',$urlFragment) > 0):
                $port = $this->ports['EXCLUSION'];
                break;
            case (preg_match('/accounts\/me/', $urlFragment) > 0 || preg_match('/sessions/',$urlFragment) > 0):
                $port = $this->ports['AUTHENTICATION'];
                break;
            default:
                echo var_dump((preg_match('/profile/',$urlFragment) > 0));
                $port = 0;
                break;
        }

        return $port;
    }

}

?>