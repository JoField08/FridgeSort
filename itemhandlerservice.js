document.addEventListener("DOMContentLoaded", loadItems); // Lädt gespeicherte Items beim Start

function openAddItemModal() {
    document.getElementById("addItemModal").style.display = "flex";
    let today = new Date();
    document.getElementById("currentDate").value = today.toISOString().split('T')[0];

    let nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    document.getElementById("expiryDate").value = nextWeek.toISOString().split('T')[0];
}

function closeAddItemModal() {
    document.getElementById("addItemModal").style.display = "none"; /* hide Modal */
    errorMessage.style.display = "none";  /* remove error */
    document.getElementById("itemName").value = ""; /*clear given modal data*/
    document.getElementById("expiryDate").value = "";
    document.getElementById("description").value = "";
    document.getElementById("addAutoShop").checked = false;
}

function saveItem() {
    let name = document.getElementById("itemName").value;
    let expiry = document.getElementById("expiryDate").value;
    let current = document.getElementById("currentDate").value;
    let description = document.getElementById("description").value;
    let autoShop = document.getElementById("addAutoShop").checked; // NEU: Checkbox-Wert
    const uuid = crypto.randomUUID();

    if (name === "" || expiry === "") {
        document.getElementById("errorMessage").style.display = "block";
        return;
    }

    let foodItem = {
        name,
        description,
        current,
        expiry,
        autoShop, // NEU: Checkbox-Wert mit ins Objekt speichern
        uuid
    };

    let foodItems = JSON.parse(localStorage.getItem("foodList")) || [];
    foodItems.push(foodItem);
    localStorage.setItem("foodList", JSON.stringify(foodItems));

    displayItems();
    closeAddItemModal();
}

function displayItems() {
    let foodList = document.getElementById("foodList");
    foodList.innerHTML = ""; // Liste leeren
    let foodItems = JSON.parse(localStorage.getItem("foodList")) || [];
    //sort after expiry
    foodItems.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));


    if (foodItems.length < 1) {
        // Wenn keine Items da sind, füge eine freundliche Nachricht ein
        let noItemsMessage = document.createElement("div");
        noItemsMessage.style.textAlign = "center";
        noItemsMessage.style.padding = "40px 20px";
        noItemsMessage.style.color = "#50FA7B"; // grüne Farbe passend zum Design
        noItemsMessage.style.fontSize = "1.4rem";
        noItemsMessage.style.fontStyle = "italic";
        noItemsMessage.innerHTML = `Keine Lebensmittel im Haus 🥶<br> Zeit zum Einkaufen! 🛒`;
        noItemsMessage.onclick = () => {
            window.location.href = "shop.html";
        }

        foodList.appendChild(noItemsMessage);
    } else {
        foodItems.forEach(item => {
            let formattedCurrentDate = formatDate(item.current);
            let formattedExpiryDate = formatDate(item.expiry);

            let foodDiv = document.createElement("div");
            foodDiv.classList.add("food-item");
            foodDiv.innerHTML = `
        <div class="left-section">
          <h3><big>${item.name}</big></h3>
          ${item.description ? `<p>${item.description}</p>` : ""}
        </div>
        <div class="right-section">
          <div><strong>Eingetragen am:</strong> ${formattedCurrentDate}</div>
          <div><strong>Ablaufdatum:</strong> ${formattedExpiryDate}</div>
          <div><strong>Auto-Einkauf:</strong> ${item.autoShop ? "Ja" : "Nein"}</div>
        </div>
      `;

            foodDiv.onclick = () => openEditItemModal(item);
            foodList.appendChild(foodDiv);
        });
    }
}

function openEditItemModal(item) {
    document.getElementById("editItemModal").style.display = "flex";

    document.getElementById("editItemName").value = item.name;
    document.getElementById("editCurrentDate").value = item.current;
    document.getElementById("editExpiryDate").value = item.expiry;
    document.getElementById("editDescription").value = item.description;
    document.getElementById("editAddAutoShop").checked = item.autoShop;

    // Speichere die UUID im Modal als Attribut
    document.getElementById("editItemModal").setAttribute("data-uuid", item.uuid);
}

function closeEditItemModal(item){
    displayItems(); // Zeigt die geänderte Liste an
    document.getElementById("editItemModal").style.display = "none"; // schließt modal

}
function saveEditedItem() {
    let uuid = document.getElementById("editItemModal").getAttribute("data-uuid");
    let name = document.getElementById("editItemName").value;
    let expiry = document.getElementById("editExpiryDate").value;
    let description = document.getElementById("editDescription").value;
    let autoShop = document.getElementById("editAddAutoShop").checked;

    if (name === "" || expiry === "") {
        document.getElementById("editErrorMessage").style.display = "block";
        return;
    }

    let foodItems = JSON.parse(localStorage.getItem("foodList")) || [];

    // Findet das Item und aktualisiert die Werte
    let updatedItems = foodItems.map(item => {
        if (item.uuid === uuid) {
            return { ...item, name, expiry, description, autoShop };
        }
        return item;
    });

    localStorage.setItem("foodList", JSON.stringify(updatedItems));
    displayItems();
    closeEditItemModal();
}

function deleteItem() {
    let uuid = document.getElementById("editItemModal").getAttribute("data-uuid");
    let foodItems = JSON.parse(localStorage.getItem("foodList")) || [];

    let itemToDelete = foodItems.find(item => item.uuid === uuid); // 👈 Finde das Item zuerst

    if (itemToDelete) {
        tryAddItemToShopList(itemToDelete); // 👈 Prüfen ob zur Einkaufsliste hinzugefügt werden soll
    }

    foodItems = foodItems.filter(item => item.uuid !== uuid);
    localStorage.setItem("foodList", JSON.stringify(foodItems));

    displayItems();
    closeEditItemModal();
}

function throwItem() {
    let uuid = document.getElementById("editItemModal").getAttribute("data-uuid");
    console.log("Das Objekt mit der UUID: " + uuid + " wurde weggeworfen.");

    deleteItem();

    // Stats laden oder neu anlegen
    let stats = JSON.parse(localStorage.getItem("userStatsData")) || {
        progress: 0,
        level: 0,
        savedItems: 0,
        streak: 0,
        highscore: 0,
        streakSince: new Date().toLocaleDateString("de-DE")
    };

    // streak zurücksetzen
    stats.streak = 0;
    stats.streakSince = new Date().toLocaleDateString("de-DE");

    // Optional: Highscore beibehalten oder anpassen, hier bleibt er so wie er ist

    // Speichern
    localStorage.setItem("userStatsData", JSON.stringify(stats));

    console.log("Statistiken aktualisiert:", stats);
    console.table(stats);
}


function useItem() {
    let uuid = document.getElementById("editItemModal").getAttribute("data-uuid");
    console.log("Das Objekt mit der UUID: " + uuid + " wurde benutzt.");

    deleteItem(); // Item entfernen

    // Stats laden oder neu anlegen
    let stats = JSON.parse(localStorage.getItem("userStatsData")) || {
        progress: 0,
        level: 0,
        savedItems: 0,
        highscore: 0,
        streak: 0,
        streakSince: new Date().toLocaleDateString("de-DE")
    };

    // 1 zu savedItems addieren
    stats.savedItems += 1;

    // streak um 1 erhöhen
    stats.streak += 1;

    // highscore updaten, wenn streak größer ist
    if (stats.streak > stats.highscore) {
        stats.highscore = stats.streak;
        stats.highscoreSince = new Date().toLocaleDateString("de-DE"); // Datum auch aktualisieren
    }

    // Fortschritt im aktuellen Level berechnen (z.B. 10 Items pro Level)
    stats.progress = (stats.savedItems % 10) * 10; // von 0% bis 90%

    // Level berechnen
    stats.level = Math.floor(stats.savedItems / 10);

    // Badge (optional) – alle 5 Level neuer Badge, max. 10
    stats.badge = Math.min(10, Math.floor(stats.level / 5) + 1);

    // Speichern
    localStorage.setItem("userStatsData", JSON.stringify(stats));

    console.log("Statistiken aktualisiert:", stats);
    console.table(stats);
}


function formatDate(dateString) {
    if (!dateString) return "-";
    let date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}
function loadItems() {
    displayItems();
}
function tryAddItemToShopList(item) {
    if (item.autoShop) {
        let shopItems = JSON.parse(localStorage.getItem("shopList")) || [];
        const uuid = crypto.randomUUID();

        let shopEntry = {
            name: item.name,
            description: item.description || "",
            usedAt: new Date().toLocaleDateString("de-DE"),
            uuid: uuid
        };

        shopItems.push(shopEntry);
        localStorage.setItem("shopList", JSON.stringify(shopItems));
        console.log("Zur Einkaufsliste hinzugefügt:", shopEntry);
    }
}
