<?php 
include "util.php";
include "../get/passwordHash.php";


$userPassword = randomString(6);
$userNachname = protect($_POST["Nachname"]);
$userVorname = protect($_POST["Vorname"]);
$userKlasse = protect($_POST["Klasse"]);
$userGeburtsdatum = protect($_POST["Geburtsdatum"]);
$key = protect($_POST["key"]);
createUser($userPassword, $userNachname, $userVorname, $userKlasse, $userGeburtsdatum, $key);
?>
