const welcomeMsg = document.getElementById('welcome-msg');
const userNameForm = document.getElementById('user-name-form');
const userNameInput = document.getElementById('user-name-input');
const clearUserNameBtn = document.getElementById('clear-user-name-btn');
const cancelUserNameEditBtn = document.getElementById("cancel-user-name-edit-btn");
const controlsCont = document.getElementById('controls-container');
const transFormShowHideBtn = document.getElementById("transaction-form-show-hide-btn");
const catFormShowHideBtn = document.getElementById("category-form-show-hide-btn");
const vendFormShowHideBtn = document.getElementById("vendor-form-show-hide-btn");
const nameFormShowHideBtn = document.getElementById("name-form-show-hide-btn");
const categoryForm = document.getElementById('category-form');
const vendorForm = document.getElementById('vendor-form');
const vendorContainer = document.getElementById('vendor-container');
const categoryContainer = document.getElementById('category-container');
const transactionForm = document.getElementById('transaction-form');
const transactionContainer = document.getElementById('add-transaction-container');
const splitTransMsg = document.getElementById("split-btn-message");
const spreadsheetCont = document.getElementById('spreadsheet-container');

const idRegEx = /[.\s,&%$)('"_]/g;
const numRegEx = /[\s,$']/g;
const testUserData = [
  { 
    id: 1,
    category: "Utilities",
    vendor: ["Electric co.", "Cell Phone Provider"]
  },
  { id: 2,
    category: "Food",
    vendor: ["Grocery Store", "Take out"]
  },
  { id: 3,
    category: "Rent/Housing",
    vendor: ["Mortgage co.", "Storage"]
  }
];
const testUserEntries = [
  {
    "transaction_date": "2025-06-24",
    "transaction_description": "Test regular transaction",
    "transaction_amount": "$593.65",
    "isDeposit": "false",
    "transaction_category": "Utilities",
    "transaction_vendor": "Electric co.",
    "isBudget": "true",
    "transaction_notes": "testing note"
  },
  {
    "transaction_date": "2025-06-01",
    "transaction_description": "Test starting balance",
    "transaction_amount": "$1,265.85",
    "isDeposit": "true",
    "transaction_category": "Starting Balance",
    "transaction_vendor": "",
    "isBudget": "false",
    "transaction_notes": "testing start balance"
  },
  {
    "transaction_date": "2025-06-23",
    "transaction_description": "test split transaction",
    "transaction_amount": "$885",
    "isDeposit": "false",
    "transaction_category": "Utilities",
    "transaction_vendor": "Electric co.",
    "transaction_split_amount_0": "$683.54",
    "transaction_split_category_1": "Utilities",
    "transaction_split_vendor_1": "Cell Phone Provider",
    "transaction_split_amount_1": "$201.46",
    "isBudget": "true",
    "transaction_notes": "test split note"
  },
  {
    "transaction_date": "2025-06-10",
    "transaction_description": "test negative balance format",
    "transaction_amount": "$800",
    "isDeposit": "false",
    "transaction_category": "Fuel",
    "transaction_vendor": "Mike's Truck",
    "isBudget": "false",
    "transaction_notes": "test negative balance"
  },
]
const headings = ["Date", "Description", "Amount", "Category", "Vendor", "Balance", "Notes", "Category Budget"]
let userMsg = []
let addElementIndex = 0;

/** --------  START User Entry Handling -------- */

function setMonthlyBudgetAmounts(arr) {
  for (let i = arr.length; i < arr.length; i++) {
    
  }
}

function sortUserEntriesByDate(arr) {
  for (let i = 0; i < arr.length; i ++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].transaction_date > arr[j].transaction_date) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}

function displayEntries() {
  document.getElementById("table-container").hidden = false;
  spreadsheetCont.innerHTML = "";

    //Display table header
  if (!document.getElementById('table-head')) {
    spreadsheetCont.innerHTML += `<thead id="table-head"><tr id="table-head-row"></tr></thead>`

    headings.forEach((val) => {
      document.getElementById('table-head-row').innerHTML += `<th id="${val.toLowerCase().replace(idRegEx, "-")}">${val}</th>`
    })
  }

  const sortedUserEntries = [...sortUserEntriesByDate(getUserEntries())]
  let startingBal = sortedUserEntries[0].transaction_amount;
  let prevBal;
  let entryBal;

  sortedUserEntries.forEach((entryObj, index) => {
    spreadsheetCont.innerHTML += `<tbody id="entry-${index}"><tr></tr></tbody>`;
    const container = document.getElementById(`entry-${index}`);
    const row = container.children[0];
    const splitRows = container.children;
    let isDeposit = false;
    let isSplit = false;
    let splitAmounts = [];
    let splitCats = [];
    let splitVends = [];
    let splitNote = "";
    let isBudget = true;  //create a function to show the remaining budget amount 
    let transAmount = entryObj.transaction_amount;

      //Set booleans
    for (const [key, value] of Object.entries(entryObj)) {
      if (key.includes("split")) {
        isSplit = true;
      }

      if (key.includes("isDeposit") && value === "true") {
        isDeposit = true;
      }

      if (key.includes("isBudget") && value === "false") {
        isBudget = false;
      }
    }

      //Add split rows & get split data
    if (isSplit) {
      let splitCount = 0
      let splitHTML = `<tr class="split-row"></tr>`

      for (const [key, value] of Object.entries(entryObj)) {
        if (key.includes("split") && key.includes("amount")) {
          splitCount++
          splitAmounts.push(value)
        } else if (key.includes("category")) {
          splitCats.push(value)
        } else if (key.includes("vendor")) {
          splitVends.push(value)
        } else if (key.includes("notes")) {
          splitNote += value
        }
      }

      row.insertAdjacentHTML("afterend", `${splitHTML.repeat(splitCount)}`)
    }

    if (index === 0) {
      entryBal = stringNumToInt(startingBal);
      prevBal = entryBal;
    } else if (index > 0 && isDeposit) {
      entryBal = prevBal + stringNumToInt(transAmount);
      prevBal = entryBal;
    } else if (index > 0 && !isDeposit) {
      entryBal = prevBal - stringNumToInt(transAmount);
      prevBal = entryBal;
    }

      //Display basic data
    for (const [key, value] of Object.entries(entryObj)) {

      if (!(isSplit)) {
        if (!(key.includes("isDeposit")) && !(key.includes("isBudget")) && !key.includes("notes")) {
        row.innerHTML += `
          <td>
            <span id="${value.replace(idRegEx, "-")}-${index}" class="table-data ${value.includes("$") ? "currency" : ""}">${value}</span>
          </td>
        `;
        } else if (key.includes("notes")) {

          row.innerHTML += `
            <td>
              <span class="balance ${entryBal > 0 ? "positive" : "negative"}">$${dispFormatNum(entryBal)}</span>
            </td>
            <td>
              <span>${value}</span>
            </td>
          `;
        }
        
      } else if (isSplit) {
        if (key.includes("date") || key.includes("description") || key.includes("amount") && !(key.includes("split"))) {
          row.innerHTML += `
            <td>
              <span id="${value.replace(idRegEx, "-")}-${index}" class="table-data ${value.includes("$") ? "currency" : ""}">${value}</span>
            </td>
          `;
        }
      }
    }

      //Display split data
    if (isSplit) {row.innerHTML += `<td colspan="2"><span class="split-category"></span></td>`}

    for (let i = 0; i < splitRows.length; i++) {
      if (i > 0) {splitRows[i].innerHTML += `<td colspan="2" class="placeholder"></td>`}
    }

    splitAmounts.forEach((val, index) => {
      splitRows[index + 1].innerHTML += `<td><span class="split-value currency">${val}</span></td>`
    })

    splitCats.forEach((val, index) => {
      splitRows[index + 1].innerHTML += `<td><span class="split-value category">${val}</span></td>`
    })

    splitVends.forEach((val, index) => {
      splitRows[index + 1].innerHTML += `<td><span class="split-value vendor">${val}</span></td>`
    })

    if (isSplit) {row.innerHTML += `<td><span class="balance ${entryBal > 0 ? "positive" : "negative"}">$${dispFormatNum(entryBal)}</span></td><td><span>${splitNote}</span></td>`};

      //Format Deposits
    if (isDeposit) {
      const amounts = [...container.getElementsByClassName("currency")];
      
      amounts.forEach((el) => {
        el.classList.add("deposit") 
      })
    }

    if (isBudget) {}
  })
}

function isUserEntry() {return(localStorage.getItem('userEntries') ? true : false)}

function getUserEntries() {return(isUserEntry() ? JSON.parse(localStorage.getItem('userEntries')) : testUserEntries)}

/** --------  END User Entry Handling -------- */
/** --------  START User Data Handling -------- */

function isDataChanged(newData) {
  //checks whether the newData array is exactly the same as the existing data.
  //Returns a boolean 

  let isChange = false;
  let existData = getUserData();

  if (newData.length === existData.length) {

    sortUserData(newData).forEach((newDataObj, index) => {
      let existDataObj = existData[index]

      if (!(existDataObj.id === newDataObj.id)) {isChange = true}
      if (!(existDataObj.category.toLowerCase() === newDataObj.category.toLowerCase())) {isChange = true}
      if (!(existDataObj.vendor.length === newDataObj.vendor.length)) {
        isChange = true
      } else {
        newDataObj.vendor.forEach((val, index) => {
          if (!(val.toLowerCase() === existDataObj.vendor[index].toLowerCase())) {isChange = true}
        })
      }
    })  
  } else {
    isChange = true
  }
  
  return(isChange)
} 

function saveUserData(newData) {

  if (isDataChanged(newData) === true) {
    localStorage.setItem("userData", JSON.stringify(sortUserData(newData)))
  } else if (!isDataChanged(newData)) {
    userMsg.push("No changes were made")
  }
}

function sortUserData(newDataArr) {
  //newDataArr should be an array of objects

  /** Sort Categories */
  for (i = 0; i < newDataArr.length; i++) {
    for (j = (i + 1); j < newDataArr.length; j++) {
      if (newDataArr[i].category.toLowerCase() > newDataArr[j].category.toLowerCase()) {
        [newDataArr[i], newDataArr[j]] = [newDataArr[j], newDataArr[i]]
      }
    }
  }

  /** Sort Vendors within sorted categories*/
  newDataArr.forEach((dataObj) => {
    for (i = 0; i < dataObj.vendor.length; i++) {
      for (j = (i + 1); j < dataObj.vendor.length; j++) {
        if (dataObj.vendor[i].toLowerCase() > dataObj.vendor[j].toLowerCase()) {
          [dataObj.vendor[i], dataObj.vendor[j]] = [dataObj.vendor[j], dataObj.vendor[i]]
        }
      }
    }
  })

  return(newDataArr)
}

function isUserData() {return(localStorage.getItem('userData') ? true : false)}

function getUserData() {return(isUserData() ? JSON.parse(localStorage.getItem('userData')) : sortUserData(testUserData));
}

function clearAllData() {
  if (confirm("Are you sure you want to DELETE all data? This is a DESTRUCTIVE action and cannot be undone.")) {
    localStorage.clear();
    window.location.reload();
  }
}

/** --------  END User Data -------- */
/** --------  START Form Data -------- */

function dataExists(value, type) {
  /**
   *  value property = the value of a new category entry OR a new vendor entry, 
   *  type property = "cat" or "vend"
   *  return val = a boolean representing whether the new data already exists
   */

  let exists = false;

  if (type === "cat") {
    getUserData().forEach((dataObj) => {
      if (dataObj.category.toLowerCase() === value.toLowerCase()) {
        exists = true;
      }
    })
  } else if (type === "vend") {
    getUserData().forEach((dataObj) => {
      dataObj.vendor.forEach((name) => {
        if (value.toLowerCase() === name.toLowerCase()) {
          exists = true;
        }
      })
    })
  }

  return(exists)
}

function delVend(button) {
  /** Deletes a vendor in-place on the edit vendors form */

  const vendInputName = button.parentNode.children[0].children[0].getAttribute('name');
  const catInputName = button.parentNode.children[1].children[0].getAttribute('name');
  const vendor = vendInputName.slice(vendInputName.indexOf("-") + 1);
  const category = catInputName.slice(catInputName.indexOf("-") + 1);
  
  let existData = [...getUserData()];

  existData.map((dataObj) => {
    if (dataObj.category === category && confirm(`Are you sure? This will delete the vendor [${vendor}]. This action cannot be undone.`)) {
      dataObj.vendor.splice(dataObj.vendor.indexOf(vendor), 1);
      userMsg.push(`The vendor: [${vendor}], has been deleted`);
      saveUserData(existData);
      delParNode(button);

    } else if (dataObj.category === category) {
      userMsg.push("No changes were made.");
    }
  })
  displayUserMsg();
}

function delCat(button) {
  /** Deletes a category in-place on the edit-categories form */

  const cat = button.parentNode.children.item(0).children.item(0).value
  const form = button.parentNode.parentNode.parentNode.parentNode.parentNode
  let existData = [...getUserData()];

  existData.map((dataObj, index) => {
    if (dataObj.category === cat && confirm(`Are you sure? This will delete the category [${dataObj.category}] and all vendors associated with it. This action cannot be undone.`)) {
      existData.splice(index, 1)
      userMsg.push(`The Category: [${cat}], was deleted`)
      delParNode(button)
      form.reset();

      if (existData.length === 0) {
        localStorage.removeItem("userData")
        userMsg.push("All categories have been deleted.", "Categories have been reset.")
        form.querySelector(".cancel-btn").click();
      } else {
        saveUserData(existData)
      }
    } else if (dataObj.category === cat) {
      userMsg.push("No changes were made.")
    }
  })
  displayUserMsg()
}

function formDataHandler(newDataArr, formName) {
  let existData = [...getUserData()];
  let existEntries = [...getUserEntries()];

  if (formName === "user-name-form") {
    const newUserNameEntry = newDataArr[0][1];

    newUserNameEntry === getUserName() ? userMsg.push("No changes were made") : userMsg.push(`Changed user name [${getUserName()}] to: ${newUserNameEntry}`);
    localStorage.setItem("userName", newUserNameEntry);
    window.location.reload();

  } else if (formName === "category-form") {
    const entryName = newDataArr[0][0]

    if (entryName.includes("addCategory")) {

      newDataArr.forEach((entry) => {
        const category = entry[1]

        if (dataExists(category, "cat")) {
          userMsg.push(`Category: "${category}" already exists.`);
        } else {
          existData.push({id: "x", category: category, vendor: []})
          userMsg.push(`Added new category: ${category}`)
        }
      })      

    } else if (entryName.includes("edit_cat")) {

      newDataArr.forEach((entry) => {
        const prevName = entry[0].slice(entry[0].indexOf("-") + 1)
        const newName = entry[1]

        if (!(prevName === newName)) {
          existData.map((catObj) => {
            if (catObj.category === prevName) {
              userMsg.push(`Category [${prevName}] changed to: ${newName}`);
              catObj.category = newName;
            }
          })
        } 
      })
    }
    saveUserData(existData)

  } else if (formName === "vendor-form") {
    const entryType = newDataArr[0][0];

    if (entryType.includes("addVendor")) {
      newDataArr.forEach((entryArr, index) => {
        let entryName = entryArr[0]
        
        if (entryName.includes('addVendor') && !(entryName.includes('addVendor-cat'))) {
          let newVendor = entryArr[1];
          let newVendCat = newDataArr[index + 1][1];

          if (dataExists(newVendor, "vend")) {
            userMsg.push(`The vendor: [${newVendor}] already exists. Please choose another vendor or account name.`);
          } else {
            existData.map((dataObj) => {
              if (dataObj.category === newVendCat) {
                userMsg.push(`The vendor: [${newVendor}] was added to the category: [${newVendCat}]`);
                dataObj.vendor = [...dataObj.vendor, newVendor];
              }
            })
          }
        }
      })

    } else if (entryType.includes("edit_vendor")) {
      newDataArr.forEach((entryArr, index) => {
        let entryType = entryArr[0]
        
        //  establish variables
        if (entryType.includes("edit_vendor_cat")) {
          let oldVendCat = entryArr[0].slice(entryArr[0].indexOf("-") + 1)
          let newVendCat = entryArr[1]
          let oldVendName = newDataArr[index - 1][0].slice(newDataArr[index - 1][0].indexOf("-") + 1)
          let newVendName = newDataArr[index - 1][1]
          
            // If nothing changed - do nothing
          if ((oldVendCat === newVendCat) && (oldVendName === newVendName)) {
            
            //  If category is changed 
          } else if (!(oldVendCat === newVendCat)) {
            existData.map((dataObj) => {
              if (dataObj.category === oldVendCat) {
                userMsg.push(`The vendor: [${oldVendName}], was removed from the category: [${oldVendCat}]`)
                dataObj.vendor.splice(dataObj.vendor.indexOf(oldVendName), 1);
              }
              if (dataObj.category === newVendCat) {
                userMsg.push(`The vendor: [${newVendName}], has been added to the category: [${newVendCat}]`)
                dataObj.vendor.push(newVendName);
              }
            })
            
            //  Category is NOT changed but vendName is
          } else if (oldVendCat === newVendCat && !(oldVendName === newVendName)) {
            existData.map((dataObj) => {
              if (dataObj.category === oldVendCat) {
                userMsg.push(`The vendor: [${oldVendName}], has been changed to: [${newVendName}]`)
                dataObj.vendor.splice(dataObj.vendor.indexOf(oldVendName), 1, newVendName);
              }
            })
          }
        }
      })
    };

    saveUserData(existData)

  } else if (formName.includes("transaction")) {
    let newEntry = {};

    newDataArr.forEach((entry) => {
      let key = entry[0]
      let value = entry[1]
      newEntry[key] = value
    })

    existEntries.push(newEntry)
    localStorage.setItem('userEntries', JSON.stringify(existEntries))
  }
}

function getFormData(form) {
  const newDataArr = Array.from(new FormData(form).entries())
  const cancelBtn = form.querySelector(".cancel-btn");

  if (newDataArr.length === 0) {
    cancelBtn.click();
    userMsg.push("No changes were made");
    displayUserMsg();

  } else {
    if (form.name.includes('transaction') && isSplitTransaction(newDataArr)) {
      if (isSplitBalanced()) {
        formDataHandler(newDataArr, form.name);
        form.reset();
        cancelBtn.click();
        isUserEntry() && displayEntries();
        displayUserMsg();

      } else {
        alert("The sum of the Split Amounts must equal the Total Transaction Amount")
      }

    } else {
      formDataHandler(newDataArr, form.name);
      form.reset();
      cancelBtn.click();
      isUserEntry() && displayEntries();
      displayUserMsg();
    }
  }
}

/** --------  END Form Data -------- */
/** --------  START User-Message -------- */

function dismissUserMsg(element) {
  element.parentNode.hidden = true;
  element.parentNode.innerHTML = "";
  userMsg = []
}

function displayUserMsg() {
  /**
   * Could add functionality to incorporate a log of past msgs
   * each msg would have a date stamp
   * the interface could be searchable
   * maybe include and undo feature? - not sure how that could potentially break the app
   */
  const container = document.getElementById("user-msg-container")
  container.innerHTML = "";

  if (userMsg.length > 0) {

    userMsg.forEach((msg) => {
      container.insertAdjacentHTML("beforeend", `<p>${msg}</p>`)
    })
    container.insertAdjacentHTML("beforeend", `<button class="btn dismiss-btn" type="button" onclick="dismissUserMsg(this)">Dismiss</button>`)
    container.hidden = false;
  }
}

/** --------  END User-Message -------- */
/** --------  START User Name  -------- */

function clearUserName() {
  if(confirm(`Are you sure you want to delete your saved name: ${getUserName()}?`)) {
    localStorage.removeItem("userName")
    window.location.reload()
  } 
}

const displayUserName = () => {
  document.getElementById('user-name-span').textContent = `${getUserName()}'s`;  
}

function getUserName() {return(isUser() ? localStorage.getItem("userName") : "")};

function isUser() {return(localStorage.getItem("userName") ? true : false)};

/** --------  END User Name  -------- */
/** --------  START Transaction Form -------- */

function isSplitBalanced() {
  let transAmount = 0
  let splitSum = 0

  document.querySelectorAll('input').forEach((el) => {
    if (el.name.includes('amount') && !(el.name.includes("split"))) {
      transAmount += (el.value.replace(numRegEx, "") * 100)
    } 
    if (el.name.includes("split")) {
      splitSum += (el.value.replace(numRegEx, "") * 100)
    }
  })

  if (!(transAmount === 0) && transAmount === splitSum) {
    return true
  } else {
    return false
  }
}

function isSplitTransaction(newDataArr) {return(newDataArr.length === 8 ? false : true)}

function formatAmountInputs() {

  document.querySelectorAll('input').forEach((el) => {

    if (el.name.includes("amount")) {
      let string = el.value.replace(numRegEx, "");
      let output = (!string ? "" : "$")
      
      if (string.includes(".")) {
        let dec = string.slice((string.indexOf(".") + 1))
        let decOutput = (dec.length > 2 ? dec.slice(0, 2) : dec)
        let intStr = string.slice(0, (string.indexOf(".")))
        
        if (intStr.length < 4) {
          output += intStr + "." + decOutput

        } else if (intStr.length >= 4) {
          let array = Array.from(intStr)

          for (let i = array.length - 3; i > 0; i = i - 3) {
            array.splice(i, 0, ",")
          }

          array.forEach((val) => {output += val})

          output += "." + decOutput
        }

      } else if (!(string.includes("."))) {

        if (string[0] == 0) {
          output = ""
        } else if (string.length < 4) {
          output += string

        } else if (string.length >= 4) {
          let array = Array.from(string)

          for (let i = array.length -3; i > 0; i = i - 3) {
            array.splice(i, 0, ",")
          }

          array.forEach((val) => {output += val})
        }
      } 

      el.value = output
    }
  })
}

function dispFormatNum(num) {
  let array = Array.from(num.toString());
  let int = (array.length > 1 ? array.slice(0, -2) : []); 
  let dec = (array.length > 1 ? array.slice(-2) : [0, ...array]); 
  let formatted = ""
  
  if (!int.includes("-")) {
    for (let i = (int.length - 3); i > 0; i = i - 3) {
      int.splice(i, 0, ",")
    }
  } else if (int.includes("-") && int.length > 4) {
    for (let i = (int.length - 3); i > 0; i = i - 3) {
      int.splice(i, 0, ",")
    }
  }

  int.forEach((val) => {formatted += val})
  formatted += "."
  dec.forEach((val) => {formatted += val})
  
  return (formatted)
}

function stringNumToInt(strNum) {return((Math.round(strNum.replace(numRegEx, "") * 100)))}

function splitSum() {
  const transInput = document.getElementById('transaction-amount')
  const addTransCont = document.getElementById("add-transaction-container");

  if (addTransCont.children.length < 10) {

  } else if (addTransCont.children.length > 9 && transInput.value) {
    let transAmount = stringNumToInt(transInput.value)
    let remAmount = transAmount
    
    document.querySelectorAll('input').forEach((el) => {
      if (el.name.includes("amount") && !(el.name === "transaction_amount")) {
        remAmount -= (el.value ? stringNumToInt(el.value) : 0)
      }
    })

    splitTransMsg.textContent = (remAmount === 0 ? "Split is balanced" : `Split amount remaining: $${dispFormatNum(remAmount)}`);

  }
}

function delSplit(el) {
  if (el.parentNode.parentNode.children.length === 10) {
    document.getElementById('split-transaction-btn').textContent = "Add a split"
    splitTransMsg.textContent = "Split transaction between multiple categories?"
    document.getElementById("first-split-amount-container").remove()
  }
  
  delParNode(el)
}

function addTransSplit(el) {
  addElementIndex++

  if (el.parentNode.children[4].children.length < 5) {

    el.parentNode.children[4].insertAdjacentHTML("beforeend", `      
      <label id="first-split-amount-container">Split Amount: 
        <input type="text" name="transaction_split_amount_${addElementIndex - 1}" required autocomplete="off" onchange="splitSum()" placeholder="$45.97"/>
      </label>
    `)

  }

  el.parentNode.children[4].insertAdjacentHTML("afterend", `
    <div id="split-category-container-${addElementIndex}">
      <label for="transaction-split-category-${addElementIndex}">Category: </label>
      <select id="transaction-split-category-${addElementIndex}" name="transaction_split_category_${addElementIndex}" required onchange="populateSelects()">
        <option value="" selected disabled>-- Please choose a category --</option>
      </select>
      <label for="transaction-split-vendor-${addElementIndex}">Vendor: </label>
      <select id="transaction-split-vendor-${addElementIndex}" name="transaction_split_vendor_${addElementIndex}" required>
        <option value="" selected disabled>-- Please choose a vendor or account --</option>
      </select>
      <label>Split Amount: 
        <input type="text" name="transaction_split_amount_${addElementIndex}" required autocomplete="off" onchange="splitSum()" placeholder="$45.97" />
      </label>
      <button class="btn del-btn" onclick="delSplit(this)">X</button>
    </div>
  `);
  
  el.textContent = "Add another split";
  splitTransMsg.textContent = "";
  populateSelects();
  splitSum();
  addAmountListener();
}

function addAmountListener() {
  document.querySelectorAll('input').forEach((input) => {
    if (input.name.includes('amount')) {
      input.addEventListener("keyup", () => {
        formatAmountInputs()
        splitSum()
      })
    }
  })
}

/** --------  END Transaction Form -------- */
/** --------  START Display & Page Controls -------- */

function delParNode(element) {element.parentNode.remove()}

function delParParNode(element) {element.parentNode.parentNode.remove()}

function populateSelects() {
  const selectElements = [...document.getElementsByTagName("select")]

  selectElements.forEach((el, index) => {
    
    if (el.name.includes("edit_vendor_cat") && el.children.length === 1) {
      getUserData().map((dataObj) => {
        el.innerHTML += `<option ${(el.name.includes(dataObj.category) && "selected")} value="${dataObj.category}">${dataObj.category}</option>`
      })

    } else if (el.name.includes("addVendor-cat") && el.children.length === 1) {
      getUserData().map((dataObj) => {
        el.innerHTML += `<option value="${dataObj.category}">${dataObj.category}</option>`
      })

    } else if (el.name.includes("transaction") && el.name.includes("category")) {
      const categories = []
      getUserData().forEach((dataObj) => {
        categories.push(dataObj.category)
      })

      if (el.children.length < (categories.length + 1) || el.children.length > (categories.length + 1)) {
        el.innerHTML = `<option value="" selected disabled>-- Please choose a catetgory --</option>`

        getUserData().forEach((dataObj) => {
          el.innerHTML += `<option value="${dataObj.category}">${dataObj.category}</option>`
        })
      }

    } else if (el.name.includes("transaction") && el.name.includes('vendor') && !el.value) {
      const cat = selectElements[index - 1]
      const vendors = []

      if (cat.value === "") {
        el.innerHTML = `<option value="" selected disabled>-- Please choose a vendor or account --</option>`

      } else {
        getUserData().forEach((dataObj) => {
          if (dataObj.category === cat.value) {
            if (dataObj.vendor.length > 0) {
              dataObj.vendor.forEach((val) => {
                vendors.push(val)
              })
            }
          }
        })

        if (vendors.length > 0) {
          el.innerHTML = `<option value="" selected disabled>-- Please choose a vendor or account --</option>`
          
          getUserData().forEach((dataObj) => {
            if (cat.value === dataObj.category) {
              dataObj.vendor.forEach((name) => {
                el.innerHTML += `<option value="${name}">${name}</option>`
              })
            }
          })

        } else {
          el.innerHTML = `<option value="" selected>No vendors in this category</option>`;
          el.required = false;
        }

      }


    }
  })
}

const displayFormUserData = (type) => {
  if (type === "cat") {
    categoryContainer.innerHTML = "";
    categoryContainer.innerHTML += `<h4>Existing Categories:</h4><ul id="exist-cats"></ul>`;

    getUserData().forEach((dataObj) => {
      document.getElementById("exist-cats").insertAdjacentHTML("beforeend", `<li>${dataObj.category}</li>`);
    });

  } else if (type === "vend") {
    vendorContainer.innerHTML = "";
    vendorContainer.innerHTML += `<h4>Existing Vendors & Accounts:</h4><ul id="exist-vendors"></ul>`;
    getUserData().forEach((dataObj) => {
      document.getElementById("exist-vendors").innerHTML += `<ul id="cat-${dataObj.id}">${dataObj.category}</ul>`;

      dataObj.vendor && dataObj.vendor.length > 0 && dataObj.vendor.forEach((name) => {
        document.getElementById(`cat-${dataObj.id}`).innerHTML += `<li>${name}</li>`;
      });
    })
  } else if (type === "trans") {


  }
}

const displaySelectOpts = (selectEl) => {
  displayFormUserData(selectEl.id.includes("category") ? "cat" : "vend")

 if (selectEl.value ==="addCategory") {
    const addCatHTML= `      
      <div>
        <label>
          New category name: 
          <input name="addCategory" type="text" placeholder="e.g. Gifts" required />
        </label>
        <button class="btn del-btn" type="button" onclick="delParNode(this)">X</button>
      </div>
    `;
    categoryContainer.insertAdjacentHTML("beforeend", addCatHTML + `
      <button class="btn add-btn" id="add-cat-btn" type="button">Add Category</button>
    `);
    document.getElementById('add-cat-btn').addEventListener("click", (e) => {
      e.target.insertAdjacentHTML('beforebegin', addCatHTML);
    });
    
  } else if (selectEl.value ==="editCategories") {
    document.getElementById("exist-cats").innerHTML = ""

    getUserData().forEach((dataObj) => {
      document.getElementById("exist-cats").innerHTML += `
        <li>
          <label>Edit Category [${dataObj.category}]: 
            <input name="edit_cat-${dataObj.category}" value="${dataObj.category}" required>
          </label>
          <button class="btn del-btn" type="button" onclick="delCat(this)">X</button>
        </li>
      `;
    })
  } else if (selectEl.value ==="addVendor") {
    const addVendorHTML = `
      <div>
        <label>New Vendor Name: <input name="addVendor" placeholder="e.g. Your Favorite Store" required></label>
        <label">in Category: 
        <select name="addVendor-cat" value="">
          <option value="" disabled selected>-- Please choose an existing category --</option>
        </select></label>
        <button class="btn del-btn" type="button" onclick="delParParNode(this)">X</button>
      </div>
    `;
    vendorContainer.innerHTML += addVendorHTML + `
      <button id="add-vendor-btn" type="button" class="btn add-btn">Add Vendor</button>
    `;
    populateSelects()

    document.getElementById("add-vendor-btn").addEventListener("click", (e) => {
      e.target.insertAdjacentHTML("beforebegin", addVendorHTML)
      populateSelects();
    })

  } else if (selectEl.value ==="editVendors") {
    const vendList = document.getElementById("exist-vendors");
    vendList.innerHTML = "";

    getUserData().forEach((dataObj, catIndex) => {
      dataObj.vendor.forEach((name, vendIndex) => {
        vendList.innerHTML += `
          <li>
            <label>Existing vendor name: <input name="edit_vendor-${name}" value="${name}"></label>
            <label>Change existing category? 
              <select name="edit_vendor_cat-${dataObj.category}">
                <option value="" disabled>-- Please choose an existing category --</option>
              </select>
            </label>
            <button class="btn del-btn" type="button" onclick="delVend(this)">X</button>
          </li>
        `;
      })
    })

    populateSelects()
  }
}

const formToggle = (btn) => {
  const id = btn.id

  if (id.includes("name")) {
    cancelUserNameEditBtn.hidden = false;
    clearUserNameBtn.hidden = false;
    userNameForm.hidden = (userNameForm.hidden ? false : true);
    userNameInput.value = getUserName();

  } else if (!id.includes("name")) {
    cancelUserNameEditBtn.hidden = true;
    clearUserNameBtn.hidden = true;
    userNameForm.hidden = true;
  }
  
  if (id.includes("category")) {
    categoryForm.hidden = (categoryForm.hidden ? false : true)
    displayFormUserData("cat")

  } else if (!id.includes("category")) {
    categoryForm.hidden = true;
    categoryContainer.innerHTML = "";
  }
  
  if (id.includes("vendor")) {
    vendorForm.hidden = (vendorForm.hidden ? false : true)
    displayFormUserData("vend")

  } else if (!id.includes("vendor")) {
    vendorForm.hidden = true;
    vendorContainer.innerHTML = "";
  }
  
  if (id.includes("transaction")) {
    transactionForm.hidden = (transactionForm.hidden ? false : true);
    [...document.getElementsByClassName("del-btn")].forEach((el) => {el.click()});
    document.getElementById("transaction-category").value = ""
    populateSelects();
    addAmountListener();

  } else if (!id.includes("transaction"))  {
    transactionForm.hidden = true;
  }

  nameFormShowHideBtn.children[0].textContent = (userNameForm.hidden ? "Change/Edit User Name" : "Hide User Name Form");
  catFormShowHideBtn.children[0].textContent = (categoryForm.hidden ? "Edit Categories" : "Hide Category Form");
  vendFormShowHideBtn.children[0].textContent = (vendorForm.hidden ? "Edit Vendors" : "Hide Vendor Form");
  transFormShowHideBtn.children[0].textContent = (transactionForm.hidden ? "Add a transaction" : "Hide transaction form");

  if (!transactionForm.hidden) {
    transFormShowHideBtn.children[0].classList.add("hide")
    transFormShowHideBtn.children[0].classList.remove("add")
  } else {
    transFormShowHideBtn.children[0].classList.add("add")
    transFormShowHideBtn.children[0].classList.remove("hide")
  }

}

window.onload = () => {

  if (isUser()) {
    displayUserName();
    welcomeMsg.hidden = true;
    userNameForm.hidden = true;
    controlsCont.classList.remove("hidden");
    !isUserData() && localStorage.setItem("userData", JSON.stringify(sortUserData(testUserData)));
  }

  if (isUserEntry()) {displayEntries()};
}

/** --------  END Display & Page Controls -------- */