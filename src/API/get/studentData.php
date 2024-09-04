<?php
include "../util.php";

$SID = protect($_GET["SID"]);
$authKey = protect($_GET["AuthKey"]);
# Zugangsdaten
try {
    $conn = connect();
} catch (Exception $e) {
    throwError("Connection to the database is not possible", 503, "Verbindung mit der Datenbank ist nicht möglich");
    exit();
}

try {
    $sqlRun = "SELECT * FROM schueler WHERE SID = '$SID' AND AuthKey = '$authKey'";
    $res = $conn->query($sqlRun);
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    exit();
}
if ($res->num_rows > 1) {
    throwError("There is more then one user with the same ID", 500, "Es gibt mehr als einen Benutzer mit der selben ID");
} elseif ($res->num_rows == 0) {
    throwError("There is no user with the supplied ID or the AuthKey is wrong", 500, "Es exitiert kein Benutzer mit der ID oder der AuthKey ist falsch");
}

$student = $res->fetch_assoc();
$student["Status"] = "200";
$student["Message"] = "Success";
$student["Passwort"] = "Hidden";
$student["AuthKey"] = "Hidden";
echo json_encode($student);

$conn->close();
