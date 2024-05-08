<?php
include "../util.php";
include "../get/passwordHash.php";
$conn = connect();

$username = protect($_GET["Username"]);
$tempPassword = protect($_GET["LoginPassword"]);
$email = protect($_GET["Email"]);
$newPassword = password_hash(protect($_GET["Passwort"]), PASSWORD_DEFAULT);
$authKey = randomString(20);

$sql = "SELECT * FROM User WHERE UserName = '$username' AND LoginPassword = '$tempPassword'";
$res = $conn->query($sql);
if (!isEmpty($res)) {
    foreach ($res as $item) {
        // Schueler erstellen
        $nachname = $item["Nachname"];
        $vorname = $item["Vorname"];
        $klasse = $item["Klasse"];
        $geburtsdatum = $item["Geburtsdatum"];
        $create = "INSERT INTO Schueler (`SchuelerID`, `AuthKey`, `Name`, `Vorname`, `Klasse`, `Geburtsdatum`, `Passwort`, `EMail`) VALUES ('$username', '$authKey', '$nachname', '$vorname', '$klasse', '$geburtsdatum', '$newPassword', '$email')";
        $resCreate = $conn->query($create);
        if ($resCreate) {
                // User löschen
            $delete = "DELETE FROM User WHERE UserName = '$username'";
            $resDelete = $conn->query($delete);
            if ($resDelete) {
                $sqlGet = "SELECT * FROM Schueler WHERE SchuelerID = '$username'";
                $resGet = $conn->query($sqlGet);
                foreach ($resGet as $item) {
                    $item["Passwort"] = "Hidden";
                    throwError("Success", 200, json_encode($item));
                }
            } else {
                throwError("No idea", 412, "Schueler erfolgreich erstellt aber User konnte nicht gelöscht werden");
            }
        } else {
            throwError("No idea", 411, "Schueler konnte nicht erstellt werden");
        }
    }
} else {
    throwError("Wrong user input", 407, "Lern deinen Benutzernamen zu schreiben, Dummkopf oder dein Passwort ist halt falsch, lern deine Daten oder es gibt kein Essen für dich");
}
