<?php 
include "util.php";

$conn = connect();

$schuelerID = protect($_POST["SchuelerID"]);
$authKey = protect($_POST["AuthKey"]);
$aktivitaetID = protect($_POST["AktivitaetID"]);
$timestamp = time();
$message = protect($_POST["Nachricht"]);

$sql = "SELECT AuthKey FROM Schueler WHERE SchuelerID = '$schuelerID'";
$auth = $conn->query($sql);

if (!isEmpty($auth)) {
    foreach ($auth as $item) {
        if ($authKey === $item['AuthKey']) {
            $insert = "INSERT INTO ChatNachrichten (`SchuelerId`, `AktivitaetId`, `TimeStamp`, `Nachricht`) VALUES ('$schuelerID', '$aktivitaetID', $timestamp, '$message')";
            $res = $conn->query($insert);
            if ($res) {
                throwError("Success", 200, "Hat funktioniert");
            } else {
                throwError("Wrong Userinput", 406, "Überdenke bitte deine Eingabe!");
            }
        } else {
            throwError("Wrong Userinput", 406, "Überdenke bitte deine Eingabe!");
        }
    }
} else {
    throwError("No students found", 408, "Diese SchuelerID existiert nicht");
}

$conn->close();
?>
