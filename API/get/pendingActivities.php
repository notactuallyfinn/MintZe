<?php
include "../util.php";

$conn = connect();

$query = protect($_GET["Query"]);
$userName = protect($_GET["UserName"]);
$authkey = protect($_GET["AuthKey"]);
if (verifySchuelerLogin($userName, $authkey)) {
    $sqlVerifUser = "SELECT * FROM nimmtTeil, Aktivitaet WHERE Aktivitaet.AktivitaetID = nimmtTeil.AktivitaetID AND SchuelerID = '$userName' AND (Aktivitaet.Beschreibung LIKE '%$query%' OR Aktivitaet.Bezeichnung LIKE '%$query%')"; 
    $resVerif = $conn->query($sqlVerifUser);
    $arrRes = [];
    foreach ($resVerif as $item) {
        array_push($arrRes, $item);
    }
    echo json_encode(["Items"=>$arrRes]);
}
$conn->close();
