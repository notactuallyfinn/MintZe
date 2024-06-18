<?php

/*
    Erstellen einer Aktivität
*/

include "util.php";

$kuerzel = protect($_POST["Kuerzel"]);
$authKey = protect($_POST["AuthKey"]);

$name = protect($_POST["Bezeichnung"]);
$subject = protect($_POST["Fach"]);
$typeId = protect($_POST["TypID"]);
$points = protect($_POST["Punkte"]);
$description = protect($_POST["Beschreibung"]);
$teacherString = protect($_POST["Lehrer"]);

$conn = connect();

if (verifyTeacherLogin($kuerzel, $authKey)) {
    $teacherList = explode(".", $teacherString);
    array_push($teacherList, $kuerzel);
    $sql = "INSERT INTO Aktivitaet (Bezeichnung, Fach, TypID, Punkte, Beschreibung) VALUES ('$name', '$subject', $typeId, $points, '$description')";
    $conn->query($sql);
    $activityId = $conn->insert_id;
    foreach ($teacherList as $teacher) {
        $sql2 = "INSERT INTO istVerantwortlich VALUES ('$teacher', $activityId)";
        $res = $conn->query($sql2);
        if (!$res) {
            throwError("Teacher is already responsible for that activity", 409, "Sie sind lost lol");
        }
    }
    # Holy fuck wieso emojis
    throwError("Hat super funktioniert 👍", 187, "Success");
}

$conn->close();
?>
