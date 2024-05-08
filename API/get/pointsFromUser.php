<?php 
    include "../util.php";
    
    $userId = protect($_GET["UserName"]);

    $conn = connect();

    $sql = "SELECT SUM(Punkte) AS Punkte FROM nimmtTeil, Aktivitaet WHERE SchuelerID = '$userId' AND Bestaetigt = 1 AND Aktivitaet.AktivitaetID = nimmtTeil.AktivitaetID";
    $res = $conn->query($sql);

    foreach ($res as $item) {
        if ($item["Punkte"] != null) {
            echo json_encode(["Punkte"=>$item["Punkte"]]);
        } else {
            echo json_encode(["Punkte"=>0]);
        }
    }
