const fruits = [
    "🍎","🍌","🍇","🍓","🍍","🥭",
    "🍉","🍒","🥝","🍑","🍐","🍊"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let timer = null;
let seconds = 0;
let currentLevel = null;

function startGame(level) {
    currentLevel = level;
    clearInterval(timer);
    seconds = 0;
    document.getElementById("time").innerText = seconds;
    document.getElementById("message").innerText = "";

    let pairs, columns;

    if (level === "easy") {
        pairs = 8;
        columns = 4;
    } else if (level === "medium") {
        pairs = 10;
        columns = 5;
    } else {
        pairs = 12;
        columns = 6;
    }

    const board = document.getElementById("gameBoard");
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${columns}, auto)`;

    const selected = fruits.slice(0, pairs);
    const cards = [...selected, ...selected].sort(() => Math.random() - 0.5);

    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    cards.forEach(fruit => {
        const card = document.createElement("div");
        card.className = "card";

        const span = document.createElement("span");
        span.textContent = fruit;

        card.appendChild(span);
        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });

    timer = setInterval(() => {
        seconds++;
        document.getElementById("time").innerText = seconds;
    }, 1000);
}

function flipCard(card) {
    if (lockBoard || card.classList.contains("open") || card.classList.contains("matched")) return;

    card.classList.add("open");

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkMatch();
    }
}

function checkMatch() {
    lockBoard = true;

    if (firstCard.innerText === secondCard.innerText) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedPairs++;

        resetTurn();

        const totalPairs = document.querySelectorAll(".card").length / 2;
        if (matchedPairs === totalPairs) {
            clearInterval(timer);
            document.getElementById("message").innerText =
                `🎉 Congratulations! You completed in ${seconds} seconds`;
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("open");
            secondCard.classList.remove("open");
            resetTurn();
        }, 800);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restartGame() {
    if (!currentLevel) {
        document.getElementById("message").innerText =
            "Please select a level first!";
        return;
    }
    startGame(currentLevel);
}