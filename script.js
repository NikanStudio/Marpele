/* =========================================================
   MAR O PALE
   NIKAN STUDIO
   4 PLAYER SNAKE & LADDER
   WITH GAME SOUNDS
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
   AUDIO SYSTEM
========================================================= */

let audioContext = null;
let audioStarted = false;


/* شروع سیستم صدا */

function startAudio() {

    if (!audioContext) {

        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    audioStarted = true;
}


/* صدای پایه */

function playTone(
    frequency,
    duration = 0.12,
    type = "sine",
    volume = 0.05
) {

    if (!audioStarted || !audioContext) return;

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );

    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration
    );
}


/* =========================================================
   DICE SOUND
========================================================= */

function playDiceSound() {

    if (!audioStarted) return;

    playTone(
        350,
        0.07,
        "square",
        0.035
    );

    setTimeout(() => {

        playTone(
            480,
            0.07,
            "square",
            0.035
        );

    }, 80);

    setTimeout(() => {

        playTone(
            620,
            0.09,
            "square",
            0.04
        );

    }, 160);
}


/* =========================================================
   PIECE MOVE SOUND
========================================================= */

function playMoveSound() {

    playTone(
        330,
        0.07,
        "triangle",
        0.025
    );
}


/* =========================================================
   SNAKE SOUND
========================================================= */

function playSnakeSound() {

    if (!audioStarted) return;

    playTone(
        450,
        0.12,
        "sawtooth",
        0.035
    );

    setTimeout(() => {

        playTone(
            330,
            0.15,
            "sawtooth",
            0.035
        );

    }, 120);

    setTimeout(() => {

        playTone(
            220,
            0.25,
            "sawtooth",
            0.04
        );

    }, 250);
}


/* =========================================================
   LADDER SOUND
========================================================= */

function playLadderSound() {

    if (!audioStarted) return;

    playTone(
        400,
        0.1,
        "triangle",
        0.035
    );

    setTimeout(() => {

        playTone(
            520,
            0.1,
            "triangle",
            0.035
        );

    }, 100);

    setTimeout(() => {

        playTone(
            650,
            0.13,
            "triangle",
            0.04
        );

    }, 200);
}


/* =========================================================
   WINNER SOUND
========================================================= */

function playWinnerSound() {

    if (!audioStarted) return;

    const notes = [
        523,
        659,
        784,
        1046
    ];

    notes.forEach((note, index) => {

        setTimeout(() => {

            playTone(
                note,
                0.22,
                "triangle",
                0.06
            );

        }, index * 150);

    });
}


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

    for (
        let row = 9;
        row >= 0;
        row--
    ) {

        let numbers = [];

        const start =
            row * 10 + 1;

        const end =
            row * 10 + 10;


        for (
            let number = start;
            number <= end;
            number++
        ) {

            numbers.push(number);

        }


        if ((9 - row) % 2 === 1) {

            numbers.reverse();

        }


        numbers.forEach(number => {

            const cell =
                document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.number =
                number;


            /* شماره خانه */

            const numberElement =
                document.createElement("span");

            numberElement.classList.add(
                "cell-number"
            );

            numberElement.textContent =
                number;

            cell.appendChild(
                numberElement
            );


            /* خانه شروع */

            if (number === 1) {

                cell.classList.add(
                    "start"
                );

            }


            /* خانه پایان */

            if (number === 100) {

                cell.classList.add(
                    "finish"
                );

            }


            /* مار */

            if (snakes[number]) {

                const snake =
                    document.createElement("span");

                snake.classList.add(
                    "snake"
                );

                snake.textContent =
                    "🐍";

                cell.appendChild(
                    snake
                );

            }


            /* پله */

            if (ladders[number]) {

                const ladder =
                    document.createElement("span");

                ladder.classList.add(
                    "ladder"
                );

                ladder.textContent =
                    "🪜";

                cell.appendChild(
                    ladder
                );

            }


            /* محل مهره‌ها */

            const pieceContainer =
                document.createElement("div");

            pieceContainer.classList.add(
                "piece-container"
            );

            pieceContainer.id =
                `pieces-${number}`;

            cell.appendChild(
                pieceContainer
            );


            board.appendChild(cell);

        });

    }


    updatePieces();

}


/* =========================================================
   UPDATE PIECES
========================================================= */

function updatePieces() {

    document
        .querySelectorAll(".piece-container")
        .forEach(container => {

            container.innerHTML = "";

        });


    players.forEach(player => {

        const container =
            document.getElementById(
                `pieces-${player.position}`
            );


        if (!container) return;


        const piece =
            document.createElement("div");


        piece.classList.add(
            "piece",
            player.color
        );


        piece.title =
            player.name;


        container.appendChild(
            piece
        );

    });

}


/* =========================================================
   UPDATE CURRENT PLAYER
========================================================= */

function updateCurrentPlayer() {

    const player =
        players[currentPlayerIndex];


    currentPlayerText.textContent =
        player.name;


    const colors = {

        red: "#ef4444",
        blue: "#3b82f6",
        green: "#22c55e",
        yellow: "#ca8a04"

    };


    currentPlayerText.style.color =
        colors[player.color] ||
        "#4f46e5";


    document
        .querySelectorAll(".player")
        .forEach(element => {

            element.classList.remove(
                "active"
            );

        });


    const playerElements =
        document.querySelectorAll(
            ".player"
        );


    if (
        playerElements[currentPlayerIndex]
    ) {

        playerElements[
            currentPlayerIndex
        ].classList.add(
            "active"
        );

    }

}


/* =========================================================
   ROLL DICE
========================================================= */

async function rollDice() {

    if (isRolling) return;


    /*
       فعال کردن صدا
    */

    startAudio();


    isRolling = true;

    rollDiceButton.disabled =
        true;


    const player =
        players[currentPlayerIndex];


    gameStarted = true;


    gameMessage.textContent =
        `${player.name} در حال انداختن تاس است...`;


    /*
       صدای تاس
    */

    playDiceSound();


    /*
       انیمیشن تاس
    */

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const randomNumber =
            Math.floor(
                Math.random() * 6
            ) + 1;


        diceResultText.textContent =
            randomNumber;


        await wait(80);

    }


    /*
       عدد واقعی تاس
    */

    const dice =
        Math.floor(
            Math.random() * 6
        ) + 1;


    diceResultText.textContent =
        dice;


    gameMessage.textContent =
        `${player.name} عدد ${dice} آورد!`;


    await movePlayer(
        player,
        dice
    );


    isRolling = false;


    /*
       اگر برنده نشده باشد
    */

    if (!player.winner) {

        currentPlayerIndex++;


        if (
            currentPlayerIndex >=
            players.length
        ) {

            currentPlayerIndex = 0;

        }


        updateCurrentPlayer();


        rollDiceButton.disabled =
            false;


        gameMessage.textContent +=
            ` حالا نوبت ${players[currentPlayerIndex].name} است.`;

    }

}


/* =========================================================
   MOVE PLAYER
========================================================= */

async function movePlayer(
    player,
    dice
) {

    /*
       بررسی عبور از 100
    */

    if (
        player.position + dice >
        100
    ) {

        gameMessage.textContent =
            `${player.name} نمی‌تواند حرکت کند؛ عدد تاس زیاد است.`;


        await wait(700);

        return;

    }


    /*
       حرکت خانه به خانه
    */

    for (
        let i = 0;
        i < dice;
        i++
    ) {

        player.position++;


        updatePieces();


        playMoveSound();


        await wait(250);

    }


    /*
       بررسی مار
    */

    if (
        snakes[player.position]
    ) {

        const oldPosition =
            player.position;


        gameMessage.textContent =
            `${player.name} روی مار افتاد! 🐍`;


        playSnakeSound();


        await wait(800);


        player.position =
            snakes[player.position];


        updatePieces();


        gameMessage.textContent =
            `${player.name} از ${oldPosition} به ${player.position} برگشت. 🐍`;


        await wait(700);

    }


    /*
       بررسی پله
    */

    if (
        ladders[player.position]
    ) {

        const oldPosition =
            player.position;


        gameMessage.textContent =
            `${player.name} به پله رسید! 🪜`;


        playLadderSound();


        await wait(800);


        player.position =
            ladders[player.position];


        updatePieces();


        gameMessage.textContent =
            `${player.name} از ${oldPosition} به ${player.position} رفت. 🪜`;


        await wait(700);

    }


    /*
       بررسی برنده
    */

    if (
        player.position === 100
    ) {

        player.winner = true;


        gameMessage.textContent =
            `🎉 ${player.name} برنده بازی شد! 🎉`;


        playWinnerSound();


        rollDiceButton.disabled =
            true;


        showWinnerEffect(
            player
        );


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

        board.style.boxShadow =
            "none";

    }, 2000);

}


/* =========================================================
   WAIT FUNCTION
========================================================= */

function wait(milliseconds) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

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


    diceResultText.textContent =
        "-";


    gameMessage.textContent =
        "آماده‌ای؟ بازی را شروع کن!";


    board.style.boxShadow =
        "none";


    rollDiceButton.disabled =
        false;


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
