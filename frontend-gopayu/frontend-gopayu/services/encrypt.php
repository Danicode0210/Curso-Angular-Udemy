<?php
include 'sebp.php';
$rta = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if( $_POST["desc"] == '0' ){
        $rta = SEBP::encryption($_POST["id"]);    
    }else{
        $rta = SEBP::decryption($_POST["id"]);
    }
} else {
    $rta = '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
        <input type="text" name="id" placeholder="Ej. Paso" require />
        <select name="desc" id="desc">
            <option value="0">Encriptar</option>
            <option value="1">Desencriptar</option>
        </select>
        <input type="submit" name="submit" />
    </form> 
    <?php
        echo "<h2>Tu respuesta:</h2>";
        echo $rta;
    ?>
</body>
</html>