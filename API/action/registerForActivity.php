<?php 

/**
 * Registrierung vom Schüler in eine Aktivität
 */

include "../util.php";

$schuelerID = protect($_GET["SchuelerID"]);
$authKey = protect($_GET["AuthKey"]);
$activityId = protect($_GET["ActivityId"]);
$conn = connect();
$date = new DateTime("now");
$dateStr = $date->format("YYYY-MM-DD");

$conn = connect();

if (verifySchuelerLogin($schuelerID, $authKey)) {
    $sqlRun = "INSERT INTO nimmtTeil (AktivitaetID, SchuelerID, DatumVon, DatumBis, Bestaetigt) VALUES ($activityId, '$schuelerID', '$dateStr', '$dateStr', false)";
    $conn->query($sqlRun);
    echo throwError("Success", 200, "Successfully registered for activity");
}

$conn->close();