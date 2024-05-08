<?php 
include "../util.php";

$query = protect($_GET["Query"]);

$conn = connect();

/* Anfrage auf alle Daten von Aktivität, basierend auf Query
    Sucht nach Ähnlichkeiten in Beschreibung, Fach oder Typ
*/
$sql = "SELECT * FROM Aktivitaet WHERE Beschreibung LIKE '%$query%' OR Bezeichnung LIKE '%$query%'";
$res = $conn->query($sql);
if (!isEmpty($res)) {
    $listActivitys = [];
    foreach ($res as $item) {
        array_push($listActivitys, $item);
    }
    echo json_encode(["Items"=>$listActivitys]);
} else {
    throwError("No activities found", 200, "Keine Aktivitäten mit dieser Suche gefunden");
}
$conn->close();