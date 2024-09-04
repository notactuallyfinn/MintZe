<?php
include "../util.php";

$SID = protect($_GET["SID"]);
$AID = protect($_GET["AID"]);
$kuerzel = protect($_GET["Kuerzel"]);
$gradeLevel = protect($_GET["GradeLevel"]);
$ALID = protect($_GET["ALID"]);
$title = protect($_GET["Title"]);
$date = new DateTime("now");
$dateStr = $date->format("Y:m:d");
$authKey = protect($_GET["AuthKey"]);

try {
    $conn = connect();
} catch (Exception $e) {
    throwError("Connection to the database is not possible", 503, "Verbindung mit der Datenbank ist nicht möglich");
    exit();
}

try {
    $sqlTest = "SELECT SID FROM schueler WHERE SID = '$SID' AND AuthKey = '$authKey'";
    $res = $conn->query($sqlTest);
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    exit();
}

if ($res->num_rows > 1) {
    throwError("There is more then one user with the same ID", 500, "Es gibt mehr als einen Benutzer mit der selben ID");
    exit();
} elseif (isEmpty($res)) {
    throwError("There is no user with the supplied ID or the AuthKey is wrong", 500, "Es exitiert kein Benutzer mit der ID oder der AuthKey ist falsch");
    exit();
}

try {
    $sqlRun = "INSERT INTO machtA(SID, Kuerzel, AID, bestaetigt, Klassenstufe, Stufe, Titel, Datum) VALUES ('$SID', '$kuerzel', '$AID', 0, '$gradeLevel', (SELECT Stufe FROM optionen WHERE AID = '$AID' AND ALID = '$ALID'), '$title', '$dateStr')";
    $conn->query($sqlRun);
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    exit();
}

echo json_encode(["Status" => "200", "Message" => "Success"]);

$conn->close();