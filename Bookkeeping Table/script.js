// Client Name 
const welcomeMsg = document.getElementById('welcome-msg');
const clientNameForm = document.getElementById('client-name-form');
const clientNameInput = document.getElementById('client-name-input');
const clientNameBtn = document.getElementById('client-name-submit-btn');
const clientNameSpan = document.getElementById('client-name-span');
const editNameBtn = document.getElementById('edit-name-button');
const clearNameBtn = document.getElementById('clear-name-btn');
const cancelEditNameBtn = document.getElementById('cancel-edit-name-btn');

// Master Sheet
const masterShowHideBtn = document.getElementById('master-sheet-show-hide-btn');
const masterSheetForm = document.getElementById('master-sheet-form');
const editMasterSheetSelector = document.getElementById('edit-master-sheet-selector');

// Transactions
const transactionShowHideBtn = document.getElementById('transaction-show-hide-btn');
const transactionForm = document.getElementById('transaction-form');
const addCategoryContainer = document.getElementById("add-category-container");
const editCategoryContainer = document.getElementById("edit-category-container");

let categories = ["Utilites", "Food", "Rent/Housing"];

const masterCategoryInput = document.getElementById('add-category-input');
const masterDescriptionInput = document.getElementById('add-description-input');
const masterDueDateInput = document.getElementById('add-due-date-input');
const masterBudgetAmountInput = document.getElementById('add-budget-amount-input');


const showCategories = (element) => {
  element.insertAdjacentHTML("beforeend", `<h4>Existing Categories:</h4><ul id="category-list"></ul>`)
  categories.sort().forEach((cat) => {
    document.getElementById("category-list").insertAdjacentHTML("beforeend", `<li>${cat}</li>`)
  })
}

const editCategories = (element) => {
  categories.sort().forEach((cat) => {
    element.insertAdjacentHTML("beforeend", `<input value="${cat}"/>`)
  })
}

const setCategories = () => {
  localStorage.setItem("categories", categories.sort());
}

const getCategories = () => {
  if (localStorage.getItem("categories")) {
    categories = localStorage.getItem("categories");
  } 
}

const setClientName = () => {
  if (clientNameInput.value === "") {
    alert("Please enter a valid name.")
  } else if (clientNameInput.value === localStorage.getItem("clientName")) {
    alert("The name you entered already exists. Please make a change or cancel.")
  } else {
    localStorage.setItem("clientName", clientNameInput.value);
    getClientName();  
  }
}

const getClientName = () => {
  if (localStorage.getItem("clientName")) {
    clientNameSpan.textContent = `${localStorage.getItem("clientName")}'s`;
    clientNameForm.hidden = true;
    editNameBtn.hidden = false;
    masterShowHideBtn.hidden = false;
    transactionShowHideBtn.hidden = false;
    welcomeMsg.hidden = true;
    clientNameBtn.textContent = "Update Name";
    clearNameBtn.hidden = false;
    cancelEditNameBtn.hidden = false;
  }
}

transactionShowHideBtn.addEventListener("click", () => {
  if (transactionForm.hidden) {
    transactionForm.hidden = false;
    transactionShowHideBtn.textContent = "Hide Transaction Editor";
  } else if (!transactionForm.hidden) {
    transactionForm.hidden = true;
    transactionShowHideBtn.textContent = "Add a Transaction";
  }
})

// Master Sheet Event Listeners
editMasterSheetSelector.addEventListener("change", () => {
  if (editMasterSheetSelector.value === "") {
    addCategoryContainer.hidden = true;
    editCategoryContainer.hidden = true;
  } else if (editMasterSheetSelector.value === "addCategory") {
    editCategoryContainer.hidden = true;
    addCategoryContainer.hidden = false;
    addCategoryContainer.innerHTML = "";
    showCategories(addCategoryContainer);
  } else if (editMasterSheetSelector.value === "editCategories") {
    addCategoryContainer.hidden = true;
    editCategoryContainer.hidden = false;
    editCategoryContainer.innerHTML = "";
    editCategories(editCategoryContainer);
  }
})

masterShowHideBtn.addEventListener("click", () => {
  if (masterSheetForm.hidden) {
    masterSheetForm.hidden = false;
    masterShowHideBtn.textContent = "Cancel Master Edit";
  } else if (!masterSheetForm.hidden) {
    masterSheetForm.hidden = true;
    masterShowHideBtn.textContent = "Edit Master Sheet";
  }
})

// Client Name Event Listeners
cancelEditNameBtn.addEventListener("click", () => {
  clientNameForm.hidden = true;
})

clearNameBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete your data?")) {
    localStorage.removeItem("clientName");
  } else {
    getClientName();
  }
})

editNameBtn.addEventListener("click", () => {
  clientNameInput.value = localStorage.getItem("clientName");
  clientNameForm.hidden = false;
  editNameBtn.hidden = true;
  masterShowHideBtn.hidden = true;
  transactionShowHideBtn.hidden = true;
})

clientNameBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setClientName();
})

window.onload = () => {
  getClientName();
  getCategories();
}

//category - account/vendor - multiple descriptions - sort totals by category and/or account/vendor