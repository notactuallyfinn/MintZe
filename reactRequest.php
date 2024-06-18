<?php
/*
  Bestätigung vom Lehrer, dass Schueler bei Aktivität teilnimmt
*/

include "util.php";

$kuerzel = protect($_POST["Kuerzel"]);
$authKey = protect($_POST["AuthKey"]);
$requestId = protect($_POST["RequestId"]);
$value = protect($_POST["Value"]);

$conn = connect();

if (verifyTeacherLogin($kuerzel, $authKey)) {
    if ($value == 1) {
        $sqlVerif = "UPDATE nimmtTeil SET Bestaetigt = 1 WHERE RequestId = $requestId";
        $res = $conn->query($sqlVerif);
        if ($res) {
            throwError("Success", 200, "Successfully confirmed activity");
        } else {
            throwError("No request found", 400, "Anfrage nicht gefunden");
        }
    } else {
        $sqlVerif = "DELETE FROM nimmtTeil WHERE RequestId = $requestId";
        $res = $conn->query($sqlVerif);
        if ($res) {
            throwError("Success", 200, "Successfully deleted activity request");
        } else {
            throwError("No request found", 400, "Anfrage nicht gefunden");
        }
    }
}

$conn->close();
?>
