<?php
include "util.php";

$conn = connect();
$sql1 = "SELECT * FROM Schueler";
$res1 = $conn->query($sql1);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SQL Query</title>
</head>
<body>
    <?php
    if ($res1) {
        if ($res1->num_rows > 0) {
            echo "<table border='1'>";
            echo "<tr><th>SID</th><th>Name</th><th>Vorname</th><th>Klasse</th><th>Passwort</th></tr>"; // Beispiel für Spaltenüberschriften
            while ($row = $res1->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row["SID"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["Name"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["Vorname"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["Klasse"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["Passwort"]) . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo $res1->num_rows;
        }
        $res1->free();
    } else {
        echo "Fehler bei der Abfrage: " . htmlspecialchars($conn->error);
    }

    $conn->close();
    ?>
</body>
</html>
