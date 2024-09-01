<?php
include "../util.php";

$SID = protect($_GET["SID"]);
$authKey = protect($_GET["AuthKey"]);
$filter = protect($_GET["filter"]);

try {
    $conn = connect();
} catch (Exception $e) {
    throwError("Connection to the database is not possible", 503, "Verbindung mit der Datenbank ist nicht möglich");
    exit();
}

try {
    $sqlTest = "SELECT SID FROM Schueler WHERE SID = '$SID' AND AuthKey = '$authKey'";
    $res = $conn->query($sqlTest);
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    exit();
}

if ($res->num_rows > 1) {
    throwError("There is more then one user with the same ID", 500, "Es gibt mehr als einen Benutzer mit der selben ID");
    exit();
} elseif (isEmpty($res)) {
    throwError("There is no user with the supplied ID or the AuthKey is wrong", 500, "Es exitiert kein Benutzer mit der ID oder der AuthKey ist falsch");
    exit();
}

try {
    $sqlRun = "SELECT trim(trailing ')' from trim(leading 'enum(' from col.column_type)) AS enum_values FROM information_schema.columns AS col JOIN information_schema.tables tab ON tab.table_schema = col.table_schema AND tab.table_name = col.table_name AND tab.table_type = 'BASE TABLE' WHERE col.data_type IN ('enum') AND col.column_name = 'Klasse'";
    $res = $conn->query($sqlRun);
} catch (Exception $e) {
    throwError("Something went wrong with the query", 500, "Etwas ist mit der Datenbankabfrage falsch gelaufen");
    exit();
}

$listGradeLevels = [];
$gradeLevels = $res->fetch_assoc()["enum_values"];
foreach (explode(",", $gradeLevels) as $gradeLevel) {
    if (str_contains($gradeLevel, $filter)) {
        array_push($listGradeLevels, protect($gradeLevel));
    }
}
echo json_encode(["Items" => $listGradeLevels, "Status" => "200", "Message" => "Success"]);

$conn->close();
