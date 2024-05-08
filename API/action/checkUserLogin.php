<?php
/*
  Bestätigung vom Lehrer, dass Schueler bei Aktivität teil nimmt
*/

include "../util.php";

$userName = protect($_GET["UserName"]);
$loginPassword = protect($_GET["LoginPassword"]);

$conn = connect();


$sqlVerif = "SELECT * FROM User WHERE UserName = '$userName' AND LoginPassword = '$loginPassword'";
$res = $conn->query($sqlVerif);
if (isEmpty($res)) {
    throwError("Kein Nutzer gefunden", 201, "Du hast die falschen Daten angegeben!!1! Willst du uns verarschen? -_-");
} else {
    throwError("User Found", 200, "User wurde gefunden");
}

$conn->close();
