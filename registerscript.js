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
    }
});

function isValidEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function saveUserInfo() {
    let name = document.getElementById("inputName").value.trim();
    let lastName = document.getElementById("inputLastName").value.trim();
    let email = document.getElementById("inputEmail").value.trim();
    let errorMessage = document.getElementById("error-message");

    errorMessage.textContent = ""; // Fehlernachricht zurücksetzen

    if (name === "" || lastName === "" || email === "") {
        errorMessage.textContent = "Bitte fülle alle Felder aus, um fortzufahren!";
        setTimeout(() => { errorMessage.textContent = ""; }, 2000);
        return;
    }

    if (!isValidEmail(email)) {
        errorMessage.textContent = "Bitte eine gültige E-Mail-Adresse eingeben!";
        setTimeout(() => { errorMessage.textContent = ""; }, 2000);
        return;
    }

    let userLoginDataArray = JSON.stringify({ name, lastName, email });

    localStorage.setItem("userLoginData", userLoginDataArray);

    console.log("Gespeicherte Werte:", JSON.parse(localStorage.getItem("userLoginData")));

    window.location.href = "profile.html";
}
