<?php
include "../util.php";
include "passwordHash.php";

$schuelerID = protect($_GET["SchuelerID"]);
$authKey = protect($_GET["AuthKey"]);
# Zugangsdaten
$conn = connect();

if (verifySchuelerLogin($schuelerID, $authKey)) {
    foreach ($res as $item) {
        $sqlGetActs = "SELECT * FROM Aktivität, nimmtTeil, Schueler WHERE Aktivität.AktivitaetID = nimmtTeil.AktivitaetID AND Schueler.SchuelerID = nimmtTeil.SchuelerID";
        $res = $conn->query($sqlGetActs);
        $items = [];
        foreach ($res as $item) {
            array_push($items, $item);
        }
        $items["Status"] = "200";
        $items["Message"] = "Success";
        echo json_encode($items);
    }
}
$conn->close();
