const sphere = document.getElementById("sphere");
const circles = [...sphere.children]
let degreeX = 30;
let degreeY = 30;
let degreeZ = 30;

circles.forEach((el) => {
  if (el.className.includes("x-axis")) {
    el.style.transform = `rotate3D(1, 0, 0, ${degreeX}deg)`;
    degreeX = degreeX + 30;

  } else if (el.className.includes("y-axis")) {
    el.style.transform = `rotate3D(0, 1, 0, ${degreeY}deg)`;
    degreeY = degreeY + 30;

  } else if (el.className.includes("z-axis")) {
    el.style.transform = `rotate3D(0, 0, 1, ${degreeZ}deg)`;
    degreeZ = degreeZ + 30;

  }
})