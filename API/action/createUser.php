<?php 
include "../util.php";
include "../get/passwordHash.php";


$userPassword = randomString(6);
$userNachname = protect($_GET["Nachname"]);
$userVorname = protect($_GET["Vorname"]);
$userKlasse = protect($_GET["Klasse"]);
$userGeburtsdatum = protect($_GET["Geburtsdatum"]);
$key = protect($_GET["key"]);
createUser($userPassword, $userNachname, $userVorname, $userKlasse, $userGeburtsdatum, $key);