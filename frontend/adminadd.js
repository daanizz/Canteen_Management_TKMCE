// Set the API URL for your admin backend
const API_URL = "http://localhost:4500/api/admin"; 

document.addEventListener("DOMContentLoaded", () => {
  const addItemForm = document.getElementById("add-item-form");
  if (addItemForm) {
    addItemForm.addEventListener("submit", handleAddItem);
  }
});

async function handleAddItem(event) {
  event.preventDefault(); // Stop the form from reloading the page

  const messageEl = document.getElementById("add-item-message");
  messageEl.textContent = "";
  messageEl.className = ""; // Clear previous message classes

  // 1. Get all form values
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const category = document.getElementById("itemCategory").value;
  const isVeg = document.getElementById("itemIsVeg").checked;
  const imageFile = document.getElementById("itemImage").files[0]; // Get the file

  // 2. Basic validation
  if (!name || !price || !category || !imageFile) {
    messageEl.textContent = "Please fill out all fields and select an image.";
    messageEl.className = "alert alert-danger";
    return;
  }

  // 3. Create FormData
  // This is a special object for sending files and text together
  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", String(price)); // Your DB shows price as a string
  formData.append("category", category);
  formData.append("isVeg", isVeg);
  formData.append("image", imageFile); // 'image' must match the backend 'upload.single('image')'

  // 4. Send data to the backend
  try {
    // Note: When using FormData with fetch, you MUST NOT
    // set the 'Content-Type' header yourself. The browser
    // sets it automatically with the correct 'boundary'.
    const response = await fetch(`${API_URL}/addItem`, {
      method: "POST",
      body: formData, 
    });

    const data = await response.json();

    if (response.ok) {
      messageEl.textContent = "Item added successfully!";
      messageEl.className = "alert alert-success";
      document.getElementById("add-item-form").reset(); // Clear the form
    } else {
      messageEl.textContent = `Error: ${data.message}`;
      messageEl.className = "alert alert-danger";
    }
  } catch (error) {
    console.error("Failed to add item:", error);
    messageEl.textContent = "An error occurred. Please check the console.";
    messageEl.className = "alert alert-danger";
  }
}
