<?php
function connect(): mysqli {
    $db_benutzer = 'Robot';
    $db_passwort = 'Password';
    $db_name = 'mintze_db';
    $db_server = 'localhost';
    $conn = new mysqli($db_server, $db_benutzer, $db_passwort, $db_name);
    if ($conn->connect_errno) {
        throwError("Server cant connect to Database: " . $conn->connect_error, 501, "Der Server hat interne Probleme (Datenbank)");
        die("Verbindung fehlgeschlagen: " . $conn->connect_error);
    }
    return $conn;
}

function getAdminKey() {
    return "bhjwgefoqeijd_849_thuvgku_98g3rtkgjthBEJHGVREG";
}

function dateString($str) {
    $date = date_parse($str);
    return $date["year"] . "-" . $date["month"] . "-" . $date["day"];
}

function randomString($length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function protect($string): string {
    $notAllowed = array('"', '<', '>', "'", '\\');
    return str_replace($notAllowed, '', $string);
}

function throwError($error, $errorCode, $message): string {
    $elem = json_encode(["Error"=>$error, "Code"=>$errorCode, "Message"=>$message]);
    echo $elem;
    return $elem;
}

function getEndpoint(): string {
    return "http://localhost:5500/";
}

function getApiEndpoint(): string {
    return "http://localhost:5500/api/";
}

function isEmpty($res): bool {
    return $res->num_rows === 0;
}

function createUser($passwort, $nachname, $vorname, $klasse, $geburtsdatum, $key) {
    $conn = connect();
    if ($key == getAdminKey()) {
        $username = strtolower($vorname . "." . $nachname . "." . dateString($geburtsdatum));
        $sql = "INSERT INTO `User` (`UserName`, `Vorname`, `Nachname`, `Geburtsdatum`, `Klasse`, `LoginPassword`) VALUES ('$username', '$vorname', '$nachname', '$geburtsdatum', '$klasse', '$passwort')";
        $res = $conn->query($sql);
        if ($res) {
            throwError("Success", 200, "Hat funktioniert");
        } else {
            throwError("Wrong Userinput", 406, "Überdenke bitte deine Eingabe !");
        }
    } else {
        throwError("No permission", 410, "Sorry bro aber du darfst das nicht");
    }
}

?>