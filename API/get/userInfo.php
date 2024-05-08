<?php
include "../util.php";
include "passwordHash.php";

$schuelerID = protect($_GET["SchuelerID"]);
$authKey = protect($_GET["AuthKey"]);
# Zugangsdaten
$conn = connect();

if (verifySchuelerLogin($schuelerID, $authKey)) {
    $sqlRun = "SELECT * FROM Schueler WHERE SchuelerID = '$schuelerID' AND AuthKey = '$authKey'";
    $res = $conn->query($sqlRun);
    foreach ($res as $item) {
        $item["Status"] = "200";
        $item["Message"] = "Success";
        $item["Passwort"] = "Hidden";
        echo json_encode($item);
    }
}
$conn->close();
