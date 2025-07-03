document.addEventListener("DOMContentLoaded", displayShopItems); // Lädt gespeicherte Items beim Start

function displayShopItems(){
    let shopList = document.getElementById("shopList");

    shopList.innerHTML = ""; // Liste leeren
    let shopItems = JSON.parse(localStorage.getItem("shopList")) || [];

    if (shopItems.length < 1) {
        // Wenn keine Items da sind, füge eine freundliche Nachricht ein
        let noItemsMessage = document.createElement("div");
        noItemsMessage.style.textAlign = "center";
        noItemsMessage.style.padding = "40px 20px";
        noItemsMessage.style.color = "#50FA7B"; // grüne Farbe passend zum Design
        noItemsMessage.style.fontSize = "1.4rem";
        noItemsMessage.style.fontStyle = "italic";
        noItemsMessage.innerHTML = `Die Einkaufsliste ist leer 🛒`;
        noItemsMessage.onclick = () => {
            window.location.href = "checklist.html";
        }

        shopList.appendChild(noItemsMessage);
    } else {
        shopItems.forEach(item => {
            let shopDiv = document.createElement("div");
            shopDiv.classList.add("shop-item");
            shopDiv.innerHTML = `
        <div class="left-section">
          <h3><big>${item.name}</big></h3>
          ${item.description ? `<p>${item.description}</p>` : ""}
        </div>
        <div class="right-section">
          <div><strong>Aufgebraucht am:</strong> ${item.usedAt}</div>
        </div>
      `;

            shopDiv.onclick = () => openShopItemDetailModal(item);
            shopList.appendChild(shopDiv);
        });
    }
}

function deleteShopItem() {
    let uuid = document.getElementById("shopItemDetailModal").getAttribute("data-uuid");
    let shopItems = JSON.parse(localStorage.getItem("shopList")) || [];

    let itemToDelete = shopItems.find(item => item.uuid === uuid); // find Item

    shopItems = shopItems.filter(item => item.uuid !== uuid);
    localStorage.setItem("shopList", JSON.stringify(shopItems));

    displayShopItems();
    closeShopItemDetailModal();
}

function openShopItemDetailModal(item) {
    document.getElementById("shopItemDetailModal").style.display = "flex";

    document.getElementById("shopModalItemName").textContent = item.name;
    document.getElementById("shopModalDescription").textContent = item.description || "";
    document.getElementById("shopModalUsedAt").textContent = item.usedAt;

    document.getElementById("shopItemDetailModal").setAttribute("data-uuid", item.uuid); //save uuid as attribut in modal
}


function closeShopItemDetailModal(item){
    displayShopItems(); 
    document.getElementById("shopItemDetailModal").style.display = "none"; // close modal

}
function openShop(){
    name = document.getElementById("shopModalItemName").textContent;
    window.open('https://shop.rewe.de/productList?search='+name);
}
