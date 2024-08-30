<?php
include "util.php";

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
    $sqlRun = "SELECT A.Name AS Name, A.Beschreibung AS Beschreibung, mA.Klassenstufe AS Klassenstufe, mA.SID AS SID, mA.AID AS AID, mA.Datum AS Datum, S.Vorname AS Vorname, S.Name AS Nachname, S.Benutzername AS Benutzername FROM Schueler AS S, machtA AS mA, Aktivitaet AS A, Lehrer AS L WHERE L.Kuerzel = '$Kuerzel' AND L.AuthKey = '$authKey' AND L.Kuerzel = mA.Kuerzel AND mA.SID = S.SID AND A.AID = mA.AID AND mA.bestaetigt = '$confirmed' AND (S.Name LIKE '$filter' OR S.Vorname LIKE '$filter' OR S.Benutzername LIKE '$filter')";
    $res = $conn->query($sqlRun);
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    exit();
}

$listActivities = [];
foreach ($res as $activity){
    array_push($listActivities, $activity);
}
echo json_encode(["Items"=>$listActivities, "Status"=>"200", "Message"=>"Success"]);

$conn->close();
