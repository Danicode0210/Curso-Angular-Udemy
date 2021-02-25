<?php 
	// header('Access-Control-Allow-Origin: http://localhost:4200');
    header("Access-Control-Allow-Headers: Content-Type, secretkey ");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    date_default_timezone_set('America/Bogota');
	// die('{ "ok":true }');
    error_reporting(E_ALL);
	ini_set('display_errors', 1);
	ini_set('post_max_size', '10M');

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        return false;
    }

	//Define base_url
	$baseUrl = isset($_SERVER['ONL_MAYOR_URL']) ? $_SERVER['ONL_MAYOR_URL'] : 'https://192.168.1.107:3000';
	$secretKey = isset($_SERVER['ONL_SECRET_KEY_MAYOR']) ? $_SERVER['ONL_SECRET_KEY_MAYOR'] : 'testFR';

	if(isset($_GET['url']))
	{		
		$uri = $baseUrl . $_GET['url'];
		
		// create curl resource 
		$ch = curl_init();

		//Call
		if ($_SERVER['REQUEST_METHOD'] == 'POST') 
		{	
			$uri = str_replace('fnt/', '', $uri);
			$json_str = file_get_contents('php://input');

			$type = 'RES';

			if(isset($_POST['type']) && ($_POST['type'] == 'C.C' || $_POST['type'] == 1 ||  $_POST['type'] == 'ID'))
			{
				$type = 'ID';
			}
			else 
			{
				$type = 'RES';
			}

	    	if(isset($_FILES['foto']))
	    	{	
	    		$fileName = uniqid().'.jpg';
	    		$filePath = '/home/tmp/'.$fileName;

			    $json_str = array(
			    	'docNumber' => $_POST['docNumber'],
			    	'type' => $type,
			    	'profesion' => $_POST['profesion'],
			    	'peps' => $_POST['peps'],
			    	'procedinero' => $_POST['procedinero'],
			    	'fotocoCC' => '',
			    );

			    createThumbnail($_FILES['foto']['tmp_name'],800,800,$filePath);

			    compressImage($filePath, $filePath, 60);

			    $img1 = file_get_contents($filePath); 

				// Encode the image string data into base64 
				$fileName = uniqid().'.jpg';
	    		$filePath2 = '/home/tmp/'.$fileName;

			    $json_str = array(
			    	'docNumber' => $_POST['docNumber'],
			    	'type' => $type,
			    	'profesion' => $_POST['profesion'],
			    	'peps' => $_POST['peps'],
			    	'procedinero' => $_POST['procedinero'],
			    	'fotocoCC' => '',
			    );

			    createThumbnail($_FILES['foto2']['tmp_name'],800,800,$filePath2);

			    compressImage($filePath2, $filePath2, 60);

			    $img2 = file_get_contents($filePath2); 
			    $fileName3 = uniqid().'.jpg';
		    	$filePath3 = '/home/tmp/'.$fileName3;

		    	// ==============================
		    	// Merge Images
		    	// ==============================
				
				$top_file = $filePath;
				$bottom_file = $filePath2;

				$top = imagecreatefromjpeg($top_file);
				$bottom = imagecreatefromjpeg($bottom_file);

				// get current width/height
				list($top_width, $top_height) = getimagesize($top_file);
				list($bottom_width, $bottom_height) = getimagesize($bottom_file);

				// compute new width/height
				$new_width = ($top_width > $bottom_width) ? $top_width : $bottom_width;
				$new_height = $top_height + $bottom_height;

				// create new image and merge
				$new = @imagecreatetruecolor($new_width, $new_height);
				imagecopy($new, $top, 0, 0, 0, 0, $top_width, $top_height);
				imagecopy($new, $bottom, 0, $top_height+1, 0, 0, $bottom_width, $bottom_height);

				imagejpeg($new, $filePath3);

				// ==============================
		    	// END Merge Images
		    	// ==============================

				$img3 = file_get_contents($filePath3); 
				$img64 = str_replace('data:image/jpeg;base64,', '', base64_encode($img3)); 
				$json_str['fotocoCC'] = $img64;

	    	}
	    	else 
	    	{
				$json_str = json_decode($json_str);
	    	}

	    	//echo var_dump($json_str);
	    	//die();
		    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($json_str));
		}

		//http_response_code(200);
		//die();

		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'secretKey: ' . $secretKey
        ));


		//Tell cURL that it should only spend 10 seconds
		//trying to connect to the URL in question.
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
		
		//A given cURL operation should only take
		//15 seconds max.
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		
		// set url 
		curl_setopt($ch, CURLOPT_URL, $uri);
		
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
		
		//return the transfer as a string 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		
		// $output contains the output string 
		$output = curl_exec($ch);

		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		
		http_response_code($httpcode);

		echo $output;

		// close curl resource to free up system resources 
		curl_close($ch);

		if(isset($filePath) && file_exists($filePath))
		{
			unlink($filePath);
		}

		if(isset($filePath2) && file_exists($filePath2))
		{
			unlink($filePath2);
		}

		if(isset($filePath3) && file_exists($filePath3))
		{
			unlink($filePath3);
		}

	}
	else 
	{
		http_response_code(404);
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

	
 ?>