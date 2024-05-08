<?php
include "../util.php";

$schuelerEmail = protect($_GET["Email"]);
$conn = connect();

function generateKey($connection, $schuelerId): string {
    /**
     * TODO: #1 generate stronger keys pls
     */
    $key = randomString(20);
    $sqlInsert = "INSERT INTO PasswortReset (SchuelerID, ResetKey) VALUES ('$schuelerId', '$key')";
    echo $sqlInsert;
    $result = $connection->query($sqlInsert);
    if ($result === false) {
        return generateKey($connection, $schuelerId);
    } else {
        return $key;
    }
}

if ($conn->connect_error) {
    die();
    throwError("Server can't connect to Database: " . $conn->connect_error, 501, "Der Server hat interne Probleme");
}

$res = $conn->query("SELECT * FROM Schueler WHERE EMail = '$schuelerEmail'");

//Wenn die Resultate 0 sind -> throw error
if ($res->num_rows === 0) {
    throwError("Wrong user input", 406, "Falsche EMail");
} else {
    //send email
    foreach ($res as $item) {
        $sql = "SELECT * FROM PasswortReset WHERE SchuelerID = '$item[SchuelerID]'";
        $res2 = $conn->query($sql);
        if ($res2->num_rows > 0) {
            throwError("Allready an outgoing Reseting Process", "413", "Es läuft bereits ein Reset-Prozess für diesen Benutzer");
        } else {
            $key = generateKey($conn, $item["SchuelerID"]);
            $mailSend = mail($item["EMail"], "Passwort vergessen", "Moin moin Matrose/-innen, " . $item["Name"] . " " . $item["Name"] . ",\n\nDu hast dein Passwort vergessen.\n\nHier kannst du dein Neues Passwort einstellen: ". getEndpoint() . "resetPassword/?key=$key !", "From: Mint Zertifikate <infoLK@andreas-schule.org>");
            if ($mailSend) {
                echo json_encode(["Status"=>"200", "Message"=>"Success"]);
            }
        }
    }
}

$conn->close();

