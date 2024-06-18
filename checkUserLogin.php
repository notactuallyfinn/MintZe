<?php
/*
  Bestätigung vom Lehrer, dass Schueler bei Aktivität teilnimmt
*/

include "util.php";

$userName = protect($_POST["UserName"]);
$loginPassword = protect($_POST["LoginPassword"]);

$conn = connect();

$sqlVerif = "SELECT * FROM User WHERE UserName = '$userName' AND LoginPassword = '$loginPassword'";
$res = $conn->query($sqlVerif);
if (isEmpty($res)) {
    throwError("Kein Nutzer gefunden", 201, "Du hast die falschen Daten angegeben!!1! Willst du uns verarschen? -_-");
} else {
    throwError("User Found", 200, "User wurde gefunden");
}

$conn->close();
?>
