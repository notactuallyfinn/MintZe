<?php
include "../util.php";

$SID = protect($_GET["SID"]);
$authKey = protect($_GET["AuthKey"]);
$filter = protect($_GET["filter"]);
$exactSearch = protect($_GET["Exact"]);

try {
    $conn = connect();
} catch (Exception $e) {
    throwError("Connection to the database is not possible", 503, "Verbindung mit der Datenbank ist nicht möglich");
    exit();
}

try {
    $sqlTest = "SELECT SID FROM schueler WHERE SID = '$SID' AND AuthKey = '$authKey'";
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

$listPoints = [];
for ($i = 0; $i < 16; $i++) {
    if ($exactSearch == 1){
        if("" . $i == $filter){
            array_push($listPoints, $i);
        } 
    }
    elseif (str_contains("" . $i, $filter)) {
        array_push($listPoints, $i);
    }
}
echo json_encode(["Items" => $listPoints, "Status" => "200", "Message" => "Success"]);

$conn->close();
