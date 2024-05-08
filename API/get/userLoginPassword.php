<?php
include "../util.php";
include "passwordHash.php";

$password = protect($_GET["Passwort"]);
$email = protect($_GET["Email"]);
# Zugangsdaten

# Trennung von Schüler und Lehrer
$conn = connect();
$sql1 = "SELECT * FROM Schueler WHERE EMail = '$email'";
$sql2 = "SELECT * FROM Lehrer WHERE EMail = '$email'";
$res1 = $conn->query($sql1);
$res2 = $conn->query($sql2);

function execute($res, $type, $password) {
    foreach ($res as $item) {
         if (password_verify($password, $item["Passwort"])) {
            $item["Status"] = "200";
            $item["Message"] = "Success";
            $item["Passwort"] = "Hidden";
            $item["Type"] = $type;
            echo json_encode($item);
        } else {
            // Falsches Passwort
            throwError("Wrong user input", 405, "Falsches Passwort");
        }
    }
}

# Wenn Username in Schueler Tabelle gefunden wird -> setze Type auf Schueler
if (!isEmpty($res1)) {
    execute($res1, 0, $password);
} elseif (!isEmpty($res2)) { # Wenn Username in Lehrer Tabelle gefunden wird -> setze Type auf Lehrer
    execute($res2, 1, $password);
} else {
    throwError("Wrong user input", 406, "Falscher Benutzername");
}

$conn->close();
