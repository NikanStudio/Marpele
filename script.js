/* =========================================================
   MAR O PALE
   NIKAN STUDIO
   4 PLAYER SNAKE & LADDER
========================================================= */

/* =========================================================
   ELEMENTS
========================================================= */

const board = document.getElementById("board");
const rollDiceButton = document.getElementById("rollDice");
const currentPlayerText = document.getElementById("currentPlayer");
const diceResultText = document.getElementById("diceResult");
const gameMessage = document.getElementById("gameMessage");


/* =========================================================
   PLAYERS
========================================================= */

const players = [
    {
        name: "قرمز",
        color: "red",
        position: 1
    },
    {
        name: "آبی",
        color: "blue",
        position: 1
    },
    {
        name: "سبز",
        color: "green",
        position: 1
    },
    {
        name: "زرد",
        color: "yellow",
        position: 1
    }
];

let currentPlayerIndex = 0;
let gameStarted = false;
let isRolling = false;


/* =========================================================
   SNAKES
   key = شروع مار
   value = انتهای مار
========================================================= */

const snakes = {
    98: 78,
    95: 75,
    92: 72,
    88: 68,
    64: 44,
    48: 30,
    39: 20,
    27: 7
};


/* =========================================================
   LADDERS
   key = پایین پله
   value = بالای پله
========================================================= */

const ladders = {
    4: 25,
    9: 31,
    17: 45,
    21: 42,
    28: 56,
    40: 60,
    51: 72,
    63: 81
};


/* =========================================================
   CREATE BOARD
========================================================= */

function createBoard() {

    board.innerHTML = "";

    /*
       مار و پله معمولاً به شکل زیگزاگی شماره‌گذاری می‌شود.
       ردیف اول: 1 تا 10
       ردیف دوم: 20 تا 11
       ردیف سوم: 21 تا 30
       ...
    */

    for (let row = 9; row >= 0; row--) {

        let numbers = [];

        const start = row * 10 + 1;
        const end = row * 10 + 10;

        for (let number = start; number <= end; number++) {
            numbers.push(number);
        }

        /*
           ردیف‌های یکی در میان برعکس می‌شوند.
        */

        if ((9 - row) % 2 === 1) {
            numbers.reverse();
        }

        numbers.forEach(number => {

            const cell = document.createElement("div");

            cell.classList.add("cell");
            cell.dataset.number = number;

            /* شماره خانه */

            const numberElement = document.createElement("span");

            numberElement.classList.add("cell-number");
            numberElement.textContent = number;

            cell.appendChild(numberElement);

            /* خانه شروع */

            if (number === 1) {
                cell.classList.add("start");
            }

            /* خانه پایان */

            if (number === 100) {
                cell.classList.add("finish");
            }

            /* مار */

            if (snakes[number]) {

                const snake = document.createElement("span");

                snake.classList.add("snake");
                snake.textContent = "🐍";

                cell.appendChild(snake);
            }

            /* پله */

            if (ladders[number]) {

                const ladder = document.createElement("span");

                ladder.classList.add("ladder");
                ladder.textContent = "🪜";

                cell.appendChild(ladder);
            }

            /* محل مهره‌ها */

            const pieceContainer = document.createElement("div");

            pieceContainer.classList.add("piece-container");

            pieceContainer.id = `pieces-${number}`;

            cell.appendChild(pieceContainer);

            board.appendChild(cell);
        });
    }

    updatePieces();
}


/* =========================================================
   CREATE PIECES
========================================================= */

function updatePieces() {

    /* پاک کردن مهره‌های قبلی */

    document.querySelectorAll(".piece-container").forEach(container => {
        container.innerHTML = "";
    });

    /* قرار دادن دوباره مهره‌ها */

    players.forEach(player => {

        const container = document.getElementById(
            `pieces-${player.position}`
        );

        if (!container) return;

        const piece = document.createElement("div");

        piece.classList.add(
            "piece",
            player.color
        );

        piece.title = player.name;

        container.appendChild(piece);
    });
}


/* =========================================================
   UPDATE CURRENT PLAYER
========================================================= */

function updateCurrentPlayer() {

    const player = players[currentPlayerIndex];

    currentPlayerText.textContent = player.name;

    /*
       رنگ متن نوبت
    */

    const colors = {
        red: "#ef4444",
        blue: "#3b82f6",
        green: "#22c55e",
        yellow: "#ca8a04"
    };

    currentPlayerText.style.color =
        colors[player.color] || "#4f46e5";

    /*
       نمایش بازیکن فعال
    */

    document.querySelectorAll(".player").forEach(element => {
        element.classList.remove("active");
    });

    const playerElements =
        document.querySelectorAll(".player");

    if (playerElements[currentPlayerIndex]) {
        playerElements[currentPlayerIndex]
            .classList.add("active");
    }
}


/* =========================================================
   ROLL DICE
========================================================= */

async function rollDice() {

    if (isRolling) return;

    isRolling = true;
    rollDiceButton.disabled = true;

    const player = players[currentPlayerIndex];

    gameStarted = true;

    gameMessage.textContent =
        `${player.name} در حال انداختن تاس است...`;

    /*
       انیمیشن ساده تاس
    */

    for (let i = 0; i < 8; i++) {

        const randomNumber =
            Math.floor(Math.random() * 6) + 1;

        diceResultText.textContent = randomNumber;

        await wait(80);
    }

    /*
       عدد واقعی تاس
    */

    const dice =
        Math.floor(Math.random() * 6) + 1;

    diceResultText.textContent = dice;

    gameMessage.textContent =
        `${player.name} عدد ${dice} آورد!`;

    await movePlayer(player, dice);

    isRolling = false;

    /*
       اگر برنده نشده باشد
       نوبت بازیکن بعدی
    */

    if (!player.winner) {

        currentPlayerIndex++;

        if (currentPlayerIndex >= players.length) {
            currentPlayerIndex = 0;
        }

        updateCurrentPlayer();

        rollDiceButton.disabled = false;

        gameMessage.textContent +=
            ` حالا نوبت ${players[currentPlayerIndex].name} است.`;
    }
}


/* =========================================================
   MOVE PLAYER
========================================================= */

async function movePlayer(player, dice) {

    /*
       اگر از 100 عبور کند، حرکت نمی‌کند.
    */

    if (player.position + dice > 100) {

        gameMessage.textContent =
            `${player.name} نمی‌تواند حرکت کند؛ عدد تاس زیاد است.`;

        await wait(700);

        return;
    }

    /*
       حرکت خانه به خانه
    */

    for (let i = 0; i < dice; i++) {

        player.position++;

        updatePieces();

        await wait(250);
    }

    /*
       بررسی مار
    */

    if (snakes[player.position]) {

        const oldPosition = player.position;

        gameMessage.textContent =
            `${player.name} روی مار افتاد! 🐍`;

        await wait(800);

        player.position = snakes[player.position];

        updatePieces();

        gameMessage.textContent =
            `${player.name} از ${oldPosition} به ${player.position} برگشت. 🐍`;

        await wait(700);
    }

    /*
       بررسی پله
    */

    if (ladders[player.position]) {

        const oldPosition = player.position;

        gameMessage.textContent =
            `${player.name} به پله رسید! 🪜`;

        await wait(800);

        player.position = ladders[player.position];

        updatePieces();

        gameMessage.textContent =
            `${player.name} از ${oldPosition} به ${player.position} رفت. 🪜`;

        await wait(700);
    }

    /*
       بررسی برنده
    */

    if (player.position === 100) {

        player.winner = true;

        gameMessage.textContent =
            `🎉 ${player.name} برنده بازی شد! 🎉`;

        rollDiceButton.disabled = true;

        showWinnerEffect(player);

        return;
    }
}


/* =========================================================
   WINNER EFFECT
========================================================= */

function showWinnerEffect(player) {

    const colors = {
        red: "#ef4444",
        blue: "#3b82f6",
        green: "#22c55e",
        yellow: "#facc15"
    };

    board.style.boxShadow =
        `0 0 30px ${colors[player.color]}`;

    setTimeout(() => {

        board.style.boxShadow = "none";

    }, 2000);
}


/* =========================================================
   WAIT FUNCTION
========================================================= */

function wait(milliseconds) {

    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


/* =========================================================
   NEW GAME
========================================================= */

function resetGame() {

    players.forEach(player => {

        player.position = 1;
        player.winner = false;

    });

    currentPlayerIndex = 0;

    diceResultText.textContent = "-";

    gameMessage.textContent =
        "آماده‌ای؟ بازی را شروع کن!";

    board.style.boxShadow = "none";

    rollDiceButton.disabled = false;

    isRolling = false;

    updatePieces();
    updateCurrentPlayer();
}


/* =========================================================
   EVENTS
========================================================= */

rollDiceButton.addEventListener(
    "click",
    rollDice
);


/* =========================================================
   START GAME
========================================================= */

createBoard();

updateCurrentPlayer();

updatePieces();
