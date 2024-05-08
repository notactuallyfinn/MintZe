<?php
include "../util.php";
include "passwordHash.php";

$kuerzel = protect($_GET["Kuerzel"]);
$authKey = protect($_GET["AuthKey"]);
# Zugangsdaten
$conn = connect();

if (verifyTeacherLogin($kuerzel, $authKey)) {
    $sqlRun = "SELECT * FROM Lehrer WHERE Kuerzel = '$kuerzel' AND AuthKey = '$authKey'";
    $res = $conn->query($sqlRun);
    foreach ($res as $item) {
        $item["Status"] = "200";
        $item["Message"] = "Success";
        $item["Passwort"] = "Hidden";
        echo json_encode($item);
    }
}
$conn->close();