<?php
/*
  Bestätigung vom Lehrer, dass Schueler bei Aktivität teil nimmt
*/

include "../util.php";

$kuerzel = protect($_GET["Kuerzel"]);
$authKey = protect($_GET["AuthKey"]);
$requestId = protect($_GET["RequestId"]);
$value = protect($_GET["Value"]);

$conn = connect();


if (verifyTeacherLogin($kuerzel, $authKey)) {

    if ($value == 1) {
        $sqlVerif = "UPDATE nimmtTeil SET Bestaetigt = 1 WHERE RequestId = $requestId";
        $res = $conn->query($sqlVerif);
        if (!isEmpty($res)) {
            throwError("Success", 200, "Successfully confirmed activity");
        } else {
            throwError("No request found", 400, "Anfrage nicht gefunden");
        }
    } else {
        $sqlVerif = "DELETE FROM nimmtTeil WHERE RequestId = $requestId";
        $res = $conn->query($sqlVerif);
    }
}

$conn->close();
