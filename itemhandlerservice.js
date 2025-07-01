document.addEventListener("DOMContentLoaded", displayItems()); // Lädt gespeicherte Items beim Start

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
    let autoShop = document.getElementById("addAutoShop").checked;
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
        autoShop,
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
    foodList.innerHTML = "";
    let foodItems = JSON.parse(localStorage.getItem("foodList")) || [];

    foodItems.sort((a, b) => new Date(a.expiry) - new Date(b.expiry)); //sort after expiry

    if (foodItems.length < 1) { //if no items are present set an error message
        let noItemsMessage = document.createElement("div");
        noItemsMessage.style.textAlign = "center";
        noItemsMessage.style.padding = "40px 20px";
        noItemsMessage.style.color = "#50FA7B";
        noItemsMessage.style.fontSize = "1.4rem";
        noItemsMessage.style.fontStyle = "italic";
        noItemsMessage.innerHTML = `Keine Lebensmittel im Haus 🥶<br> Zeit zum Einkaufen! 🛒`;
        noItemsMessage.onclick = () => { //send to shop.html on click
            window.location.href = "shop.html";
        }
        foodList.appendChild(noItemsMessage);
        return;
    }

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

function openEditItemModal(item) {
    document.getElementById("editItemModal").style.display = "flex";

    document.getElementById("editItemName").value = item.name;
    document.getElementById("editCurrentDate").value = item.current;
    document.getElementById("editExpiryDate").value = item.expiry;
    document.getElementById("editDescription").value = item.description;
    document.getElementById("editAddAutoShop").checked = item.autoShop;

    document.getElementById("editItemModal").setAttribute("data-uuid", item.uuid); // store uuid in modal to use later
}

function closeEditItemModal(item){
    displayItems();
    document.getElementById("editItemModal").style.display = "none";
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

    let updatedItems = foodItems.map(item => { // search for item using uuid and update it
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

    let itemToDelete = foodItems.find(item => item.uuid === uuid);
    if (itemToDelete) {
        tryAddItemToShopList(itemToDelete); // try to add item to shop list if autoShop is true
    }

    foodItems = foodItems.filter(item => item.uuid !== uuid);
    localStorage.setItem("foodList", JSON.stringify(foodItems));

    displayItems();
    closeEditItemModal();
}

function throwItem() {
    let uuid = document.getElementById("editItemModal").getAttribute("data-uuid");
    deleteItem();

    let stats = JSON.parse(localStorage.getItem("userStatsData")) || { //get or create stats
        progress: 0,
        level: 0,
        savedItems: 0,
        streak: 0,
        highscore: 0,
        streakSince: new Date().toLocaleDateString("de-DE")
    };

    stats.streak = 0; //reset streak
    stats.streakSince = new Date().toLocaleDateString("de-DE");

    localStorage.setItem("userStatsData", JSON.stringify(stats)); // save stats
}


function useItem() {
    let uuid = document.getElementById("editItemModal").getAttribute("data-uuid");
       deleteItem();

    let stats = JSON.parse(localStorage.getItem("userStatsData")) || { // get or create stats
        progress: 0,
        level: 0,
        savedItems: 0,
        highscore: 0,
        streak: 0,
        streakSince: new Date().toLocaleDateString("de-DE")
    };

    stats.savedItems += 1; //increase saved items count
    stats.streak += 1; //increase streak count

    if (stats.streak > stats.highscore) { //update highscore if streak is higher
        stats.highscore = stats.streak;
        stats.highscoreSince = new Date().toLocaleDateString("de-DE"); //update date
    }

    stats.progress = (stats.savedItems % 10) * 10; //calculate progress as percentage of current level
    stats.level = Math.floor(stats.savedItems / 10); //calculate level based on saved items
    stats.badge = Math.min(10, Math.floor(stats.level / 5) + 1); //update badge based on level

    localStorage.setItem("userStatsData", JSON.stringify(stats)); //save stats

    console.log("Statistiken aktualisiert:", stats);
    console.table(stats);
}

function formatDate(dateString) { // Format date to "DD.MM.YYYY" (German format)
    if (!dateString) return "-";
    let date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}
function tryAddItemToShopList(item) { // Check if item should be added to the shop list
    if (!item.autoShop) {
    return;
    }
    let shopItems = JSON.parse(localStorage.getItem("shopList")) || []; //get existing shop items or create an empty array
    const uuid = crypto.randomUUID();

     let shopEntry = {
       name: item.name,
       description: item.description || "",
       usedAt: new Date().toLocaleDateString("de-DE"),
       uuid: uuid
    };

    shopItems.push(shopEntry);
    localStorage.setItem("shopList", JSON.stringify(shopItems));
}
