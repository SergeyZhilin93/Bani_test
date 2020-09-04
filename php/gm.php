<?php
use PHPMailer\PHPMailer;

function GMSend($subject, $message)
{
	$mail = new PHPMailer\PHPMailer();
	$mail->IsSMTP();
	$mail->IsHTML(true);
	$mail->SMTPDebug = 0;
	$mail->SMTPAuth = true;
	$mail->SMTPSecure = 'ssl';
	$mail->Host = 'smtp.gmail.com';
	$mail->Port = 465;
	$mail->Username = 'usbaniinformer@gmail.com';
	$mail->Password = '123qweQWE!';
	$mail->CharSet = 'UTF-8';
	$mail->setFrom('usbaniinformer@gmail.com', 'Usbani');
	$mail->AddAddress('info@usbani.ru');
	$mail->Subject = $subject;
	$mail->Body = $message;
	if(!$mail->Send())
	{
		$error = 'Mail error: '.$mail->ErrorInfo;
		var_dump($error);
		return $error;
	}
}