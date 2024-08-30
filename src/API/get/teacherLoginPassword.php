<?php
include "util.php";
include "passwordHash.php";

$_POST = json_decode(file_get_contents("php://input"), true);

if (!isset($_POST["Password"]) || !isset($_POST["Kuerzel"])) {
    throwError("Missing user input", 400, "Fehlende Eingabedaten");
    exit();
}

$password = protect($_POST["Password"]);
$kuerzel = protect($_POST["Kuerzel"]);
# Zugangsdaten

try {
    $conn = connect();
} catch (Exception $e) {
    throwError("Connection to the database is not possible", 503, "Verbindung mit der Datenbank ist nicht möglich");
    exit();
}
$sql = "SELECT * FROM Lehrer WHERE Kuerzel = '$kuerzel'";
try {
    $res = $conn->query($sql);
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    $conn->close();
    exit();
}

if (isEmpty($res)) {
    throwError("Wrong user input", 406, "Falscher Benutzername");
    $conn->close();
    exit();
}

$return = [];
$teacher = $res->fetch_assoc();
if (password_verify($password, $teacher["Passwort"]) == 0) {
    $return["Status"] = "200";
    $return["Message"] = "Success";
    $return["Type"] = 1;
    $return["Kuerzel"] = $teacher["Kuerzel"];

    $Kuerzel = $teacher["Kuerzel"];
    $authKey = randomString(64);
    try {
        $res = $conn->query("UPDATE Lehrer SET AuthKey = '$authKey' WHERE Kuerzel = '$Kuerzel'");
    } catch (Exception $e) {
        throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
        exit();
    }
    $return["AuthKey"] = $authKey;

    echo json_encode($return);
} else {
    // Falsches Passwort
    throwError("Wrong user input", 405, "Falsches Passwort");
}

$conn->close();
