<?php
include "util.php";
include "passwordHash.php";

$_POST = json_decode(file_get_contents("php://input"), true);

if (!isset($_POST["Password"]) || !isset($_POST["Username"])) {
    throwError("Missing user input", 400, "Fehlende Eingabedaten");
    exit();
}

$password = protect($_POST["Password"]);
$username = protect($_POST["Username"]);

try {
    $conn = connect();
} catch (Exception $e) {
    throwError("Connection to the database is not possible", 503, "Verbindung mit der Datenbank ist nicht möglich");
    exit();
}

try {
    $res = $conn->query("SELECT * FROM Schueler WHERE Benutzername = '$username'");
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    exit();
}

if (isEmpty($res)) {
    throwError("Wrong user input", 406, "Falscher Benutzername");
    $conn->close();
    exit();
}

$return = [];
$student = $res->fetch_assoc();
if (password_verify($password, $student["Passwort"]) == 0) {
    $return["Status"] = "200";
    $return["Message"] = "Success";
    $return["Type"] = 0;
    $return["SID"] = $student["SID"];

    $SID = $student["SID"];
    $authKey = randomString(64);
    try {
        $res = $conn->query("UPDATE Schueler SET AuthKey = '$authKey' WHERE SID = '$SID'");
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
