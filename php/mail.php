<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require 'mailer/mailer_SMTP.php';
require 'mailer/mailer_Exception.php';
require 'mailer/mailer_PHPMailer.php';
use PHPMailer\PHPMailer;

if (empty($_POST['name']) || empty($_POST['phone']) || empty($_POST['date']) || empty($_POST['place']))
	exit('Не хватает параметров');

require 'gm.php';

$name = $_POST['name'];
$phone = preg_replace('/[^0-9]+/', '', $_POST['phone']);
$place = $_POST['place'];
$date = $_POST['date'];

$name  = empty($_POST['name'])  ? '' : $_POST['name'];
$phone = empty($_POST['phone']) ? '' : preg_replace('/[^0-9]+/', '', $_POST['phone']);
$place = empty($_POST['place']) ? '' : $_POST['place'];
$date  = empty($_POST['date'])  ? '' : $_POST['date'];


$IsBeautyshop = $_POST['title'] == 'Заказать услугу';
$TypeOrPlace = '<p>'.($IsBeautyshop ? 'Услуга салона красоты' : 'Тип кабинки').": $place</p>";

$message = "
<p>Имя: $name</p>
<p>Номер телефона: $phone</p>
$TypeOrPlace";

if (!$IsBeautyshop)
	$message .= "\n<p>Желаемая дата: $date</p>";

GMSend('Обратная связь - Usbani', $message);