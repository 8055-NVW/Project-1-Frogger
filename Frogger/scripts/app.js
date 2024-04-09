// ? Elements
// queryselector for span.lives
const livesEl = document.querySelector(".lives")
// queryselector for span.score
const scoreEl = document.querySelector(".score")
// queryselector for span.high-score
const highScoreEl = document.querySelector(".high-score")
// querySelector for div.countdown
const countdownEl = document.querySelector(".countdown")
// querySelector for button.start-game
const startGameBtn = document.querySelector(".start-game")
// querySelector for div#game-board
const gameBoard = document.querySelector("#game-board")
const startScreenEl = document.querySelector('.rules-score')
const outcomeMessage = document.querySelector('#message')

// ? Variables
// global score variable
let score = 0
scoreEl.innerText = score
// check win variable?
let win;
// variable for lives
let lives = 5
livesEl.innerText = lives
//variable for countdown timer
const setTime = 20
let count = setTime;
// countdownEl.innerText = count
// variable for frog starting position
const froggyStartPos = 76
//variable for froggys current position
let froggyCurrentPos = froggyStartPos;
//finish game check
let frogsHome = 0
let frogMoved = false

// GameBoard constants
//Grid Constants
const cols = 9
const rows = 9
const cellCount = rows * cols
let cells = []

//lillyPads
const lillyPadCells = [1, 3, 5, 7]

//Road Start Positiopns
const carRight = [71, 66, 49, 45]
const busLeft = [54, 55, 56]

//Logs Start Positions
const logRowOne = [9, 10, 11, 14, 15, 16]
const logRowTwo = [20, 21, 22]
const logRowThree = [33, 34, 35]


//Timer Variables
let checkMoveTimer
let timer

// ? On Page Load
// view of highscore

// ? Executions


// Function to generate game board
function makeGameBoard() {
    startScreenEl.style.display = 'none'
    gameReset()
    startGameBtn.disabled = true
    startGameBtn.style.pointerEvents = 'none'
    for (let index = 0; index < cellCount; index++) {
        const cell = document.createElement("div")
        cell.innerText = index
        cell.dataset.index = index
        cell.classList.add("grid-cell")
        cell.style.width = `${100 / cols}%`
        cell.style.height = `${100 / rows}%`
        if (lillyPadCells.includes(index)) {
            cell.classList.add("lillypad")
        } else if (cell.dataset.index <= 35) {
            cell.classList.add("water")
        } else if (cell.dataset.index <= 44) {
            cell.classList.add("grass")
        } else if (cell.dataset.index <= 71) {
            cell.classList.add("road")
        } else {
            cell.classList.add("grass")
        }
        cells.push(cell)
        gameBoard.append(cell)
    }
}

// function to handle keypress
function inputHandler(e) {
    cells[froggyCurrentPos].classList.remove("frog")
    if (e.key === "ArrowRight" && froggyCurrentPos % cols !== cols - 1) {
        froggyCurrentPos++
    } else if (e.key === "ArrowLeft" && froggyCurrentPos % cols !== 0) {
        froggyCurrentPos--
        //Problem Point Sorted :D
    } else if (e.key === "ArrowUp" && cells[froggyCurrentPos - cols]) {
        if (!cells[froggyCurrentPos - cols].classList.contains("home")) {
            froggyCurrentPos -= cols
        }
    } else if (e.key === "ArrowDown" && cells[froggyCurrentPos + cols]) {
        froggyCurrentPos += cols
    }
    cells[froggyCurrentPos].classList.add("frog")
}

// function to reset frogs position
function resetFrogPos() {
    cells.forEach((cell) => cell.classList.remove("frog"))
    froggyCurrentPos = froggyStartPos
    cells[froggyCurrentPos].classList.add("frog")
    clearInterval(timer)
}

function checkLose() {
    switch (true) {
        case cells[froggyCurrentPos].classList.contains("car"):
        case cells[froggyCurrentPos].classList.contains("bus"):
        case cells[froggyCurrentPos].classList.contains("water") &&
            !cells[froggyCurrentPos].classList.contains("log"):
        case count < 0:
            handleLoss();
            break;
        default:
            break;
    }
}

function checkWin() {
    if (cells[froggyCurrentPos].classList.contains("lillypad")) {
        score += 100;
        frogsHome++
        count = 20
        console.log(frogsHome)
        // scoreEl.innerText = score;
        cells[froggyCurrentPos].classList.add("home");
        resetFrogPos();
    }
    if (frogsHome === 4) {
        outcome()
    }
}

function checkMove() {
    checkLose();
    checkWin();
}



//SUNDAY
// function to handle collisions REDUNDANT
// function collisionHandler(currentPos) {
//     if (cells[currentPos].classList.contains("frog")) {
//         lossHandler();
//     }
// }

//function to check win REDUNDANT
// function checkWinLose(currentPos) {
//     if (cells[currentPos].classList.contains("lillypad")) {
//         handleWin(cells[currentPos]);
//     } else if (
//         cells[currentPos].classList.contains("water") &&
//         !cells[currentPos].classList.contains("log")
//     ) {
//         lossHandler();
//     }
// }

// function to handle for win(land on lillypad) REDUNDANT
// function handleWin() {
//     score += 50;
//     scoreEl.innerText = score;
//     cells[froggyCurrentPos].classList.add("home");
//     clearTimeout(startCountdown);
//     resetFrogPos();
// }

// function to handle lose
function handleLoss() {
    lives--;
    livesEl.innerText = lives;
    resetFrogPos();
    count = setTime;
    // countdownEl.innerText = count;
}

//function to reset game board
function gameReset() {
    frogsHome = 0
    score = 0;
    scoreEl.innerText = score;
    lives = 5;
    livesEl.innerText = lives;
    count = setTime;
    // countdownEl.innerText = count;
}

//function to load singel assets
function autoAssetLoader(arr, className) {
    arr.forEach((index) => {
        cells[index].classList.add(className);
    });
}

//function to load all assets
function loadObstacles() {
    autoAssetLoader(carRight, "car");
    autoAssetLoader(busLeft, "bus");
    autoAssetLoader(logRowOne, "log");
    autoAssetLoader(logRowTwo, "log");
    autoAssetLoader(logRowThree, "log");
}

// FUNCTIONS FOR OBSTACLES

//Obstacle move right logic
function moveRight(arr, interval) {
    let positions = [...arr];
    setInterval(() => {
        positions.forEach((pos) => {
            cells[pos].classList.remove("bus");
        });
        positions = positions.map((pos) => {
            pos++;
            if (pos > 62) {
                pos -= cols;
            }
            cells[pos].classList.add("bus");
            return pos;
        });
    }, interval);
}

//Obstacle move left logic
function moveLeft(arr, interval) {
    let tempArr = [...arr];
    setInterval(() => {
        tempArr.forEach((obs, index) => {
            let obsPos = obs;
            cells[obsPos].classList.remove("car");
            if (obsPos === 63 || obsPos === 45) {
                obsPos += cols;
            }
            obsPos--;
            cells[obsPos].classList.add("car");
            tempArr[index] = obsPos;
        });
    }, interval);
}

//Function to move Log Left
function moveLogLeft(arr, interval) {
    let positions = [...arr]
    setInterval(() => {
        positions.forEach((pos) => {
            moveFrogOnLog(pos, 'left')
            cells[pos].classList.remove("log")
        })
        positions = positions.map((pos) => {
            pos--;
            if (pos < 18) {
                pos += cols
            }
            cells[pos].classList.add("log")
            return pos
        })
    }, interval)
}


//Function to Move Log Right
function moveLogRight(arr, interval) {
    let positions = [...arr]
    setInterval(() => {
        positions.forEach((pos) => {
            moveFrogOnLog(pos, "right")

            cells[pos].classList.remove("log")
        })
        positions = positions.map((pos) => {
            pos++
            if (arr === logRowOne && pos > 17) {
                pos -= cols;
            }
            if (arr === logRowThree && pos > 35) {
                pos -= cols
                if (cells[pos].classList.contains("frog")) {
                }
            }
            cells[pos].classList.add("log")
            return pos;
        });
    }, interval);
}

//Function to Move Frog on the Log
function moveFrogOnLog(pos, direction) {
    if (!frogMoved && cells[pos].classList.contains("frog")) {
        if (froggyCurrentPos % cols === cols - 1 || froggyCurrentPos % cols === 0) {
           return handleLoss()
        }
        cells[froggyCurrentPos].classList.remove("frog");
        if (direction === "left") {
            froggyCurrentPos--;
        } else if (direction === "right") {
            froggyCurrentPos++;
        }
        cells[froggyCurrentPos].classList.add("frog");
        frogMoved = true;
    } else {
        frogMoved = false;
    }
}


//Function to Initialize Movement of all Moving Elements
function automateObstacles(interval) {
    moveLeft(carRight, interval);
    moveRight(busLeft, interval);
    moveLogRight(logRowOne, interval);
    moveLogLeft(logRowTwo, interval);
    moveLogRight(logRowThree, interval);
}

function disableObstacles() {
    clearInterval(moveRight)
}

// HandleCount
function startCountdown() {
    function timer() {
        let remainingPercentage = (count / setTime) * 100;
        countdownEl.style.width = `${remainingPercentage}%`;
        count--;
        if (count < 1) {
            clearInterval(timer)
        } else if (lives < 1) {
            outcome()
        }
    }
    setInterval(timer, 1000);
}

function clearGameBoard() {
    gameBoard.querySelectorAll('.grid-cell').forEach(function(div) {
        div.remove();
    });
    cells = []
}

function clearTimers() {
    id = window.setInterval(function() {}, 0);
    while (id--) {
        window.clearInterval(id);
    }
}


function outcome() {
    stopGame()
    if(lives < 1) {
        outcomeMessage.style.color = '#cf2a2a'
        outcomeMessage.innerText = `Oops! You lost with a final score of ${score}. Click the play button below to try again!"`
    } else {
        outcomeMessage.style.color = '##2cb038'
        outcomeMessage.innerText =`Hooray! You're a Froggy Champion! You leaped to victory with a score of ${score}! Ready to hop into another adventure? Click the play button below!`
    }
}


function stopGame() {
    clearTimers()
    clearGameBoard()
    document.removeEventListener("keyup", inputHandler)
    startGameBtn.disabled = false
    startGameBtn.style.pointerEvents = 'auto'
    startScreenEl.style.display = 'flex'
}


//Initialize Game
function initializeGame() {
    makeGameBoard()
    resetFrogPos()
    loadObstacles()
    automateObstacles(800)
    checkMoveTimer = setInterval(checkMove, 50)
    startCountdown()
    document.addEventListener("keyup", inputHandler)
}

// ? Events
startGameBtn.addEventListener("click", initializeGame)
