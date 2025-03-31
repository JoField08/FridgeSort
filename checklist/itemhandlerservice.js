document.addEventListener("DOMContentLoaded", loadItems); // Lädt gespeicherte Items beim Start

  function openModal() {
      document.getElementById("checklistModal").style.display = "flex";
      document.getElementById("currentDate").value = new Date().toISOString().split('T')[0];
    }
    
  function closeModal() {
    document.getElementById("checklistModal").style.display = "none"; /* hide Modal */
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
    const uuid = crypto.randomUUID;

    if (name === "" || expiry === "") {
      errorMessage.style.display = "block";
      return;
    }
    let foodItem = {name, description, current, expiry}; // create an object for the item
    let foodItems = JSON.parse(localStorage.getItem("foodList")) || []; // load/gets the existing list or creates a new one
    foodItems.push(foodItem);
    localStorage.setItem("foodList", JSON.stringify(foodItems)); // store list in localstorage
    displayItems(); // show current list
    closeModal();
    console.log(uuid);
  }
  function displayItems() {
    let foodList = document.getElementById("foodList");
    foodList.innerHTML = "<h2>Aktueller Bestand:</h2>";
    let foodItems = JSON.parse(localStorage.getItem("foodList")) || []; // Lade gespeicherte Items

    if (foodItems.length < 1) {
    noItemsDisplay.style.display = "flex";
    noItemDisplayImage.style.display = "block";
    } else {
    noItemsDisplay.style.display = "none";
    noItemDisplayImage.style.display = "none";
    }

    foodItems.forEach(item => {
        let formattedCurrentDate = formatDate(item.current);
        let formattedExpiryDate = formatDate(item.expiry);

        let foodDiv = document.createElement("div");
        foodDiv.classList.add("food-item");
        foodDiv.innerHTML = `
            <h3><big>${item.name}</big></h3>
            ${item.description ? `<p>${item.description}</p>` : ""}
            <div><strong>Eingetragen am:</strong> ${formattedCurrentDate}</div>
            <div><strong>Ablaufdatum:</strong> ${formattedExpiryDate}</div>
        `;
        foodList.appendChild(foodDiv);
    });
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