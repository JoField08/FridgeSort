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
  }
    
  function saveItem() {
    let name = document.getElementById("itemName").value;
    let expiry = document.getElementById("expiryDate").value;
    let current = document.getElementById("currentDate").value;
    let description = document.getElementById("description").value;
    const uuid = crypto.randomUUID();

    if (name === "" || expiry === "") {
      errorMessage.style.display = "block";
      return;
    }
    let foodItem = {name, description, current, expiry, uuid}; // create an object for the item
    let foodItems = JSON.parse(localStorage.getItem("foodList")) || []; // load/gets the existing list or creates a new one
    foodItems.push(foodItem);
    localStorage.setItem("foodList", JSON.stringify(foodItems)); // store list in localstorage
    displayItems(); // show current list
    closeAddItemModal();
    console.log(uuid);
  }
  function displayItems() {
  let foodList = document.getElementById("foodList");
  foodList.innerHTML = ""; // Liste leeren
  let foodItems = JSON.parse(localStorage.getItem("foodList")) || [];

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

    if (name === "" || expiry === "") {
        document.getElementById("editErrorMessage").style.display = "block";
        return;
    }

    let foodItems = JSON.parse(localStorage.getItem("foodList")) || [];
    
    // Findet das Item und aktualisiert die Werte
    let updatedItems = foodItems.map(item => {
        if (item.uuid === uuid) {
            return { ...item, name, expiry, description };
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
  
     foodItems = foodItems.filter(item => item.uuid !== uuid);
    localStorage.setItem("foodList", JSON.stringify(foodItems));
  
     displayItems();
    closeEditItemModal();
  }
  function useItem() {
  let uuid = document.getElementById("editItemModal").getAttribute("data-uuid");
  console.log("Das Objekt mit der UUID: " + uuid + " wurde benutzt.");

  deleteItem(); // Bestehende Löschlogik

  // Hole oder initialisiere userStatsData
  let stats = JSON.parse(localStorage.getItem("userStatsData")) || {
    progress: 0,
    level: 0,
    badge: 1,
    savedItems: 0,
    highscore: 0,
    highscoreSince: new Date().toLocaleDateString("de-DE")
  };

  // Item wurde benutzt → Score erhöhen
  stats.savedItems += 1;

  // Highscore aktualisieren
  stats.highscore = stats.savedItems;

  // Fortschritt im aktuellen Level berechnen
  stats.progress = (stats.savedItems % 10) * 10; // 0–90 in 10er-Schritten

  // Level berechnen (immer 10 Items pro Level)
  stats.level = Math.floor(stats.savedItems / 10);

  // Optional: Badge-Logik (z. B. alle 5 Level ein neuer Badge)
  stats.badge = Math.min(10, Math.floor(stats.level / 5) + 1); // max 10

  // Highscore-Datum bleibt wie es war – oder neu setzen, wenn du willst:
  if (stats.savedItems === 1) {
    stats.highscoreSince = new Date().toLocaleDateString("de-DE");
  }

  // Speichern
  localStorage.setItem("userStatsData", JSON.stringify(stats));

  console.log("Statistiken aktualisiert:", stats);
  console.table(stats); // schöne tabellarische Ausgabe in der Konsole

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
  function debug(content){
    console.log(content)
  }
