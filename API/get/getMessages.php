<?php
include "../util.php";

$conn = connect();

$aktivitaetID = protect($_GET["AktivitaetID"]);
$userName = protect($_GET["UserName"]);
$authkey = protect($_GET["AuthKey"]);
if (verifySchuelerLogin($userName, $authkey)) {
    $sqlVerifUser = "SELECT count(*) FROM nimmtTeil WHERE SchuelerID = '$userName' AND AktivitaetID = '$aktivitaetID' AND Bestaetigt = 1";
    $resVerif = $conn->query($sqlVerifUser);
    foreach ($resVerif as $item) {
        if ($item["count(*)"] > 0) {
            $sql = "SELECT * FROM ChatNachrichten, Schueler WHERE AktivitaetID = $aktivitaetID";
            $res = $conn->query($sql);
            $messages = []; 
            foreach ($res as $mes) {
                $mes["Passwort"] = "Hidden";
                $mes["AuthKey"] = "Hidden";
                array_push($messages, $mes);
            }
            echo json_encode(["Data"=>$messages, "Status"=>"200"]);
        } else {
            throwError("No permissions", 200, "Sie haben keine Berechtigung für diese Aktivität");
        }
    }
}
$conn->close();
