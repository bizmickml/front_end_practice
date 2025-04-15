const tableHeaders = {
  category: "",
  description: "",
  dueDate: "",
  budgetAmount: "",
}
const categories = ["Credit Card Payment", "Food", "Fuel", "Giving", "Homeschool", "Income", "Insurance", "Memberships", "Rent", "Software", "Utilities"]
const masterSheet = [];

const masterCategoryInput = document.getElementById('add-category-input');
const masterDescriptionInput = document.getElementById('add-description-input');
const masterDueDateInput = document.getElementById('add-due-date-input');
const masterBudgetAmountInput = document.getElementById('add-budget-amount-input');


const categorySelector = document.getElementById('Category-Selector');



(function() {
  categories.forEach((val) => {
    categorySelector.insertAdjacentHTML("beforeend", `<option>${val}</option`)
  })
})()