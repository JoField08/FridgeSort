document.addEventListener("DOMContentLoaded", function () {
    let loginData = localStorage.getItem("userLoginData");
    

    console.log("Überprüfung...");

    if (!loginData) {
        console.log("Keine Benutzerdaten gefunden.");
        if (!window.location.href.includes("register.html")) {
            console.log("Weiterleitung zur Registrierung.");
            window.location.href = "register.html"; 
        }
        return;
    } else {
        console.log("Benutzer bereits registriert.");
        loadUserInfo();
    }
});

function saveUserInfo() {
    let name = document.getElementById("inputName").value.trim(); // .value.trim(); wird verwendet, um den Wert eines Eingabefelds zu holen und dabei Leerzeichen am Anfang und Ende zu entfernen (.trim())
    let lastName = document.getElementById("inputLastName").value.trim();
    let email = document.getElementById("inputEmail").value.trim();
    let errorMessage = document.getElementById("error-message");
    
    errorMessage.textContent = ""; // resetting error-message

    if (name === "" || lastName === "" || email === "") {
        errorMessage.textContent = "Bitte fülle alle Felder aus um fortzufahren!";

        // Fehlernachricht nach 3 Sekunden ausblenden
        setTimeout(() => {
            errorMessage.textContent = "";
        }, 2000);

        return;
    }

    let userLoginDataArray = JSON.stringify({ name, lastName, email });

    localStorage.setItem("userLoginData", userLoginDataArray);

    console.log("Gespeicherte Werte:", JSON.parse(localStorage.getItem("userLoginData")));

    window.location.href = "https://jofield08.github.io/FridgeSort/profile.html"; // Weiterleitung zur Profilseite nach dem Speichern
}
