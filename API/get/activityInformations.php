<?php
include "../util.php";

$activityId = protect($_GET["AktivitaetID"]);

$conn = connect();

# Anfrage nach allen Daten von eingegebener AktivitätID
$sql = "SELECT * FROM Aktivitaet, Faecher WHERE AktivitaetID = $activityId AND Aktivitaet.FachID = Faecher.ID";
$res = $conn->query($sql);

# JSON return von Daten
if (!isEmpty($res)) {
    echo json_encode($res);
} else {
    throwError("No activity found", 200, "Keine Aktivität mit dieser AktivitaetID gefunden");
}

$conn->close();