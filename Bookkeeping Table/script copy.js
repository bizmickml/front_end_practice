const submitMsgEl = document.getElementById('user-msg-container')
const editCategorySelect = document.getElementById("edit-category-selector")
const editVendorSelect = document.getElementById("edit-vendor-selector")
const userTestData = [
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
const testDataArr = [
  ['newCategory', 'Gifts'],
  ['newCategory', 'zero'],
  ['newVendor', 'Phone Company'],
  ['newVendor_cat', 'Utilities'],
  ['newVendor', 'Groceries'],
  ['newVendor_cat', 'Food']
]
const idRegEx = (val) => {
  let newVal = val.toLowerCase().replace(/[&\s-'"\.\)\(]*/g, "")
  return (newVal.replace(/\//, "_"))
}

class User {
  constructor() {
    this.name = ""
  }

  saveUserData(newData) {
    localStorage.setItem("userData", JSON.stringify(this.sortData(newData)));
  }

  sortData(userData) {
    let sorted = []
    let categories = []

    for (let i = 0; i < userData.length; i++) {
      categories.push(userData[i].category)
    }

    for (let j = 0; j < categories.length; j++) {
      for (let k = 0; k < userData.length; k++) {
        if (userData[k].category === categories.sort()[j]) {
          const newDataObj = {...userData[k], vendor: userData[k].vendor ? userData[k].vendor.sort() : []}
          sorted.push(newDataObj)
        }
      }
    }

    return(
      sorted.map((dataObj, index) => {
        return({...dataObj, id: index})
      })
    )
  }

  getData() {
    if (localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData")).length > 0) {
      /* console.log(JSON.parse(localStorage.getItem("userData"))) */
      return(JSON.parse(localStorage.getItem("userData")))
    } else {
      /* console.log(sortUserData(userTestData)) */
      return(this.sortData(userTestData))
    }
  }

  clearUser() {
    if (confirm(`Are you sure you want to delete your current name: ${this.name}?`)) {
      localStorage.removeItem("userName");
      window.location.reload()
    }
  }

  ifUserToggle() {
    //toggles visibility between controls container and user name form

    const userNameForm = document.getElementById('user-name-form');
    const controlsContainer = document.getElementById('controls-container');

    if (userNameForm.hidden) {
      userNameForm.hidden = false;
      controlsContainer.hidden = true;
    } else {
      userNameForm.hidden = true;
      controlsContainer.hidden = false;
    }
  }

  getUserName() {
    if (localStorage.getItem("userName")) {
      this.name = localStorage.getItem("userName")
      document.getElementById('welcome-msg').hidden = true;
      document.getElementById('user-name-span').textContent = `${localStorage.getItem("userName")}'s`;
      document.getElementById('user-name-submit-btn').textContent = "Update Name";  
      document.getElementById('clear-name-btn').hidden = false;
      document.getElementById('cancel-edit-name-btn').hidden = false;
      this.ifUserToggle();
    }
  }

  setUserName() {
    const userName = document.getElementById('user-name-input').value;
  
    if (userName === "") {
      alert("Please enter a valid name.")
    } else if (userName === localStorage.getItem("userName")) {
      alert("The name you entered already exists. Please make a change or cancel.")
    } else {
      localStorage.setItem("userName", userName);
      this.getUserName();  
    }
  }

}

class Controls {
  constructor() {}

  addInputsBtn(element) {
    const el = element.parentNode.parentNode
    const elId = el.id
    controls.displayAddInputs(el, elId.includes("cat") ? "cat" : "vend")
  }

  displayEditInputs(element, catVend) {
    element.innerHTML = "";
    element.hidden = false;

    user.getData().map((catObj) => {

      if (catVend === "cat") {
        element.insertAdjacentHTML("beforeend", `
          <li>
              <input id="cat-${catObj.id}" name="category_${catObj.id}-${catObj.category}" value="${catObj.category}"/>
              <button class="del-btn">Delete</button>
          </li>
        `);

      } else if (catVend === "vend") {
        catObj.vendor.forEach((name) => {
          element.insertAdjacentHTML("beforeend", `
            <li>
              <label>
                Category: 
                <select name="vendor_category-${catObj.category}"></select>
                Vendor: 
                <input id="vend-${catObj.id}" name="vendor_${catObj.category}-${name}" value="${name}"/>
              </label>
              <button class="del-btn">Delete</button>
            </li>
          `);

          const selects = [...document.getElementsByName(`vendor_category-${catObj.category}`)]
          selects.forEach((selEl) => {controls.displayUserData(selEl, "cat", "select")})
          const options = [...document.querySelectorAll("option")]
          options.forEach((option) => {
            if (option.parentNode.name.includes(`${option.value}`)) {
              option.selected = true;
            }
          })
        }) 
      }
    })

    const deleteBtns = [...document.getElementsByClassName("del-btn")]
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.target.parentNode.remove();
      })
    })

  }

  displayAddInputs(element, catVend) {
    element.hidden = false;
    const inputsHTML = `
      <li>
        ${catVend === "cat" ? `<label>New Category Name: <input required name="newCategory" type="text" placeholder="e.g. Gifts"></label>` 
          : `<label>
              New Vendor or Account Name: 
              <input required name="newVendor" type="text" placeholder="e.g. Phone Company">
              in Category: 
              <select name="newVendor_cat"></select>
            </label>`
        }
        <button type="button" onclick="this.parentNode.remove()" class="del-btn">delete</button>
      </li>
    `;
    const addBtnHTML = `
      <li>
        <button type="button" onclick="controls.addInputsBtn(this)" class="add-input-btn">Add another ${catVend === "cat" ? "category" : "vendor"}</button>
      </li>
    `;

    if ([...element.querySelectorAll("li")].length === 0) {
      element.insertAdjacentHTML("afterbegin", inputsHTML + addBtnHTML)

    } else {
      element.insertAdjacentHTML("afterbegin", inputsHTML)
    }

    const selectElmts = [...document.getElementsByName('newVendor_cat')]
    selectElmts.forEach((el) => {
      this.displayUserData(el, "cat", "select")
    })

  }

  masterSheetToggle() {
    const masterSheetForm = document.getElementById('master-sheet-form');
    const masterShowHideBtn = document.getElementById('master-sheet-show-hide-btn');
    const catList = document.getElementById('exist-category-list')
    const vendList = document.getElementById('exist-vendors-list')
    
    controls.displayUserData(catList, "cat", "ul");
    controls.displayUserData(vendList, "vend", "ul");

    if (masterSheetForm.hidden) {
      masterSheetForm.hidden = false;
      masterShowHideBtn.textContent = "Cancel Master Edit";
    } else if (!masterSheetForm.hidden) {
      masterSheetForm.hidden = true;
      masterShowHideBtn.textContent = "Edit Master Sheet";
    }
  }

  displayUserData(element, catVend, elType) {
    //takes an element to display in, "cat" or "vend", type of element to display in
    element.innerHTML = "";
  
    user.getData().map((catObj) => {
      let HTML

      if (catVend === "cat") {

        if (elType === "ul") {
          HTML = `<li>${catObj.category}</li>`
        } else if (elType === "select") {
          HTML = `<option value=${catObj.category}>${catObj.category}</option>`
        }
        element.insertAdjacentHTML("beforeend", HTML)

      } else if (catVend === "vend") {

        if (elType === "ul") {
          element.insertAdjacentHTML("beforeend", `<label>${catObj.category}<ul id="${idRegEx(catObj.category)}-vendor-list"></ul></label`)
          catObj.vendor.forEach((name) => {
            document.getElementById(`${idRegEx(catObj.category)}-vendor-list`).insertAdjacentHTML("beforeend", `<li>${name}</li>`)
          })
        }
      }
    })

  }
  
  clearContainer(element) {
    element.hidden = true;
    element.innerHTML = "";
  }

  clearUserData() {
    if (confirm("Are you sure you want to clear all data? This is a destructive action and cannot be undone")) {
      localStorage.clear();
      window.location.reload();
    }
  }
}

class FormSubmission {
  constructor(form) {
    this.existUserData = user.getData()
    this.formData = new FormData(form)
    this.newCategories = this.formData.getAll("newCategory")
    this.newVendors = this.formData.getAll("newVendor")
    this.newVendorCats = this.formData.getAll("newVendor_Cat")
    this.newDataArr = Array.from(new FormData(form))
    this.isCat = false
    this.userMsg = []
    this.existCats = []
    this.existVends = []
    this.newCats = []
    this.newVends = []
  }

  processData(form) {
    if (editCategorySelect.value === "addCategory") {
      //process new categories

      this.newCategories.forEach((value) => {
        this.addNewCategory(value)
      })
    } else if (editCategorySelect.value === "editCategories") {
      //process changes
    } else {
      this.userMsg.push("No changes were made to the Categories")
    }

    if (editVendorSelect.value === "addVendor") {
      //process new vendors

      this.newVendors.forEach((value) => {
        this.addNewVendor(value)
      })
    } else if (editVendorSelect.value === "editVendors") {
      //process changes
    } else {
      this.userMsg.push("No changes were made to the Vendors")
    }

    this.newDataArr.map((entryArr, index) => {
      const name = entryArr[0]
      const value = entryArr[1]
      if (name === "newCategory") {
        
      } else if (name === "newVendor") {
        this.addNewVendor(value, index)
      } else if (name.includes("category") && !(name.includes("vendor"))) {
        this.alterCategory(name, value)
      } else if (name.includes("vendor_category")) {
        this.alterVendor(name, value, index)
      }
    })
    
    user.saveUserData(this.existUserData)
    this.displayUserMsg()
    this.resetForm(form)
  }

  resetForm(form) {
    const event = new Event('change')
    const selectors = [...document.getElementById("master-sheet-form").querySelectorAll('select')]
    form.reset()
    
    selectors.forEach((sel) => {
      if (sel.id) {
        sel.dispatchEvent(event)
      }
    })

    controls.masterSheetToggle;

  }

  alterVendor(name, value, index) {
    const oldVendCat = name.slice(name.indexOf("-") + 1)
    const newVendCat = value
    const oldVendName = this.newDataArr[index + 1][0].slice(this.newDataArr[index + 1][0].indexOf("-") + 1)
    const newVendName = this.newDataArr[index + 1][1]

    if (oldVendCat === newVendCat && oldVendName === newVendName) {
      // NO Changes
      return
    } else if (oldVendCat === newVendCat && !(oldVendName === newVendName)) {
      // Cat is same, vendor changed

      this.existUserData.map((dataObj) => {
        if (dataObj.category === oldVendCat) {
          dataObj.vendor.splice((dataObj.vendor.indexOf(`${oldVendName}`)), 1)
          dataObj.vendor.push(newVendName)
          this.userMsg += `<p>The Vendor name: ${oldVendName} in the Category: ${oldVendCat} has been changed to: ${newVendName}</p>`
        }
      })
    } else if (!(oldVendCat === newVendCat)) {
      //Cat changed, vendor did not, or both changed

      this.existUserData.map((dataObj, index) => {
        if (dataObj.category === oldVendCat) {
          dataObj.vendor.splice((dataObj.vendor.indexOf(`${oldVendName}`)), 1)
        }
        if (dataObj.category === newVendCat) {
          dataObj.vendor.push(newVendName)
        }
        this.userMsg += `<p>The Vendor name: ${oldVendName} has been removed from Category: ${oldVendCat} and the ${oldVendName === newVendName ? null : "new"} Vendor name: ${newVendName} has been added to the Category: ${newVendCat}</p>`
      })
    }
  }

  alterCategory(name, value) {
    const oldCat = name.slice(name.indexOf("-") + 1)
    const newCat = value

    if (oldCat === newCat) {
      return
    } else {
      this.existUserData.forEach((dataObj) => {
        if (dataObj.category === oldCat) {
          dataObj.category = newCat
          this.userMsg += `<p>The Category: "${oldCat}" was changed to: "${newCat}"</p>`
        }
      })
    }
  }

  addNewVendor(newVendor, index) {
    //add inputs are required, so we don't need to check for empties.
    const newVendorCat = this.newDataArr[index + 1][1]

    this.existUserData.forEach((dataObj) => {
      if (dataObj.category === newVendorCat) {
        dataObj.vendor = [...dataObj.vendor, newVendor]
        this.userMsg += `<p>The Vendor name: "${newVendor}" was added to the Category: "${newVendorCat}"</p>`
      }
    })
  }

  addNewCategory(value) {
    //add inputs are required, so we don't need to check for empties.
    this.existUserData.forEach((dataObj) => {
      if (dataObj.category === value) {
        this.isCat = true;
      } 
    })

    if (this.isCat) {
      this.userMsg.push `The Category: "${value}" already exists. No category was added`
    } else {
      this.existUserData.push({id: "", category: value, vendor: []})
      this.userMsg.push `The category: "${value}" was added to the category list`
    }
  }
  
  delCategory() {
    /**
     * Which category got deleted?
     * iterate over the newDataArr
     * push the number that is in the name value to an array
     * iterate over the existUserData array
     * push the number that is in the id value to an array
     * compare the two arrays
     * find which number is missing from the newIdNums and delete the object with that Id from the existUserData array
     * NOTE: it could be more than one.
     */
    const newIdNums = []
    const existIdNums = []
    const idNumsToDel = []
    
    this.newDataArr.forEach((entryArr) => newIdNums.push(entryArr[0][entryArr[0].indexOf("_") + 1]))
    this.existUserData.forEach((dataObj) => existIdNums.push(dataObj.id))

    for (let i = 0; i < existIdNums.length; i++) {
      while (!(newIdNums[i] == existIdNums[i])) {
        idNumsToDel.push(existIdNums[i])
        existIdNums.splice(i, 1)
      }
    }
    
    idNumsToDel.forEach((num) => {
      this.existUserData.map((dataObj, index) => {
        if (dataObj.id == num) {
          this.existUserData.splice(index, 1)
        }
      })
    })
  
  }

  isVendDel() {
    return(this.newVends.length <= this.existVends.length)
  }

  isCatDel() {
    return(this.newCats.length <= this.existCats.length)
  }

  getNewCatsAndVends() {
    this.newDataArr.forEach((dataEntry) => {
      const name = dataEntry[0]
      const value = dataEntry[1]
      if (name === "newCategory" || name.includes("newVendor")) {

      } else if (name.includes("category") && !(name.includes("vendor"))) {
        this.newCats.push(value)
      } else if (name.includes("vendor") && !(name.includes("category"))) {
        this.newVends.push(value)
      }
    })
  }

  getExistCatsAndVends() {

    this.existUserData.forEach((dataObj) => {
      this.existCats.push(dataObj.category)

      dataObj.vendor.forEach((vendName) => {
        this.existVends.push(vendName)
      })
    })
  }

  displayUserMsg() {
    controls.clearContainer(submitMsgEl)
    submitMsgEl.hidden = false;
    const paragraphs = [...submitMsgEl.querySelectorAll("p")]
    if (paragraphs.length > 0) {
      this.userMsg += `<p>Click the "Edit Master Sheet" button to view changes</p>`
    } else {
      this.userMsg += `<p>No changes have been made</p>`
    }
  }
}

const controls = new Controls;
const user = new User;
let formSubmission

function createNewFormSub(form) {
  formSubmission = new FormSubmission(form)
  formSubmission.processData(form)
}
// Master Sheet
function handleMastFormSubmit(form) {

  const existData = user.getData()
  const dataArr = Array.from(new FormData(form));
  const submitMsgEl = document.getElementById('user-msg-container');
  controls.clearContainer(submitMsgEl)


  dataArr.map((entryArr, index) => {

    if (entryArr[0] === 'newCategory') {
      let isCat = false;

      existData.forEach((dataObj) => {
        if (dataObj.category === entryArr[1]) {
          isCat = true;
        } 
      })

      if (isCat) {
        submitMsgEl.insertAdjacentHTML("beforeend", `<p>The category: "${entryArr[1]}" already exists. No category was added</p>`) 
      } else {
        existData.push({id: "", category: entryArr[1], vendor: []})
        submitMsgEl.insertAdjacentHTML("beforeend", `<p>The category: "${entryArr[1]}" was added to the category list</p>`)
      }

    } else if (entryArr[0] === 'newVendor') {
      let newVendor = entryArr[1]
      let category = dataArr[index + 1][1]

      existData.forEach((dataObj) => {
        if (dataObj.category === category) {
          dataObj.vendor = [...dataObj.vendor, newVendor]
        }
      })

      submitMsgEl.insertAdjacentHTML("beforeend", `<p>The Vendor name: "${newVendor}" was added to the Category: "${category}"</p>`)

    } else if (entryArr[0].includes('category') && !(entryArr[0].includes('vendor'))) {
      let oldCat = entryArr[0].slice(entryArr[0].indexOf("-") + 1)
      let newCat = entryArr[1]
      
      existData.forEach((dataObj) => {
        if (dataObj.category === oldCat && !(oldCat === newCat)) {
          dataObj.category = newCat
          submitMsgEl.insertAdjacentHTML("beforeend", `<p>The Category: "${oldCat}" was changed to: "${newCat}"</p>`)
        }
      })

    } else if (entryArr[0].includes('vendor_category')) {
      let oldVendCat = entryArr[0].slice(entryArr[0].indexOf("-") + 1)
      let oldVendName = dataArr[index + 1][0].slice(dataArr[index + 1][0].indexOf("-") + 1)
      let newVendCat = entryArr[1]
      let newVendName = dataArr[index + 1][1]
      /**
       * Need options for: 
       * 1. if category changed and vendor did not
       *    - delete vendor from existing category 
       *    - then add the old vendor to the new category
       * 2. if vendor changed and category did not
       *    - change the vendor array to reflect the new data
       * 3. if both changed
       *    - delete vendor from existing category 
       *    - then add the new vendor to the new category 
       *    --- NOTE: this option might require the same code as #1 ----
       */
      if (!(oldVendCat === newVendCat) && oldVendName === newVendName) {
        existData.forEach((dataObj) => {

          if (dataObj.category === oldVendCat) {
            dataObj.vendor.splice(dataObj.vendor.indexOf(`${oldVendName}`), 1)
          }
          
          if (dataObj.category === newVendCat) {
            dataObj.vendor.push(oldVendName)
          }
        })
        submitMsgEl.insertAdjacentHTML("beforeend", `<p>The Vendor: "${oldVendName}" has been moved to the "${newVendCat}" category</p>`)
      } else if (oldVendCat === newVendCat && !(oldVendName === newVendName)) {
        existData.forEach((dataObj) => {

          if (dataObj.category === oldVendCat) {
            dataObj.vendor.splice(dataObj.vendor.indexOf(`${oldVendName}`), 1)
            dataObj.vendor.push(newVendName)
          }
        })
        submitMsgEl.insertAdjacentHTML("beforeend", `<p>The Vendor: "${oldVendName}" has changed to: "${newVendName}"</p>`)
      } else if (!(oldVendCat === newVendCat) && !(oldVendName === newVendName)) {
        existData.forEach((dataObj) => {

          if (dataObj.category === oldVendCat) {
            dataObj.vendor.splice(dataObj.vendor.indexOf(`${oldVendName}`), 1)
          }
          
          if (dataObj.category === newVendCat) {
            dataObj.vendor.push(newVendName)
          }
        })
        submitMsgEl.insertAdjacentHTML("beforeend", `
          <p>Vendor: "${oldVendName}" has been removed from: "${oldVendCat}"</p>
          <p>Vendor: "${newVendName}" has been added to: "${newVendCat}"</p>`)
      }
    }
  })
  submitMsgEl.insertAdjacentHTML("beforeend", `<p>Use the "Edit Master Sheet" button to view changes.</p>`)

  user.saveUserData(existData);
  submitMsgEl.hidden = false;
  form.reset();
  const selectors = [...document.getElementById("master-sheet-form").querySelectorAll('select')]
  const event = new Event('change')
  selectors.forEach((sel) => {
    if (sel.id) {
      sel.dispatchEvent(event)
    }
  })
  controls.masterSheetToggle;
}

editVendorSelect.addEventListener("change", (e) => {
  const vendorList = document.getElementById('exist-vendors-list')
  const addVendorContainer = document.getElementById('add-vendor-container')
  const editVendorContainer = document.getElementById('edit-vendor-container')

  if (e.target.value === "") {
    vendorList.hidden = false;
    controls.clearContainer(addVendorContainer)
    controls.clearContainer(editVendorContainer)
  } else if (e.target.value === "addVendor") {
    vendorList.hidden = false;
    controls.clearContainer(editVendorContainer)
    controls.displayAddInputs(addVendorContainer, "vend")
  } else if (e.target.value === "editVendors") {
    vendorList.hidden = true;
    controls.clearContainer(addVendorContainer)
    controls.displayEditInputs(editVendorContainer, "vend");
  }
})

editCategorySelect.addEventListener("change", (e) => {
  const categoryList = document.getElementById('exist-category-list')
  const addCategoryContainer = document.getElementById('add-category-container');
  const editCategoryContainer = document.getElementById('edit-category-container');

  if (e.target.value === "") {
    categoryList.hidden = false;
    controls.clearContainer(addCategoryContainer)
    controls.clearContainer(editCategoryContainer)
  } else if (e.target.value === "addCategory") {
    categoryList.hidden = false;
    controls.clearContainer(editCategoryContainer)
    controls.displayAddInputs(addCategoryContainer, "cat");
  } else if (e.target.value === "editCategories") {
    categoryList.hidden = true;
    controls.clearContainer(addCategoryContainer)
    controls.displayEditInputs(editCategoryContainer, "cat");
  }
})

// User Name
document.getElementById('cancel-edit-name-btn').addEventListener("click", () => user.ifUserToggle())

document.getElementById('clear-name-btn').addEventListener("click", () => user.clearUser())

document.getElementById('user-name-submit-btn').addEventListener("click", () => user.setUserName())

// Controls
document.getElementById('edit-name-button').addEventListener("click", user.ifUserToggle);

document.getElementById('master-sheet-show-hide-btn').addEventListener("click", controls.masterSheetToggle);

document.getElementById('clear-data-btn').addEventListener("click", controls.clearUserData);

window.onload = () => user.getUserName();