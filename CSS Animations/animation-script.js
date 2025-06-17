const sphere = document.getElementById("sphere");
const qty = 10;
let delay = 0;
let animationName;

for (let num = 0; num < qty; num++) {
  const ring = document.createElement("div");
  sphere.appendChild(ring);
  delay += (20000 / qty)

  if (num % 2 === 0) {
    animationName = "rotate1"
  } else {
    animationName = "rotate2"
  }

  ring.classList.add(`circle`);
  ring.style.animationName = `${animationName}`;
  ring.style.animationDelay = `${delay}ms`
}
