<?php

/*
    Erstellen einer Aktivität
*/

include "../util.php";

$kuerzel = protect($_GET["Kuerzel"]);
$authKey = protect($_GET["AuthKey"]);

$name = protect($_GET["Bezeichnung"]);
$subject = protect($_GET["Fach"]);
$typeId = protect($_GET["TypID"]);
$points = protect($_GET["Punkte"]);
$description = protect($_GET["Beschreibung"]);
$teacherString = protect($_GET["Lehrer"]);

$conn = connect();

if (verifyTeacherLogin($kuerzel, $authKey)) {
    $teacherList = explode(".", $teacherString);
    array_push($teacherList, $kuerzel);
    $sql = "INSERT INTO Aktivitaet (Bezeichnung, Fach, TypID, Punkte, Beschreibung) VALUES ('$name', '$subject', $typeId, $points, '$description')";
    $conn->query($sql);
    $activityId = $conn->insert_id;
    foreach ($teacherList as $teacher) {
        $sql2 = "INSERT INTO istVerantwortlich VALUES ($teacher, $activityId)";
        $res = $conn->query($sql2);
        if (!$res) {
            throwError("Teacher is already responsible for that activity", 409, "Sie sind lost lol");
        }
    }
    # Holy fuck wieso emojis
    throwError("Hat super funktioniert 👍", 187, "Success");
}

$conn->close();
