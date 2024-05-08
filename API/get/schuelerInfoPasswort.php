<?php
include "../util.php";
include "passwordHash.php";

$password = protect($_GET["Passwort"]);
$username = protect($_GET["Username"]);
# Zugangsdaten
$conn = connect();

# SQL Suche nach Username im Datensatz - ist gegeben?
$sqlRun = "SELECT * FROM Schueler WHERE Username = '$username'";
$res = $conn->query($sqlRun);

if ($res->num_rows === 0) {
    echo json_encode(["Error"=>"No user with name '$username'"]);
}

# Vergleich das Input Passwort mit dem Passwort vom gefundenen Username
foreach ($res as $item) {
    if (password_verify($password, $item["Passwort"])) {
        # JSON return Datensatz des Users
        $item["Passwort"] = "Hidden";
        echo json_encode($item);
    } else {
        // Falsches Passwort
        echo json_encode(["Error"=>"Wrong password"]);
    }
}
$conn->close();