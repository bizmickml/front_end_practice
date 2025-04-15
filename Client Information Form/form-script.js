
const tableHeadRow = document.getElementById('table-head-row');
const table = document.getElementById('contacts-table');
const sortDropdown = document.getElementById('sort-options');
const controlBox = document.getElementById('control-box');
const newContactBtn = document.getElementById('add-new-contact-button');
const sortControl = document.getElementById('sort-controls');

// Each contact will have it's own object using this one as a template
const contactAttributes = [{
  column1: ["Contact ID", 
    {
      cardTitle: "Contact#",
      idNumber: 0,
    }
  ],
  column2: ["Name", 
    {
      cardTitle: "Main Contact",
      fullNameMnCont: "Full:",
      firstNameMnCont: "First:",
      lastNameMnCont: "Last:",
      nickNameMnCont: "Nick Name:",
      pronounciationMnCont: "Pronounciation:"
    }
  ],
  column3: ["Phone", 
    {
      cardTitle: "Main Phone",
      numberMnPh: "Number:",
      notesMnPh: "Notes:"
    }, 
    {
      cardTitle: "Alternate Phone",
      numberAltPh: "Number:",
      notesAltPh: "Notes:"
    }
  ],
  column4: ["Email", 
    {
      cardTitle: "Main Email", 
      addressMain: "Email:"
    },
    {
      cardTitle: "Alternate Email",
      addressAlt: "Email:"
    }
  ],
  column5: ["Address",
    {
      cardTitle: "Shipping Address",
      line1Ship: "Line 1:",
      line2Ship: "Line 2:",
      cityShip: "City:",
      stateShip: "State:",
      zipShip: "Zipcode:"
    },
    {
      cardTitle: "Billing Address",
      line1Bill: "Line 1:",
      line2Bill: "Line 2:",
      cityBill: "City:",
      stateBill: "State:",
      zipBill: "Zipcode:"
    }
  ],
  column6: ["Notes",
    {
      cardTitle: "Note",
      titleNote: "Title:",
      timestampNote: "Date/Time:",
      contentNote: "Content:"
    }
  ],
  column7: ["Tags",
    {
      cardTitle: "Tag1",
      tagName: ""
    }
  ],
}];

const sortOptionIds = [];

const fieldsetIds = [];

const spaceRegex = /\s/g;

var clientId = "";
var clientObj = {};
var clientObjKeys = [];
var clientObjValues = [];
const clientRowId = [];
const clientInnerRowIds = [];
const clientCardIds = [];
const clientInnerCardIds = [];
const clientCardData = [];

const templateId = 0;
const templateObj = {
  column1: ["Contact ID", 
    {
      cardTitle: "Contact#",
      idNumber: 0,
    }
  ],
  column2: ["Name", 
    {
      cardTitle: "Main Contact",
      fullNameMnCont: "Full:",
      firstNameMnCont: "First:",
      lastNameMnCont: "Last:",
      nickNameMnCont: "Nick Name:",
      pronounciationMnCont: "Pronounciation:"
    }
  ],
  column3: ["Phone", 
    {
      cardTitle: "Main Phone",
      numberMnPh: "Number:",
      notesMnPh: "Notes:"
    }, 
    {
      cardTitle: "Alternate Phone",
      numberAltPh: "Number:",
      notesAltPh: "Notes:"
    }
  ],
  column4: ["Email", 
    {
      cardTitle: "Main Email", 
      addressMain: "Email:"
    },
    {
      cardTitle: "Alternate Email",
      addressAlt: "Email:"
    }
  ],
  column5: ["Address",
    {
      cardTitle: "Shipping Address",
      line1Ship: "Line 1:",
      line2Ship: "Line 2:",
      cityShip: "City:",
      stateShip: "State:",
      zipShip: "Zipcode:"
    },
    {
      cardTitle: "Billing Address",
      line1Bill: "Line 1:",
      line2Bill: "Line 2:",
      cityBill: "City:",
      stateBill: "State:",
      zipBill: "Zipcode:"
    }
  ],
  column6: ["Notes",
    {
      cardTitle: "Note",
      titleNote: "Title:",
      timestampNote: "Date/Time:",
      contentNote: "Content:"
    }
  ],
  column7: ["Tags",
    {
      cardTitle: "Tag1",
      tagName: ""
    }
  ],
};
const templateKeysArray = Object.keys(templateObj);
const templateValArray = Object.values(templateObj);
const tableHeadings = [];
const cardTitles = [];
const cardLabels = [];
const cardCountsByColumn = [];
const templateContainerId = [];
const templateRowIds = [];
const templateCellIds = [];
const templateCardIds = [];




/* ---  START Build Random Client List ---- */
const getRandomDigit = () => {
  return Math.floor(Math.random() * 10)
}

(function () {
})();

/* ---  END Build Random Client List ---- */
/*
const addClient = () => {
  newClient = {...templateObj};
  contactAttributes.push(newClient);
}


const submitContactForm = () => {
  /*  ----  need to add an event listener to intercept the submit event and control what happens here --- 

}


const insertDataInputs = () => {

}


const insertFieldsets = () => {
  controlBox.insertAdjacentHTML("afterend", `<div class="form-container"><form id="new-contact-form"></form><div>`)
  const newContact = document.getElementById('new-contact-form');

  for (i = 0; i < templateKeysArray.length; i++) {
    newContact.insertAdjacentHTML("beforeend", `<fieldset id="fieldset-${templateKeysArray[i]}"><legend>${tableHeadings[i]}</legend></fieldset>`);
    let fieldsetId = `fieldset-${templateKeysArray[i]}`;
    fieldsetIds.push(fieldsetId);
  }

  newContact.insertAdjacentHTML("beforeend", `<button type="submit" class="add-contact-button">Add Contact</button>`)
  insertDataInputs();
}


const buildNewContactForm = () => {
  console.log(clientCardData)
  sortControl.style.display = "none";
  newContactBtn.style.display = "none";
  insertFieldsets();
}
*/

const placeClientData = () => {

  for (i = 0; i < templateValArray.length; i++) {
    templateValArray.forEach((arrayOfObjs) => {
      for (let j = 0; j < arrayOfObjs.length; j++) {
        let values = Object.values(arrayOfObjs[j])
        values.shift();
        clientCardData.push(values)
      }
    })
  }

  clientCardIds.forEach((cardId, k) => {
    clientCardData[k].forEach((string) => {
      if (k === 0 ) {
      } else {
        document.getElementById(cardId).insertAdjacentHTML("beforeend", `<p class="client-card-data">${string}</p>`)
      }
    })
  })
}

/* ----- START Build Table ---------------- */
const placeCardLabels = () => {
  templateCardIds.forEach((id, i) => {
    cardLabels[i].forEach((string) => {
      document.getElementById(id).insertAdjacentHTML("beforeend", `<p id="" class="card-label">${string}</p>`)
    })
  })
}

const placeCardTitles = () => {
  templateCardIds.forEach((idNum, j) => {
    let thisCard = document.getElementById(idNum);
    if (idNum.includes("Contact#") || idNum.includes("Note") || idNum.includes("Tag")) {
    } else if (thisCard.getAttribute("rowspan") > 1) {
    } else {
      thisCard.insertAdjacentHTML("afterbegin", `<p class="card-title">${cardTitles[j]}</p>`)
    }
  })
  placeCardLabels();
}

const placeCards = () => {
  templateCellIds.forEach((cellId, j) => {
    let thisCell = document.getElementById(cellId);
    let cardId = `template-${cardTitles[j].replace(spaceRegex, "")}-card`; 
    thisCell.insertAdjacentHTML("beforeend", `
      <div  id="${cardId}" class="template-card"></div>`)

    templateCardIds.push(cardId);
  })
  placeCardTitles();
}

const placeCardcells = () => {
  let rowQty = templateRowIds.length;
  let titles = [...cardTitles];

  for (let i = 0; i < cardCountsByColumn.length; i++) {
    let colCardQty = cardCountsByColumn[i];

    for (let k= 0; k < colCardQty; k++) {
      let cardTitle = titles.shift();
      let thisCellId = `template-${cardTitle.replace(spaceRegex, "")}-cell`;

      document.getElementById(templateRowIds[k]).insertAdjacentHTML("beforeend", `
        <td id="${thisCellId}" rowspan= "${rowQty - (colCardQty - 1)}" class="card-cell">
        </td>`)
        templateCellIds.push(thisCellId);
        rowNum = rowQty - (k + 1);
    }
  }
  placeCards();
}

const placeTemplateInnerRows = () => {
  let rowNum = 0;
  for (let i = 0; i < cardCountsByColumn.length; i++) {
    let qty = cardCountsByColumn[i];

    if (rowNum < qty) {
      let innerRowId = `template-row-${rowNum}`

      document.getElementById(templateContainerId).insertAdjacentHTML("beforeend", `<tr id="${innerRowId}" class="template-row"></tr>`);
      templateRowIds.push(innerRowId);
      rowNum++;
    }
  }
  placeCardcells();
}

const placeTemplateRow = () => {
  let rowId = `template-container`;
  table.insertAdjacentHTML("beforeend", `<tbody id="${rowId}" class="template-container"></tbody>`)
  templateContainerId.push(rowId);
  placeTemplateInnerRows();
}

const placeRowAndSortHeadings = () => {
  for (let i = 0; i < tableHeadings.length; i++) {
    let val = tableHeadings[i];
    let colId = templateKeysArray[i];
    tableHeadRow.insertAdjacentHTML("beforeend", `<th id="${colId}-heading" class="row-heading">${val}</th>`);
    sortDropdown.insertAdjacentHTML("beforeend", `<option for="${colId}" id="${val.replace(spaceRegex, "-")}">${val}</option>`);
    sortOptionIds.push(`${val.replace(spaceRegex, "-")}`);
  }
  placeTemplateRow();
}

const getcardCountsByColumns = () => {
  templateValArray.forEach((columnArray) => {
    cardCountsByColumn.push(columnArray.length);
  })
  placeRowAndSortHeadings();
}

const getCardTitlesAndLabels = () => {
  for (i = 0; i < templateValArray.length; i++) {
    for (j = 0; j < templateValArray[i].length; j++) {
      let values = Object.values(templateValArray[i][j])
      let title = values.shift()
      cardTitles.push(title)
      cardLabels.push(values);
    } 
  } 
  getcardCountsByColumns();
}

const getTableHeadings = () => {
  for (let i = 0; i < templateValArray.length; i++){
    tableHeadings.push(templateValArray[i].shift())
  }
  getCardTitlesAndLabels();
}

(function () {
  getTableHeadings();
})();

/* ---  END Build Table -----   */


const getClient = () => {
  for (i = 0; i < contactAttributes.length; i ++) {
    clientObj = {...contactAttributes[i]};
    let contactIdArr = clientObj.column1;
    clientId = contactIdArr[1].idNumber;
  }
}



/* ---- EVENT LISTENERS ------------ */

newContactBtn.addEventListener("click", () => {
  buildNewContactForm();
})

window.addEventListener("load", () => {
  getClient();
});







