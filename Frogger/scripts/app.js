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
countdownEl.innerText = count
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
const cells = []

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
    gameReset()
    startGameBtn.disabled = true
    for (let index = 0; index < cellCount; index++) {
        const cell = document.createElement("div")
        cell.innerText = index
        cell.dataset.index = index
        cell.classList.add("grid-cell")
        cell.style.width = `${100 / cols}%`
        cell.style.height = `${100 / rows}%`
        //Make lillypads
        if (lillyPadCells.includes(index)) {
            cell.classList.add("lillypad")
            //make Water
        } else if (cell.dataset.index <= 35) {
            cell.classList.add("water")
            //make Grass
        } else if (cell.dataset.index <= 44) {
            cell.classList.add("grass")
            //make road
        } else if (cell.dataset.index <= 71) {
            cell.classList.add("road")
        } else {
            //make grass
            cell.classList.add("grass")
        }
        cells.push(cell)
        gameBoard.append(cell)
    }

    resetFrogPos()

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

//

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
            lossHandler();
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
        scoreEl.innerText = score;
        cells[froggyCurrentPos].classList.add("home");
        resetFrogPos();
    }
    if (frogsHome === 4) {
        console.log('You Win!!!')
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
    countdownEl.innerText = count;
}

//function to reset game board
function gameReset() {
    frogsHome = 0
    score = 0;
    scoreEl.innerText = score;
    lives = 5;
    livesEl.innerText = lives;
    count = setTime;
    countdownEl.innerText = count;
}

//function to load singel assets
function autoAssetLoader(arr, className) {
    arr.forEach((index) => {
        cells[index].classList.add(className);
    });
    console.log('assets loaded')
}

//function to load all assets
function loadObstacles() {
    autoAssetLoader(carRight, "car");
    autoAssetLoader(busLeft, "bus");
    autoAssetLoader(logRowOne, "log");
    autoAssetLoader(logRowTwo, "log");
    autoAssetLoader(logRowThree, "log");
    console.log('loaded')
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

// const logLeft = setInterval(function(arr,Interval) {

// },interval)


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
    console.log('automated')
}

function disableObstacles() {
    clearInterval(moveRight)
}

// HandleCount
function startCountdown() {
    function timer() {
        let remainingPercentage = (count / setTime) * 100;
        countdownEl.style.width = `${remainingPercentage}%`;
        countdownEl.innerText = count;
        count--;
        if (count < 1) {
            clearInterval(timer)
        } else if (lives < 1) {
            gameOver()
        }
    }
    setInterval(timer, 1000);
}

function clearGameBoard() {
    gameBoard.innerHTML = ""
}

function clearTimers() {
    id = window.setInterval(function() {}, 0);
    while (id--) {
        window.clearInterval(id);
    }
}


function gameOver() {
    clearGameBoard()
    clearTimers()
    setTimeout(()=> {
        alert(`You Scored ${score}`)
    },300)
    startGameBtn.disabled = false
}


//Initialize Game
function initializeGame() {
    makeGameBoard()
    loadObstacles()
    automateObstacles(800)
    checkMoveTimer = setInterval(checkMove, 50)
    startCountdown()
    document.addEventListener("keyup", inputHandler);
}

// ? Events
// eventlistener for start-game button click
startGameBtn.addEventListener("click", initializeGame);
