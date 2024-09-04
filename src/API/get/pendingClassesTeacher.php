<?php
include "../util.php";

$Kuerzel = protect($_GET["Kuerzel"]);
$authKey = protect($_GET["AuthKey"]);
$confirmed = protect($_GET["confirmed"]);
$filter = protect($_GET["filter"]);

try {
    $conn = connect();
} catch (Exception $e) {
    throwError("Connection to the database is not possible", 503, "Verbindung mit der Datenbank ist nicht möglich");
    exit();
}

try {
    $filter = "%" . $filter . "%";
    $sqlRun = "SELECT SF.Name AS Name, mSF.Klassenstufe AS Klassenstufe, mSF.SID AS SID, mSF.SFID AS SFID, mSF.Datum AS Datum, S.Vorname AS Vorname, S.Name AS Nachname, S.Benutzername AS Benutzername FROM schueler AS S, machtSF AS mSF, schulfach AS SF, lehrer AS L WHERE L.Kuerzel = '$Kuerzel' AND L.AuthKey = '$authKey' AND L.Kuerzel = mSF.Kuerzel AND mSF.SID = S.SID AND SF.SFID = mSF.SFID AND mSF.bestaetigt = '$confirmed' AND (S.Name LIKE '$filter' OR S.Vorname LIKE '$filter' OR S.Benutzername LIKE '$filter')";
    $res = $conn->query($sqlRun);
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    exit();
}

$listClasses = [];
foreach ($res as $class){
    array_push($listClasses, $class);
}
echo json_encode(["Items"=>$listClasses, "Status"=>"200", "Message"=>"Success"]);

$conn->close();
