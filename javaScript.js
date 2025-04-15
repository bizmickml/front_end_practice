if (typeof window !== 'undefined') {
  // Code that uses document object


/* ----------

function fetchWater(count) {
    if(count === 0) {
        console.log('No more water left');
        return;
    }
    console.log('Fething water...');
    fetchWater(count - 1);
}

fetchWater(5);

------------------ */
}

var doorNumber = 1;
const doorHTML = `
  <div id="${doorNumber}" class="door">
    <div class="door-casing"></div>
    <div class="door-opening">
      <div class="door-slab"></div>
      <div class="door-swing"></div>
    </div>
    <div class="door-casing"></div>
  </div>
`;

(function () {
  const root = document.querySelector(':root');
  root.style.setProperty('--color2', 'red');
  const main = document.querySelector('main');
  main.insertAdjacentHTML('beforeend', doorHTML);
  doorNumber++;
})();