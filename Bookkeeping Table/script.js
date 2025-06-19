const welcomeMsg = document.getElementById('welcome-msg');
const userNameForm = document.getElementById('user-name-form');
const clearUserNameBtn = document.getElementById('clear-user-name-btn');
const cancelUserNameEditBtn = document.getElementById("cancel-user-name-edit-btn");
const controlsCont = document.getElementById('controls-container');
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
const headings = ["Date", "Description", "Amount", "Category", "Vendor", "Notes", "Budget"]
const testUserEntry = [
  {
    date: '2025-05-23',
    description: "description",
    amount: "50",
    isDeposit: "false",
    category: 'Food',
    vendor: 'Grocery Store',
    amount_split: '$25',
    category_split_1: 'Food',
    vendor_split_1: 'Grocery Store',
    amount_split_1: '$25',
    isBudget: "false",
    notes: "notes"
  }
]
let userMsg = []
let addElementIndex = 0;

/** --------  START User Entry Handling -------- */

function displayEntries() {
  spreadsheetCont.innerHTML = "";
  displayTableHead();
  let userEntries = getUserEntries()
  
  userEntries.forEach((entryObj, index) => {
    spreadsheetCont.innerHTML += `<tbody id="entry-${index}"><tr></tr></tbody>`
    const container = document.getElementById(`entry-${index}`)
    const row = container.children[0]
    const splitRows = container.children
    let isDeposit = false
    let isSplit = false
    const splitAmounts = []
    const splitCats = []
    const splitVends = []
    let splitNote = ""
    let isBudget = true  //create a function to show the remaining budget amount 

      //Set booleans
    for (const [key, value] of Object.entries(entryObj)) {

      if (key.includes("isBudget")) {
        isBudget = (value === "true" ? true : false)
      }

      if (key.includes("isDeposit")) {
        isDeposit = (value === "true" ? true : false)
      }
      
      if (key.includes("split")) {
        isSplit = true;
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

      //Display basic data
    for (const [key, value] of Object.entries(entryObj)) {

      if (!(isSplit)) {
        if (!(key.includes("isDeposit")) && !(key.includes("isBudget"))) {
        row.innerHTML += `
          <td>
            <span id="${value.replace(idRegEx, "-")}-${index}" class="table-data ${value.includes("$") ? "currency" : ""}">${value}</span>
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
    if (isSplit) {row.innerHTML += `<td colspan="2"><span class="split-category">Split</span></td>`}

    for (let i = 0; i < splitRows.length; i++) {
      if (i > 0) {splitRows[i].innerHTML += `<td class="placeholder"></td><td class="placeholder"></td>`}
    }

    splitAmounts.forEach((val, index) => {
      splitRows[index + 1].innerHTML += `<td><span class="split-value currency">${val}</span></td>`
    })

    splitCats.forEach((val, index) => {
      splitRows[index + 1].innerHTML += `<td><span class="split-value">${val}</span></td>`
    })

    splitVends.forEach((val, index) => {
      splitRows[index + 1].innerHTML += `<td><span class="split-value">${val}</span></td>`
    })

    splitRows[0].innerHTML += `<td><span>${splitNote}</span></td>`;

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

function displayTableHeadings() {
  const headRow = document.getElementById('table-head-row')
  
  headings.forEach((val) => {
    headRow.innerHTML += `<th id="${val.toLowerCase()}">${val}</th>`
  })
}

function displayTableHead() {
  if (!document.getElementById('table-head')) {
    spreadsheetCont.innerHTML += `<thead id="table-head"><tr id="table-head-row"></tr></thead>`
  }
  displayTableHeadings()
}

function saveUserEntry(arr) {localStorage.setItem('userEntries', JSON.stringify(arr))}

function isUserEntry() {return(localStorage.getItem('userEntries') ? true : false)}

function getUserEntries() {return(isUserEntry() ? JSON.parse(localStorage.getItem('userEntries')) : [])}

/** --------  END User Entry Handling -------- */
/** --------  START User Data Handling -------- */

function isDataChanged(newData) {
  let isChange = false
  let existData = getUserData()

  if (newData.length === existData.length) {

    sortUserData(newData).forEach((newDataObj, index) => {
      let existDataObj = existData[index]

      if (!(existDataObj.id === newDataObj.id)) {isChange = true}
      if (!(existDataObj.category === newDataObj.category)) {isChange = true}
      if (!(existDataObj.vendor.length === newDataObj.vendor.length)) {
        isChange = true
      } else {
        newDataObj.vendor.forEach((val, index) => {
          if (!(val === existDataObj.vendor[index])) {isChange = true}
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

function orderUserObjs(arr, data) {
  //arr should be a sorted array of categories
  // data should be the user data from the form entry
  let newData = []

  arr.forEach((cat) => {
    data.forEach((dataObj) => {
      if (dataObj.category === cat) {
        newData.push(dataObj)
      }
    })
  })

  return(newData)
}

function getUserCats(data) {
  //data should be an array of objects
  let cats = []

  data.forEach((catObj) => {
    cats.push(catObj.category)
  })

  return(cats)
}

function sortUserData(data) {
  //data should be an array of objects

  let ordered = [...getUserCats(data).sort()]
  const newData = orderUserObjs(ordered, data)

  newData.map((dataObj, index) => {
    dataObj.id = index
  })

  return(newData)
}

function isUserData() {return(localStorage.getItem('userData') ? true : false)}

function getUserData() {return(JSON.parse(localStorage.getItem('userData')))}

function clearAllData() {
  if (confirm("Are you sure you want to DELETE all data? This is a DESTRUCTIVE action and cannot be undone.")) {
    localStorage.clear();
    window.location.reload();
  }
}

/** --------  END User Data Handling -------- */
/** --------  START User Name Handling -------- */

function clearName() {
  if(confirm(`Are you sure you want to delete your saved name: ${getUserName()}?`)) {
    localStorage.removeItem("userName")
    window.location.reload()
  } else {
    ifUserToggle()
  }
}

function getUserName() {return(isUser() ? localStorage.getItem("userName") : null)}

function isUser() {return(localStorage.getItem("userName") ? true : false)}

function setUserName(dataArr) {localStorage.setItem("userName", dataArr[0][1])}

function displayUserName() {isUser() ? document.getElementById('user-name-span').textContent = `${getUserName()}'s` : null}

/** --------  END User Name Handling -------- */
/** --------  START Form Data Handling -------- */

function dataExists(value, catVend) {
  //  takes a value of a new category entry or a new vendor entry, 
  //  and a catVend of either "cat" or "vend"
  //  returns a boolean

  let exists = false;

  if (catVend === "cat") {
    getUserData().forEach((dataObj) => {
      if (dataObj.category === value) {
        exists = true;
      }
    })
  } else if (catVend === "vend") {
    getUserData().forEach((dataObj) => {
      dataObj.vendor.forEach((name) => {
        if (value === name) {
          exists = true;
        }
      })
    })
  }

  return(exists)
}

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

function processTransData(newDataArr) {
  const existEntries = getUserEntries()
  let newEntry = {}

  newDataArr.forEach((entry) => {
    let key = entry[0]
    let value = entry[1]
    newEntry[key] = value
  })

  existEntries.push(newEntry)
  saveUserEntry(existEntries)
}

function delVend(button) {
  const name = button.parentNode.getAttribute('name') 
  const vendor = name.substring(name.indexOf("-") + 1, name.indexOf("_"))
  const category = name.slice(name.indexOf("-", name.indexOf("_")) + 1)
  let existData = getUserData();

  existData.map((dataObj) => {
    if (dataObj.category === category) {
      dataObj.vendor.splice(dataObj.vendor.indexOf(vendor), 1)
      userMsg.push(`The vendor: [${vendor}], has been deleted`)
    }
  })
  saveUserData(existData)
  delParNode(button)
  displayUserMsg()
}

function editVendorData(newDataArr) {
  let existData = getUserData()
  
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
            dataObj = {...dataObj, vendor: [...dataObj.vendor].splice(dataObj.vendor.indexOf(oldVendName), 1)}
          }
          if (dataObj.category === newVendCat) {
            userMsg.push(`The vendor: [${newVendName}], has been added to the category: [${newVendCat}]`)
            dataObj = {...dataObj, vendor: [...dataObj.vendor, newVendName]}
          }
        })
        
        //  Category is NOT changed but vendName is
      } else if (oldVendCat === newVendCat && !(oldVendName === newVendName)) {
        existData.map((dataObj) => {
          if (dataObj.category === oldVendCat) {
            userMsg.push(`The vendor: [${oldVendName}], has been changed to: [${newVendName}]`)
            dataObj = {...dataObj, vendor: [...dataObj.vendor.splice(dataObj.vendor.indexOf(oldVendName), 1, newVendName)]}
          }
        })
      }
    }
  })
  
  return existData
}

function addVendorData(newDataArr) {
  let existData = getUserData()
  let newData = []

  newDataArr.forEach((entryArr, index) => {
    let entryType = entryArr[0]
    
    if (entryType.includes('addVendor') && !(entryType.includes('addVendor-cat'))) {
      let newVendor = entryArr[1]
      let newVendCat = newDataArr[index + 1][1]

      if (dataExists(newVendor, "vend")) {
        userMsg.push(`The vendor: [${newVendor}] already exists. Please choose another vendor or account name.`)
      } else {
        existData.forEach((dataObj) => {
          if (dataObj.category === newVendCat) {
            let newDataObj = {...dataObj, vendor: [...dataObj.vendor, newVendor]}
            userMsg.push(`The vendor: [${newVendor}] was added to the category: [${newVendCat}]`)
            newData.push(newDataObj)
          } else {
            newData.push(dataObj)
          }
        })
      }
    }
  })
  
  return newData
}

function processVendData(newDataArr) {
  const entryType = newDataArr[0][0]
  let newData

  if (entryType.includes("addVendor")) {
    newData = addVendorData(newDataArr)
  } else if (entryType.includes("edit_vendor")) {
    newData = editVendorData(newDataArr)
  }
  console.log(newData)

  saveUserData(newData)
}

function addCatData(arr) {
  const existData = getUserData();

  arr.forEach((entry) => {
    const category = entry[1]

    if (!dataExists(category, "cat")) {
      existData.push({id: "x", category: category, vendor: []})
      userMsg.push(`Added new category: ${category}`)
    }
  })
  return(existData)
}

function delCat(button) {
  const cat = button.parentNode.children.item(0).children.item(0).value
  let existData = getUserData()

  existData.map((dataObj, index) => {
    if (dataObj.category === cat) {
      existData.splice(index, 1)
      userMsg.push(`The Category: [${cat}], was deleted`)
    }
  })

  if (existData.length === 0) {
    localStorage.removeItem("userData")
    userMsg.push("All categories have been deleted.", "Categories have been reset.")
    forceCatToggle()
  } else {
    saveUserData(existData)
  }

  delParNode(button)
  displayUserMsg()
  populateSelects()
}

function editCatData(formEntryDataArr) {
  let existData = getUserData()
  let newData = []

  formEntryDataArr.forEach((entry) => {
    const prevName = entry[0].slice(entry[0].indexOf("-") + 1)
    const newName = entry[1]

    if (!(prevName === newName)) {
      existData.map((catObj) => {
        if (catObj.category === prevName) {
          userMsg.push(`Category [${prevName}] changed to: ${newName}`)
          newData.push({...catObj, category: newName})
        }
      })
    } else if (prevName === newName) {
      existData.map((catObj) => {
        if (catObj.category === prevName) {
          newData.push(catObj)
        }
      })
    }
  })
  
  return(newData)
}

function processCatData(dataArr) {
  const entryName = dataArr[0][0]
  let newData

  if (entryName.includes("addCategory")) {
    newData = addCatData(dataArr)
  } else if (entryName.includes("edit_cat")) {
    newData = editCatData(dataArr)
  }

  saveUserData(newData)
}

function handleFormData(dataArr, formName) {
  if (formName === "user-name-form") {
    setUserName(dataArr)
    window.location.reload()
  } else if (formName === "category-form") {
    processCatData(dataArr)
  } else if (formName === "vendor-form") {
    processVendData(dataArr)
  } else if (formName.includes("transaction")) {
    processTransData(dataArr)
  }
}

function pageReset(element) {
  let form

  if (element.name === "cancel-transaction" ) {
    form = element.parentNode.parentNode
  } else {
    form = element
  }

  form.reset()

  if (form.name.includes("category")) {
    forceCatToggle()
  } else if (form.name.includes("vendor")) {
    forceVendToggle()
  } else if (form.name.includes("transaction")) {
    forceTransToggle()
    const delBtns = [...document.getElementsByClassName("btn del-btn")]
    delBtns.forEach((btn) => {btn.click()})
  }

  displayUserMsg()
}

function getFormEntries(form) {
  const newDataArr = Array.from(new FormData(form).entries())
  if (newDataArr.length === 0) {
    pageReset(form)

  } else {
    if (form.name.includes('transaction') && isSplitTransaction(newDataArr)) {
      if (isSplitBalanced()) {
        handleFormData(newDataArr, form.name)
        pageReset(form)
        displayEntries()

      } else {
        alert("The sum of the Split Amounts must equal the Total Transaction Amount")
      }

    } else {
      handleFormData(newDataArr, form.name)
      pageReset(form)
      populateSelects()
      displayEntries()
    }
  }
}

/** --------  END Form Data Handling -------- */
/** --------  START User-Message Handling -------- */

function delParNode(element) {element.parentNode.remove()}

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

/** --------  END User-Message Handling -------- */
/** --------  START Display & Page Controls -------- */

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

  //  -- START Transaction Form --
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

function formatNum(num) {
  let array = Array.from(num.toString());
  let int = (array.length > 1 ? array.slice(0, -2) : []); 
  let dec = (array.length > 1 ? array.slice(-2) : [0, ...array]); 
  let formatted = ""
  
  for (let i = (int.length - 3); i > 0; i = i - 3) {
    int.splice(i, 0, ",")
  }

  int.forEach((val) => {formatted += val})
  formatted += "."
  dec.forEach((val) => {formatted += val})
  
  return (formatted)
}

function stringNumToInt(strNum) {return((strNum.replace(numRegEx, "") * 100))}

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

    splitTransMsg.textContent = (remAmount === 0 ? "Split is balanced" : `Split amount remaining: $${formatNum(remAmount)}`);

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
  
  el.textContent = "Add another split"
  populateSelects()
  splitSum()
  addAmountListener()
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

function forceTransToggle() {
  document.getElementById('transaction-show-hide-btn').click(); 
}

function toggleTransactionForm(element) {
  !categoryForm.hidden && forceCatToggle();
  !vendorForm.hidden && forceVendToggle();
  !userNameForm.hidden && toggleUserNameForm();
  transactionForm.hidden = (transactionForm.hidden ? false : true)
  element.children[0].textContent = (transactionForm.hidden ? "Add a transaction" : "Hide transaction form")

  if (!transactionForm.hidden) {
    element.children[0].classList.add("hide")
    element.children[0].classList.remove("add")
  } else {
    element.children[0].classList.add("add")
    element.children[0].classList.remove("hide")
  }

  !transactionForm.hidden && populateSelects();
  addAmountListener()
}

  //  -- END Transaction Form --
  //  -- START Vendor Form --

function dispMorAddVend(button) {
  addElementIndex++
  button.insertAdjacentHTML("beforebegin", `
    <div>
      <label>New Vendor Name: <input name="addVendor" placeholder="e.g. Your Favorite Store" required></label>
      <label for="add-vendor-cat-${addElementIndex}">in Category: </label>
      <select id="add-vendor-cat-${addElementIndex}" name="addVendor-cat" value="">
        <option value="" disabled selected>-- Please choose an existing category --</option>
      </select>
      <button class="btn del-btn" type="button" onclick="delParNode(this)">X</button>
    </div>
  `)
  populateSelects()
}

function displayAddVendors(cont) {
  const addHTML = `
    <div>
      <label>New Vendor Name: <input name="addVendor" placeholder="e.g. Your Favorite Store" required></label>
      <label for="add-vendor-cat-${addElementIndex}">in Category: </label>
      <select id="add-vendor-cat-${addElementIndex}" name="addVendor-cat" value="">
        <option value="" disabled selected>-- Please choose an existing category --</option>
      </select>
      <button class="btn del-btn" type="button" onclick="delParNode(this)">X</button>
    </div>
  `;

  cont.innerHTML += addHTML + `<button id="add-vendor-btn" type="button" class="btn add-btn" onclick="dispMorAddVend(this)" >Add another vendor</button>`
}

function displayVendors(prop) {
  // takes a prop of either "show", "add", or "edit"
  
  vendorContainer.innerHTML = "";
  vendorContainer.innerHTML += `<h4>Existing Vendors & Accounts:</h4><ul id="exist-vendors"></ul>`;
  const vendList = document.getElementById('exist-vendors');
  
  getUserData().forEach((dataObj, catIndex) => {
    // displays the categories

    let category = dataObj.category
    let catId = dataObj.id
    let HTML = `<ul id="exist-cat-${catId}-vendors">${category}</ul>`

    if (prop === "show") {
      vendList.innerHTML += HTML
    } else if (prop === "add") {
      vendList.innerHTML += HTML
    } 

    dataObj.vendor.forEach((name, vendIndex) => {
      // displays the vendors

      let listEl = document.getElementById(`exist-cat-${catId}-vendors`)
      let innerHTML = `<li>${name}</li>`
      let editHTML = `
        <li name="vendor-${name}_category-${category}">
          <label>Existing vendor name: <input name="edit_vendor-${name}" value="${name}"></label>
          <label for="edit-vendor-${vendIndex}-cat-${catIndex}">Change existing category? </label>
          <select id="edit-vendor-${vendIndex}-cat-${catIndex}" name="edit_vendor_cat-${category}"><option value="" disabled>-- Please choose an existing category --</option></select>
          <button class="btn del-btn" type="button" onclick="delVend(this)">X</button>
        </li>
      `;

      if (prop === "show") {
        listEl.innerHTML += innerHTML
      } else if (prop === "add") {
        listEl.innerHTML += innerHTML
      } else if (prop === "edit") {
        vendList.innerHTML += editHTML
      } 
    })
  })

  if (prop === "add") {
    displayAddVendors(vendorContainer)
  }
  
  populateSelects()
}

function vendSelectControl() {
  const selector = document.getElementById('edit-vendor-selector')
  selector.value="";
  displayVendors("show")

  selector.addEventListener("change", () => {
    if (selector.value === "") {
      displayVendors("show")
    }
    if (selector.value === "addVendor") {
      displayVendors("add")
    }
    if (selector.value === "editVendors") {
      displayVendors("edit")
    }
  })
}

function forceVendToggle() {document.getElementById('vendor-form-show-hide-btn').click()}

function toggleVendorForm(element) {
  !categoryForm.hidden && forceCatToggle()
  !transactionForm.hidden && forceTransToggle();
  !userNameForm.hidden && toggleUserNameForm();
  vendorForm.hidden = (vendorForm.hidden ? false : true)
  element.textContent = (vendorForm.hidden ? "Edit Vendors" : "Hide Vendor Form")
  !vendorForm.hidden && vendSelectControl()
}
  //  -- END Vendor Form --
  //  -- START Category Form --

function displayCats(prop) {
  // takes a prop of either "show", "add", or "edit"

  categoryContainer.innerHTML = "";
  categoryContainer.innerHTML += `<h4>Existing Categories:</h4><ul id="exist-cats"></ul>`;
  const catList = document.getElementById('exist-cats');

  if (prop === "add") {
    const addHTML = `      
      <div>
        <label>
          New category name: 
          <input name="addCategory" type="text" placeholder="e.g. Gifts" required />
        </label>
        <button class="btn del-btn" type="button" onclick="delParNode(this)">X</button>
      </div>
    `;

    categoryContainer.insertAdjacentHTML("beforeend", addHTML + `
      <button class="btn add-btn" id="add-cat-btn" type="button">Add another category</button>`)

    document.getElementById('add-cat-btn').addEventListener("click", (e) => {
      e.target.insertAdjacentHTML('beforebegin', addHTML)
    })    
  }

  getUserData().forEach((dataObj) => {
    const editHTML = `
      <li>
        <label>Edit Category [${dataObj.category}]: 
          <input name="edit_cat-${dataObj.category}" value="${dataObj.category}" required>
        </label>
        <button class="btn del-btn" type="button" onclick="delCat(this)">X</button>
      </li>
    `;
    const showHTML = `<li>${dataObj.category}</li>`

    if (prop === "show") {
      catList.insertAdjacentHTML("beforeend", showHTML)
    } else if (prop === "edit") {
      catList.insertAdjacentHTML("beforeend", editHTML)
    } else if (prop === "add") {
      catList.insertAdjacentHTML("beforeend", showHTML)
    }
  })  
}

function catSelectControl() {
  const selector = document.getElementById('edit-category-selector')
  selector.value = "";
  displayCats("show");

  selector.addEventListener("change", () => {
    if (selector.value === "") {
      displayCats("show")
    }
    if (selector.value === "addCategory") {
      displayCats("add")
    }
    if (selector.value === "editCategories") {
      displayCats("edit")
    }
  })
}

function forceCatToggle() {document.getElementById('category-form-show-hide-btn').click()}

function toggleCatForm(element) {
  !vendorForm.hidden && forceVendToggle()
  !userNameForm.hidden && toggleUserNameForm();
  !transactionForm.hidden && forceTransToggle();
  categoryForm.hidden = (categoryForm.hidden ? false : true)
  element.textContent = (categoryForm.hidden ? "Edit Categories" : "Hide Category Form")
  !categoryForm.hidden && catSelectControl()
}
  //  -- END Category Form --
  //  -- START User Name Form --

function toggleUserNameForm() {
  cancelUserNameEditBtn.hidden = false;
  clearUserNameBtn.hidden = false;
  !categoryForm.hidden && forceCatToggle();
  !vendorForm.hidden && forceVendToggle();
  !transactionForm.hidden && forceTransToggle();

  ifUserToggle();
}

function ifUserToggle() {
  welcomeMsg.hidden = (isUser() ? true : false);
  userNameForm.hidden = !userNameForm.hidden;
  controlsCont.hidden = !controlsCont.hidden;
}
  //  -- END User Name Form --

window.onload = () => {
  if (!isUserData()) {localStorage.setItem("userData", JSON.stringify(sortUserData(testUserData)))}

  if (isUser()) {
    displayUserName()
    ifUserToggle()
  } 

  if (isUserEntry()) {displayEntries()}
}

/** --------  END Display & Page Controls -------- */