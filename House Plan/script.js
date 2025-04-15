const root = document.querySelector(':root');
const scaleInput = document.getElementById('scale-input');
const projectOutlineElement = document.getElementById('project-outline-data');
const projectWidthElement = document.getElementById('project-width');
const projectHeightElement = document.getElementById('project-height');
const planDataBtn = document.getElementById('plan-data-form-button');
const elementMenuBtn = document.getElementById('element-menu-button');
const setPlanDataBtn = document.getElementById('set-plan-data-button');
const changePlanDataBtn = document.getElementById('update-plan-data-button');
const planDataForm = document.getElementById('plan-data-form');
const elementMenu = document.getElementById('element-menu');
let plan;
const planName = "";
const scale = 0;
const widthIn = 0;
const heightIn = 0;
const floorCount = 0;


const stringToDecimal = (str) => {
  console.log(str.split("/"))
  const numerator = str.split("/")[0];
  const denominator = str.split("/")[1];
  return numerator / denominator;
}

const calcProjectOutline = () => {

}

const getFormData = () => {
  const planDataFormInputs = planDataForm.querySelectorAll('select');
  const nameInput = planDataForm.querySelector('input');
  const values = {};
  values[nameInput.id] = nameInput.value;

  planDataFormInputs.forEach((element) => {
    values[element.id] = element.value;
  })

  Object.keys(values).forEach((key) => {
    console.log(key)
    console.log(values[key])
    console.log(key.includes("width"))
    if (key.includes("width")) {
      if (key.includes("feet")) {
        widthIn += values[key] * 12;
      } else if (key.includes('inches')) {
        widthIn += values[key];
      } else if (key.includes('fractions')) {
        widthIn += stringToDecimal(values[key]);
      }  
    } else if (key.includes("height")) {
      if (key.includes("feet")) {
        heightIn += values[key] * 12;
      } else if (key.includes('inches')) {
        heightIn += values[key];
      } else if (key.includes('fractions')) {
        heightIn += stringToDecimal(values[key]);
      }
    } else if (key.includes("scale")) {
      scale += values[key];
    } else if (key.includes("floor")) {
      floorCount += values[key];
    } else if (key.includes("name")) {
      planName += values[key];
    } 
  })
  console.log(planName)
}

const retrieveStoredProject = () => {
  if (localStorage.getItem(`project-${this.projectIdName}-Name`)) {
  const name = localStorage.getItem(`project-${this.projectIdName}-Name`);
  const scale = localStorage.getItem(`project-${this.projectIdName}-Scale`);
  const widthIn = localStorage.getItem(`project-${this.projectIdName}-Width`);
  const heightIn = localStorage.getItem(`project-${this.projectIdName}-Height`);
  const floorCount = localStorage.getItem(`project-${this.projectIdName}-Floor-Count`);
  plan = new PlanData(name, scale, widthIn, heightIn, floorCount);
  }
}

class PlanData {
  constructor(name, scale, widthIn, heightIn, floorCount) {
    this.projectDisplayName = name,
    this.projectIdName = name.replace(/\s+/g, "-"),
    this.oneFootScale = `${scale}in`, 
    this.oneInchScale = `${scale / 12}in`,
    this.projectWidth = `${widthIn}in`,
    this.projectHeight = `${heightIn}in`,
    this.sceneWidth = `${this.projectWidth * 1.2}in`,
    this.sceneHeight = `${this.projectHeight * 1.4}in`
    this.floorCount = floorCount;
  }

  storeProject() {
    localStorage.setItem(`project-${this.projectIdName}-Name`, projectDisplayName);
    localStorage.setItem(`project-${this.projectIdName}-Scale`, scale);
    localStorage.setItem(`project-${this.projectIdName}-Width`, widthIn);
    localStorage.setItem(`project-${this.projectIdName}-Height`, heightIn);
    localStorage.setItem(`project-${this.projectIdName}-Floor-Count`, floorCount);
  }

};

const buildForm = () => {
  const dimensionUnits = [
    {
      name: "Feet",
    },
    {
      name: "Inches",
    },
    {
      name: "Fractions of an inch",
    },
  ];

  for (i = 1; i < 16; i++) {
    let keyName = "opt" + `${i}`;
    let numerator = i;
    let denominator = 16;
    while (numerator % 2 === 0) {
      numerator /= 2;
      denominator /=2;
    }
    dimensionUnits[2][keyName] = `${numerator}/${denominator}`
  }
  for (i = 1; i < 12; i++) {
    let keyName = "opt" + `${i}`;
    dimensionUnits[1][keyName] = i;
  }
  for (i = 1; i <= 100; i++) {
    let keyName = "opt" + `${i}`;
    dimensionUnits[0][keyName] = i;
  }
  
  dimensionUnits.forEach((obj) => {
    projectWidthElement.insertAdjacentHTML("beforeend", `
      <label for="project-width-${obj.name.replace(/\s+/g, "-").toLowerCase()}">${obj.name}</label>
      <select id="project-width-${obj.name.replace(/\s+/g, "-").toLowerCase()}"></select>
    `)
    projectHeightElement.insertAdjacentHTML("beforeend", `
      <label for="project-height-${obj.name.replace(/\s+/g, "-").toLowerCase()}">${obj.name}</label>
      <select id="project-height-${obj.name.replace(/\s+/g, "-").toLowerCase()}"></select>
    `)
    Object.keys(obj).forEach((key, i) => {
      if (i === 0) {
        document.getElementById(`project-width-${obj.name.replace(/\s+/g, "-").toLowerCase()}`).insertAdjacentHTML("beforeend", `
          <option value="0">Choose an option</option>
        `)
        document.getElementById(`project-height-${obj.name.replace(/\s+/g, "-").toLowerCase()}`).insertAdjacentHTML("beforeend", `
          <option value="0">Choose an option</option>
        `)
      } else {
        document.getElementById(`project-width-${obj.name.replace(/\s+/g, "-").toLowerCase()}`).insertAdjacentHTML("beforeend", `
          <option value="${obj[key]}">${obj[key]}</option>
        `)
        document.getElementById(`project-height-${obj.name.replace(/\s+/g, "-").toLowerCase()}`).insertAdjacentHTML("beforeend", `
          <option value="${obj[key]}">${obj[key]}</option>
        `)
      }
    })
  });
  
}

/*
const doorIds = [];  
const wallIds = [];
const roomIds = [];
const wallTypes = ["partition-wall", "bearing-wall", "exterior-wall"] ;



const insertDoor = (element, size, hand) => {
  const idNumber = doorIds.length + 1;
  const newDoorId = `door-${idNumber}`;
  const doorHTML = `
    <div id="door-${idNumber}" class="door">
      <div class="door-casing-left"></div>
      <div id="door-${idNumber}-opening" class="door-opening">
        <div id="door-${idNumber}-slab" class="door-slab"></div>
        <div id="door-${idNumber}-swing" class="door-swing"></div>
      </div>
      <div class="door-casing-right"></div>
    </div>
  `;
  element.insertAdjacentHTML("beforeend", doorHTML);
  const currentDoor = document.getElementById(`door-${idNumber}`)
  currentDoor.style.width = `calc(${size} * var(--inchScale))`;
  const currentDoorOpening = document.getElementById(`door-${idNumber}-opening`);
  if (hand === "RH") {
  } else if (hand === "LH") {
    currentDoorOpening.style.scale = "-1 1";
  } else {
    return alert("Please enter a valid door handing (LH or RH)");
  }
  doorIds.push(newDoorId);
}

const insertWall = (element, type, length, orientation) => {
  const idNumber = wallIds.length + 1;
  const newWallId = `${element.id}-wall-${idNumber}`;
  const wallHTML = `<div id="${newWallId}" class="${type}"></div>`
  element.insertAdjacentHTML("beforeend", wallHTML);
  const currentWall = document.getElementById(newWallId);
  currentWall.style.width = length;
  if (orientation === "vertical") {
    currentWall.style.rotate = '90deg';
  } else if (orientation === "horizontal") {
  } else {
    return alert("Please enter a valid orientation (vertical or horizontal)")
  }
  wallIds.push(newWallId);
}

const insertRoom = (element, name, width, height) => {
  const newRoomId = `${name.replace(/\s/, "-").toLowerCase()}`
  if (roomIds.test(newRoomId)) {return alert("Please enter a different name.")}
  element.insertAdjacentHTML("beforeend", `<div id="${newRoomId}"></div>`)
  const currentRoom = document.getElementById(newRoomId);
  currentRoom.style.width = width;
  currentRoom.style.height = height;
  roomIds.push(newRoomId);
}

const calcOuterDim = () => {
  const widthInputs = projectWidthElement.getElementsByTagName('input');
  console.log(widthInputs)
}
calcOuterDim();

const setOutterDimensions = (width, height) => {
  projectWidth = width * oneFootScale;
  projectHeight = height * oneFootScale;
  root.style.setProperty('--projectWidth', `${projectWidth}`);
  root.style.setProperty('--projectHeight', `${projectHeight}`);
}

const setScale = (num) => {
  currentScale = num;
  oneInchScale = `${num / 12}in`;
  oneFootScale = `${num}in`;
  localStorage.setItem("currentScale", num);
  document.getElementById(`scale-input-${num}`).selected = true;
  document.getElementById('scale-input-label').textContent = "Current Scale: ";
  scaleInputBtn.textContent = "Change Scale";
  clearScaleBtn.classList.remove("hidden");
}

outerDimensionBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setScale(scaleInput.value);
  const widthFeet = document.getElementById('project-width-feet').value;
  const widthInches = document.getElementById('project-width-inches').value;
  const widthInchDec = Number(widthInches) / 12;
  const widthFraction = document.getElementById('project-width-fractions-of-an-inch').value;
  const widthDecimal = stringToDecimal(widthFraction);
  const heightFeet = document.getElementById('project-height-feet').value;
  const heightInches = document.getElementById('project-height-inches').value;
  const heightInchDec = Number(heightInches) / 12;
  const heightFraction = document.getElementById('project-height-fractions-of-an-inch').value;
  const heightDecimal = stringToDecimal(heightFraction);
  const width = Number(widthFeet) + widthInchDec + widthDecimal;
  const height = Number(heightFeet) + heightInchDec + heightDecimal;

  setOutterDimensions(width, height);
})
  */

elementMenuBtn.addEventListener("click", () => {
  elementMenu.hidden ? elementMenu.hidden = false : elementMenu.hidden = true;
  if (elementMenu.hidden) {
    elementMenuBtn.textContent = 'Show element menu'
  } else {
    elementMenuBtn.textContent = 'Hide element menu'
  }
})

planDataBtn.addEventListener("click", () => {
  planDataForm.hidden ? planDataForm.hidden = false : planDataForm.hidden = true;
  if (planDataForm.hidden) {
    planDataBtn.textContent = 'Show plan data form';
  } else {
    planDataBtn.textContent = 'Hide plan data form';
  }
})

changePlanDataBtn.addEventListener("click", () => {})

setPlanDataBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getFormData();
})

window.onload = () => {
  buildForm();
  retrieveStoredProject();
}
