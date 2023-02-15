const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const timerDisplay = document.querySelector('.display__time-left');
const moles = document.querySelectorAll('.mole');
const endButton = document.querySelector('.btn-end');
const radioInputs = document.querySelectorAll('.level input[name="radioInput"]');
const bestAttempts = document.querySelector('.best-attempts__items');
const items = JSON.parse(localStorage.getItem('items')) || [];
let lastHole;
let countdown;
let duration;
let countdownTimer;
let timeUp = false;
let score = 0;

function randomTime(min, max) {
   return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
   const idx = Math.floor(Math.random() * holes.length);
   const hole = holes[idx];
   if (hole === lastHole) {
      console.log("Ah nah that is the same one bud");
      return randomHole(holes);
   }
   lastHole = hole;
   return hole;
}

function populateList(plates = [], platesList) {
   platesList.innerHTML = plates
      .sort((a, b) => a.scoreTotal > b.scoreTotal ? -1 : 1)
      .map((plate) => {
         return `
            <div class="best-attempts__item item-attempts">
               <div class="item-attempts__text">Well-done BRO! Here's your result of this game</div>
               <p class="item-attempts__info">Your result is -><span class="item-attempts__score">${plate.scoreTotal} pieces</span></p>
               <p class="top-rated-text">${plate.scoreTotal >= 9 ? 'The best Result' : ''}</p>
            </div>
            `
      }).join('');
   if (JSON.parse(localStorage.getItem('items'))) {
      bestAttempts.classList.add('active');
      setTimeout(() => bestAttempts.classList.add('active-shown'), 150);
   }
}

function timer(seconds) {
   clearInterval(countdownTimer);

   const now = Date.now();
   const then = now + seconds * 1000;
   displayTimerLeft(seconds);

   countdownTimer = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      if (secondsLeft < 0) {
         bestAttempts.classList.add('active');
         setTimeout(() => bestAttempts.classList.add('active-shown'), 150);
         timerDisplay.innerHTML = 'Wow, well-played!';
         clearInterval(countdownTimer);
         if (score >= 6) {
            items.push({ scoreTotal: score });
            populateList(items, bestAttempts);
            localStorage.setItem('items', JSON.stringify(items));
         }
         return;
      }
      displayTimerLeft(secondsLeft);
   }, 1000)
}

function displayTimerLeft(seconds) {
   const remainderSeconds = seconds % 60;
   timerDisplay.innerHTML = `<span>${remainderSeconds}</span> seconds left`;
}

function peep() {
   const selectedInput = document.querySelector('.level input[name="radioInput"]:checked');
   const timeMin = parseInt(selectedInput.dataset.min);
   const timeMax = parseInt(selectedInput.dataset.max);
   const time = randomTime(timeMin, timeMax);

   const hole = randomHole(holes);
   console.log(time, hole);
   hole.classList.add('up');
   countdown = setTimeout(() => {
      hole.classList.remove('up');
      if (!timeUp) peep();
   }, time);
}

function startGame() {
   scoreBoard.textContent = '0';
   timeUp = false;
   score = 0;
   peep();
   timer(10);
   duration = setTimeout(() => timeUp = true, 10000);
}

function endGame() {
   scoreBoard.textContent = '0';
   timeUp = true;
   score = 0;
   clearInterval(countdownTimer);
}

function bonk(e) {
   if (!e.isTrusted) return;
   score++;
   this.parentNode.classList.remove('up');
   scoreBoard.textContent = score;
}

function deleteResults() {
   if (confirm('Are you sure?') == true) {
      items.length = 0;
      populateList([], bestAttempts);
      localStorage.removeItem('items', JSON.stringify(items));
      bestAttempts.classList.remove('active', 'active-shown');
   }
}

endButton.addEventListener('click', (e) => {
   if (e.target.matches('.btn-end')) {
      timerDisplay.innerHTML = 'Well, try again later :(';
   }
   endGame();
});
moles.forEach(mole => mole.addEventListener('click', bonk));
radioInputs.forEach(input => input.addEventListener('change', () => {
   clearTimeout(duration);
   timerDisplay.innerHTML = 'You\'re right, change the level :)';
   endGame();
}));

populateList(items, bestAttempts);

/*
let string = "HELLOWORLD";
console.log(string);
let newString = string.toLowerCase();
newString = newString.charAt(0).toUpperCase() + newString.slice(1);
newString = newString.slice(0, 5) + ' ' + newString.slice(5).charAt(0).toUpperCase() + newString.slice(6);
console.log(newString);
*/