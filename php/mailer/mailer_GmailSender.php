<?php
use PHPMailer\PHPMailer;

function GMSend($subject, $message)
{
	$mail = new PHPMailer\PHPMailer();
	$mail->IsSMTP();
	$mail->IsHTML(true);
	$mail->SMTPDebug = 0;
	$mail->SMTPAuth = true;
	$mail->SMTPSecure = 'tls';
	$mail->Host = 'smtp.yandex.ru';
	$mail->Port = 587; 
	$mail->Username = 'usbaniinformer@yandex.ru';  
	$mail->Password = 'rfk7nrfDjLdjhbr';
	$mail->CharSet = 'UTF-8';
	$mail->setFrom('usbaniinformer@yandex.ru', 'Usbani');
	$mail->AddAddress('dmsh80594@gmail.com');
	$mail->Subject = $subject;
	$mail->Body = $message;
	//die($message);
	if(!$mail->Send())
	{
		echo 'Mail error: '.$mail->ErrorInfo; 
		die;
	}
	echo 'OK';
}