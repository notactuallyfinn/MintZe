<?php 

/**
 * Registrierung vom Schüler in eine Aktivität
 */

include "util.php";

$schuelerID = protect($_POST["SchuelerID"]);
$authKey = protect($_POST["AuthKey"]);
$activityId = protect($_POST["ActivityId"]);
$conn = connect();
$date = new DateTime("now");
$dateStr = $date->format("Y-m-d");

$conn = connect();

if (verifySchuelerLogin($schuelerID, $authKey)) {
    $sqlRun = "INSERT INTO nimmtTeil (AktivitaetID, SchuelerID, DatumVon, DatumBis, Bestaetigt) VALUES ($activityId, '$schuelerID', '$dateStr', '$dateStr', false)";
    $conn->query($sqlRun);
    echo throwError("Success", 200, "Successfully registered for activity");
}

$conn->close();
?>
