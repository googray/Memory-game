import { shuffle } from "./shuffle.js";
import { showForm } from "./showform.js";

const fieldCards = [
  "auto.png",
  "auto.png",
  "bike.png",
  "bike.png",
  "bus.png",
  "bus.png",
  "plain.png",
  "plain.png",
  "rocket.png",
  "rocket.png",
  "sailing.png",
  "sailing.png",
  "ship.png",
  "ship.png",
  "train.png",
  "train.png",
];

const form = document.getElementById("form");
const resetBtn = document.querySelector(".reset-btn");
const tryAgainBtn = document.querySelector(".try-again-btn");
const countMoves = document.querySelector(".move-counter");
const showResultBtn = document.querySelector(".show-results-btn");
const goHome = document.querySelector(".go-home");
const result = document.getElementById("high-results");

let moves = 0;
let opens = [];
let match = [];
const field = document.querySelector(".field");
const point = document
  .getElementById("point-position")
  .querySelectorAll(".point");
let countPoint = 3;
const countTime = document.querySelector(".timer");
let time;
let min = 0;
let sec = 0;
let startTime = false;

function startGame() {
  const shuffleField = shuffle(fieldCards);
  for (let i = 0; i < shuffleField.length; i++) {
    const tagLi = document.createElement("LI");
    tagLi.classList.add("card");
    const addImg = document.createElement("IMG");
    tagLi.appendChild(addImg);
    addImg.setAttribute("src", "./assets/png/" + shuffleField[i]);
    addImg.setAttribute("alt", "image of some kind of transport");
    field.appendChild(tagLi);
  }
}
startGame();

function delCard() {
  while (field.hasChildNodes()) {
    field.removeChild(field.firstChild);
  }
}

function timer() {
  time = setInterval(() => {
    sec++;
    if (sec === 60) {
      min++;
      sec = 0;
    }
    countTime.innerHTML =
      "<i class='fa fa-hourglass-start'></i>" +
      " Timer: " +
      min +
      " Mins " +
      sec +
      " Secs";
  }, 1000);
}

function timerStop() {
  clearInterval(time);
}

function resetAll() {
  timerStop();
  sec = 0;
  min = 0;
  startTime = false;
  countTime.innerHTML =
    "<i class='fa fa-hourglass-start'></i>" + " Timer: 00:00";
  point[1].firstElementChild.classList.add("fa-star");
  point[2].firstElementChild.classList.add("fa-star");
  countPoint = 3;
  moves = 0;
  countMoves.innerHTML = 0;
  opens = [];
  match = [];
  delCard();
  startGame();
}

function moveCounter() {
  countMoves.innerHTML++;
  moves++;
}

function pointRange() {
  if (moves === 14) {
    point[2].firstElementChild.classList.remove("fa-star");
    countPoint--;
  }
  if (moves === 18) {
    point[1].firstElementChild.classList.remove("fa-star");
    countPoint--;
  }
}

function compariseOfTwo() {
  if (opens.length === 2) {
    document.body.style.pointerEvents = "none";
  }
  if (opens.length === 2 && opens[0].src === opens[1].src) {
    matchAre();
  } else if (opens.length === 2 && opens[0].src != opens[1].src) {
    noMatchAre();
  }
}

function matchAre() {
  setTimeout(function () {
    opens[0].parentElement.classList.add("match");
    opens[1].parentElement.classList.add("match");
    match.push(...opens);
    document.body.style.pointerEvents = "auto";
    finishGame();
    opens = [];
  }, 600);
  moveCounter();
  pointRange();
}

function noMatchAre() {
  setTimeout(function () {
    opens[0].parentElement.classList.remove("flipflop");
    opens[1].parentElement.classList.remove("flipflop");
    document.body.style.pointerEvents = "auto";
    opens = [];
  }, 700);
  moveCounter();
  pointRange();
}

function putContent() {
  const contents = document.querySelector(".form-content");
  for (let i = 0; i <= 3; i++) {
    const contentItem = document.createElement("p");
    contentItem.classList.add("statist");
    contents.appendChild(contentItem);
  }
  let par = contents.querySelectorAll("p.statist");
  par[0].innerHTML =
    "Time to finish: " + min + " Minutes and " + sec + " Seconds";
  par[1].innerHTML = "Moves to finish: " + moves;
  par[2].innerHTML = "Your Point achived: " + countPoint + " out of 3";
}

function finishGame() {
  if (match.length === 16) {
    timerStop();
    setTimeout(showForm, 2000);
    putContent();
    saveLastResult();
  }
}

field.addEventListener("click", function (e) {
  if (e.target.nodeName === "LI") {
    console.log(e.target.nodeName + " Clicked");

    if (startTime === false) {
      startTime = true;
      timer();
    }
    cardFliper();
  }

  function cardFliper() {
    e.target.classList.add("flipflop");
    pushToOpen();
  }

  function pushToOpen() {
    if (opens.length === 0 || opens.length === 1) {
      opens.push(e.target.firstElementChild);
    }
    compariseOfTwo();
  }
});

resetBtn.addEventListener("click", resetAll);

tryAgainBtn.addEventListener("click", tryAgain);

function tryAgain() {
  form.style.display = "none";
  resetAll();
}

const domResultList = JSON.parse(localStorage.getItem("domResultList")) || [];

const saveLastResult = () => {
  sec = sec < 10 ? "0" + sec : sec;
  const result = {
    time: `time: ${min}:${sec}`,
    move: `moves: ${moves}`,
  };
  domResultList.push(result);
  if (domResultList.length > 10) {
    domResultList.shift();
  }
  localStorage.setItem("domResultList", JSON.stringify(domResultList));
};

showResultBtn.onclick = function () {
  form.style.display = "none";
  result.style.display = "block";
  showResults();
};

const resultList = document.querySelector(".result-list");

export function showResults() {
  resultList.innerHTML = domResultList
    .map((result) => {
      return `<li class="result-item">${result.time} - ${result.move} </li>`;
    })
    .reverse()
    .join("");
}

goHome.addEventListener("click", returnHome);

function returnHome() {
  result.style.display = "none";
  resetAll();
}
