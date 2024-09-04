<?php
include "../util.php";

$kuerzel = protect($_GET["Kuerzel"]);
$authKey = protect($_GET["AuthKey"]);
# Zugangsdaten
try {
    $conn = connect();
} catch (Exception $e) {
    throwError("Connection to the database is not possible", 503, "Verbindung mit der Datenbank ist nicht möglich");
    exit();
}

try {
    $sqlRun = "SELECT * FROM lehrer WHERE Kuerzel = '$kuerzel' AND AuthKey = '$authKey'";
    $res = $conn->query($sqlRun);
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    exit();
}
if ($res->num_rows > 1) {
    throwError("There is more then one user with the same ID", 500, "Es gibt mehr als einen Benutzer mit dem selben Kuerzel");
} elseif ($res->num_rows == 0) {
    throwError("There is no user with the supplied ID or the AuthKey is wrong", 500, "Es exitiert kein Benutzer mit dem Kuerzel oder der AuthKey ist falsch");
}

$teacher = $res->fetch_assoc();
$teacher["Status"] = "200";
$teacher["Message"] = "Success";
$teacher["Passwort"] = "Hidden";
$teacher["AuthKey"] = "Hidden";
echo json_encode($teacher);

$conn->close();
