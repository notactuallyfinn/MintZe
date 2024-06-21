document.getElementById("submitButton").addEventListener("click", function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let data = {
        "Passwort": password,
        "Email": email
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://vscode.txmmy.net/proxy/5500/test/endpoint.php", true); // Ersetzen Sie mit der URL Ihres PHP-Endpoints
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Response received: ", xhr.responseText);
            } else {
                console.error("Error: ", xhr.status, xhr.statusText);
            }
        }
    };

    xhr.send(JSON.stringify(data));
});
