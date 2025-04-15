if (typeof window !== 'undefined') {
  // Code that uses document object



const sphere = document.querySelector("sphere");

(function addCircles(qty) {
  for (let num = 0; num > qty; num++) {
    const ring = document.createElement(div);
    sphere.appendChild(ring);
    ring.classList.add(`circle ${num}`);
    ring.style.transform = `rotate3d(1, 0, 0, calc(360deg / ${qty})`;
  }
  return;
})(5)




}