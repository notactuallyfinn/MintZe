<?php
include "../util.php";

$conn = connect();
$nachname = protect($_GET["Nachname"]);
$vorname = protect($_GET["Vorname"]);
$klasse = protect($_GET["Klasse"]);
$geburtsdatum = protect($_GET["Geburtsdatum"]);
$key = protect($_GET["key"]);
echo "test";
if ($key == getAdminKey()) {
    $username = strtolower($vorname . "." . $nachname . "." . dateString($geburtsdatum));
    $sqlSchueler = "SELECT * FROM Schueler WHERE SchuelerID = '$username'";
    $sqlUser = "SELECT * FROM User WHERE UserName = '$username'";
    $resSchueler = $conn->query($sqlSchueler);
    $resUser = $conn->query($sqlUser);
    if (!isEmpty($resSchueler)) {
        // Schueler existiert => Klasse in Schueler aktualisieren
        $update = "UPDATE Schueler SET Klasse = '$klasse' WHERE SchuelerID = '$username'";
        $res = $conn->query($update);
        if ($res) {
            throwError("Success", 200, "Klassenstufe erfolgreich aktualisiert");
        } else {
            throwError("No idea", 411, "Pech gehabt, keine neue Klassenstufe für dich !!1!");
        }
    } elseif (!isEmpty($resUser)) {
        // User existiert => Klasse in User aktualisieren
        $update = "UPDATE User SET Klasse = '$klasse' WHERE UserName = '$username'";
        $res = $conn->query($update);
        if ($res) {
            throwError("Success", 200, "Klassenstufe erfolgreich aktualisiert");
        } else {
            throwError("No idea", 411, "Pech gehabt, keine neue Klassenstufe für dich  !");
        }
    } else {
        // User existiert nicht => erstellen
        $password = randomString(6);
        createUser($password, $nachname, $vorname, $klasse, $geburtsdatum, $key);
    }
} else {
    throwError("No permission", 410, "DAS BLEIBT ALLES SO WIE'S HIER IST!!");
}

$conn->close();
