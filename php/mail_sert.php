<?php
 require_once('class.phpmailer.php');

 $mail = new PHPMailer();

 $title = $_POST['title'];
 $name = $_POST['name'];
 $phone = preg_replace('/[^0-9]+/', '', $_POST['phone']);
 $cost = $_POST['cost'];

 $mail->Body = 'Имя: ' . $name . '<br>';
 $mail->Body .= 'Телефон: ' . $phone . '<br>';
 $mail->Body .= 'Номинал сертификата: ' . $cost . '<br>';

 $mail->Subject = "Усачевские бани";

 $mail->IsHTML(true);
 $mail->CharSet = "UTF-8";
 $mail->ContentType = "text/html";
 $mail->From = "no-replay";
 $mail->FromName = $title;
 $mail->AddAddress('info@usbani.ru');

 if(!$mail->Send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
  } else {
    echo "Message sent!";
  }

?>