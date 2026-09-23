/* =========================================================
   MAR O PALE
   NIKAN STUDIO
   4 PLAYER SNAKE & LADDER
   SOUND EDITION
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const board =
    document.getElementById("board");

const rollDiceButton =
    document.getElementById("rollDice");

const currentPlayerText =
    document.getElementById("currentPlayer");

const diceResultText =
    document.getElementById("diceResult");

const gameMessage =
    document.getElementById("gameMessage");

const startScreen =
    document.getElementById("startScreen");

const startGameButton =
    document.getElementById("startGame");

const soundButton =
    document.getElementById("soundButton");


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;

let soundEnabled = true;


/*
   ساخت AudioContext
*/

function initAudio() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {

            console.log(
                "AudioContext is not supported."
            );

            return;

        }

        audioContext =
            new AudioContext();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }

}


/*
   صدای اصلی
*/

function tone(
    frequency,
    duration,
    type = "sine",
    volume = 0.06
) {

    if (
        !soundEnabled ||
        !audioContext
    ) {
        return;
    }


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type =
        type;


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
        audioContext.currentTime +
        duration
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime +
        duration
    );

}


/* =========================================================
   START SOUND
========================================================= */

function playStartSound() {

    tone(
        523,
        0.12,
        "triangle",
        0.06
    );


    setTimeout(() => {

        tone(
            659,
            0.12,
            "triangle",
            0.06
        );

    }, 120);


    setTimeout(() => {

        tone(
            784,
            0.2,
            "triangle",
            0.07
        );

    }, 240);

}


/* =========================================================
   DICE
========================================================= */

function playDiceSound() {

    tone(
        300,
        0.06,
        "square",
        0.035
    );


    setTimeout(() => {

        tone(
            420,
            0.06,
            "square",
            0.035
        );

    }, 80);


    setTimeout(() => {

        tone(
            540,
            0.08,
            "square",
            0.04
        );

    }, 160);

}


/* =========================================================
   MOVE
========================================================= */

function playMoveSound() {

    tone(
        360,
        0.07,
        "triangle",
        0.025
    );

}


/* =========================================================
   SNAKE
========================================================= */

function playSnakeSound() {

    tone(
        500,
        0.12,
        "sawtooth",
        0.04
    );


    setTimeout(() => {

        tone(
            360,
            0.15,
            "sawtooth",
            0.04
        );

    }, 120);


    setTimeout(() => {

        tone(
            220,
            0.25,
            "sawtooth",
            0.045
        );

    }, 270);

}


/* =========================================================
   LADDER
========================================================= */

function playLadderSound() {

    tone(
        440,
        0.1,
        "triangle",
        0.045
    );


    setTimeout(() => {

        tone(
            550,
            0.1,
            "triangle",
            0.045
        );

    }, 100);


    setTimeout(() => {

        tone(
            660,
            0.1,
            "triangle",
            0.05
        );

    }, 200);


    setTimeout(() => {

        tone(
            880,
            0.16,
            "triangle",
            0.055
        );

    }, 300);

}


/* =========================================================
   WINNER
========================================================= */

function playWinnerSound() {

    const notes = [
        523,
        659,
        784,
        1046,
        1318
    ];


    notes.forEach(
        (note, index) => {

            setTimeout(() => {

                tone(
                    note,
                    0.22,
                    "triangle",
                    0.065
                );

            }, index * 140);

        }
    );

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


        if (
            (9 - row) % 2 === 1
        ) {

            numbers.reverse();

        }


        numbers.forEach(number => {

            const cell =
                document.createElement(
                    "div"
                );


            cell.classList.add(
                "cell"
            );


            cell.dataset.number =
                number;


            const numberElement =
                document.createElement(
                    "span"
                );


            numberElement.classList.add(
                "cell-number"
            );


            numberElement.textContent =
                number;


            cell.appendChild(
                numberElement
            );


            if (number === 1) {

                cell.classList.add(
                    "start"
                );

            }


            if (number === 100) {

                cell.classList.add(
                    "finish"
                );

            }


            if (snakes[number]) {

                const snake =
                    document.createElement(
                        "span"
                    );


                snake.classList.add(
                    "snake"
                );


                snake.textContent =
                    "🐍";


                cell.appendChild(
                    snake
                );

            }


            if (ladders[number]) {

                const ladder =
                    document.createElement(
                        "span"
                    );


                ladder.classList.add(
                    "ladder"
                );


                ladder.textContent =
                    "🪜";


                cell.appendChild(
                    ladder
                );

            }


            const pieceContainer =
                document.createElement(
                    "div"
                );


            pieceContainer.classList.add(
                "piece-container"
            );


            pieceContainer.id =
                `pieces-${number}`;


            cell.appendChild(
                pieceContainer
            );


            board.appendChild(
                cell
            );

        });

    }


    updatePieces();

}


/* =========================================================
   PIECES
========================================================= */

function updatePieces() {

    document
        .querySelectorAll(
            ".piece-container"
        )
        .forEach(container => {

            container.innerHTML =
                "";

        });


    players.forEach(player => {

        const container =
            document.getElementById(
                `pieces-${player.position}`
            );


        if (!container) return;


        const piece =
            document.createElement(
                "div"
            );


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
   CURRENT PLAYER
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
        colors[player.color];


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
        playerElements[
            currentPlayerIndex
        ]
    ) {

        playerElements[
            currentPlayerIndex
        ].classList.add(
            "active"
        );

    }

}


/* =========================================================
   WAIT
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
   ROLL DICE
========================================================= */

async function rollDice() {

    if (isRolling) return;


    initAudio();


    isRolling = true;


    rollDiceButton.disabled =
        true;


    const player =
        players[currentPlayerIndex];


    gameStarted = true;


    gameMessage.textContent =
        `${player.name} در حال انداختن تاس است...`;


    playDiceSound();


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


    if (
        player.position + dice >
        100
    ) {

        gameMessage.textContent =
            `${player.name} نمی‌تواند حرکت کند؛ عدد تاس زیاد است.`;


        await wait(700);

        return;

    }


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


    /* مار */

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


    /* پله */

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


    /* برنده */

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

function showWinnerEffect(
    player
) {

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
   RESET GAME
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
   START BUTTON
========================================================= */

startGameButton.addEventListener(
    "click",
    () => {

        /*
           این کلیک اجازه پخش صدا
           را از مرورگر می‌گیرد.
        */

        initAudio();


        /*
           صدای شروع
        */

        playStartSound();


        /*
           بستن صفحه شروع
        */

        startScreen.style.opacity =
            "0";


        startScreen.style.pointerEvents =
            "none";


        setTimeout(() => {

            startScreen.style.display =
                "none";

        }, 350);


        gameMessage.textContent =
            "بازی شروع شد! 🎲";


    }
);


/* =========================================================
   SOUND BUTTON
========================================================= */

soundButton.addEventListener(
    "click",
    () => {

        initAudio();


        soundEnabled =
            !soundEnabled;


        if (soundEnabled) {

            soundButton.textContent =
                "🔊 صدا روشن";


            playStartSound();

        } else {

            soundButton.textContent =
                "🔇 صدا خاموش";

        }

    }
);


/* =========================================================
   DICE BUTTON
========================================================= */

rollDiceButton.addEventListener(
    "click",
    rollDice
);


/* =========================================================
   START
========================================================= */

createBoard();

updateCurrentPlayer();

updatePieces();
