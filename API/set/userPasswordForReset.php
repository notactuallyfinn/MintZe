<?php
include "../util.php";
include "../get/passwordHash.php";

$password = password_hash(protect($_GET["Passwort"]), PASSWORD_DEFAULT);
$key = protect($_GET["Key"]);
$conn = connect();

$sql = "UPDATE Schueler SET Passwort = '$password' WHERE SchuelerID = (SELECT UserID FROM PasswortReset WHERE ResetKey = '$key')";
$res = $conn->query($sql);

if ($res === false) {
    throwError("Backend Error", 406, "No idea what happened, but it seems like a you problem :3");
} else {
    $sql = "DELETE FROM PasswortReset WHERE ResetKey = '$key'";
    $conn->query($sql);
    echo json_encode(["Status"=>"200", "Message"=>"Success"]);
}

$conn->close();
