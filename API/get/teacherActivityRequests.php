<?php 
include "../util.php";
$kuerzel = protect($_GET["Kuerzel"]);
$authKey = protect($_GET["AuthKey"]);

$conn = connect();


if (verifyTeacherLogin($kuerzel, $authKey)) {
    $sqlRun = "SELECT * FROM Schueler, nimmtTeil, istVerantwortlich, Aktivitaet WHERE Schueler.SchuelerID = nimmtTeil.SchuelerID AND nimmtTeil.AktivitaetID = Aktivitaet.AktivitaetID AND nimmtTeil.AktivitaetID = istVerantwortlich.AktivitaetID AND nimmtTeil.Bestaetigt = false AND istVerantwortlich.Kuerzel = '$kuerzel'";
    $res = $conn->query($sqlRun);

    if (!isEmpty($res)) {
        $result = array();
        while ($row = $res->fetch_assoc()) {
            $row["Passwort"] = "Hidden";
            $row["AuthKey"] = "Hidden";
            array_push($result, $row);
        }
        echo json_encode(["Items"=>$result]);
    } else {
        throwError("No activities found", 408, "Keine Aktivitäten mit dieser LehrkraftID gefunden");
    }
}
$conn->close();