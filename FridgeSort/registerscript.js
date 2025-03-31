document.addEventListener("DOMContentLoaded", function () {
    let name = localStorage.getItem("userName");
    let lastName = localStorage.getItem("userLastName");
    let email = localStorage.getItem("userEmail");


    console.log("Überprüfung:", { name, lastName, email });

    if (!name || !lastName || !email) {
        console.log("Keine Benutzerdaten gefunden. Weiterleitung zur Registrierung.");
        window.location.href = "register.html"; 
        return;
    }else{
    console.log("Benutzer bereits registriert.");
    loadUserInfo();
    }
});

function loadUserInfo() {
    if (document.getElementById("userName")) {
        document.getElementById("userName").textContent = localStorage.getItem("userName");
    }
    if (document.getElementById("userLastName")) {
        document.getElementById("userLastName").textContent = localStorage.getItem("userLastName");
    }
    if (document.getElementById("userEmail")) {
        document.getElementById("userEmail").textContent = localStorage.getItem("userEmail");
    }
}
