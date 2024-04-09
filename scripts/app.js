// ? Elements
const livesEl = document.querySelector(".lives")
const scoreEl = document.querySelector(".score")
const highScoreEl = document.querySelector(".high-score")
const countdownEl = document.querySelector(".countdown")
const startGameBtn = document.querySelector(".start-game")
const gameBoard = document.querySelector("#game-board")
const startScreenEl = document.querySelector('.rules-score')
const outcomeMessage = document.querySelector('#message')

//Audio Elements
let deadSound = new Audio('soundassets/dead.wav')
let homeSound = new Audio('soundassets/home.wav')
let jumpSound = new Audio('soundassets/jump.flac')
let loseSound = new Audio('soundassets/lose.wav')
let winSound = new Audio('soundassets/win.wav')
let soundTrack = new Audio('soundassets/soundtrack.m4a')

// ? Variables
let score = 0
scoreEl.innerText = score
let win;
let lives = 5
livesEl.innerText = lives
const setTime = 20
let count = setTime;
const froggyStartPos = 76
let froggyCurrentPos = froggyStartPos;
let frogsHome = 0
let frogMoved = false

// GameBoard constants
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

//LocalStorage variables to store highscore
let savedHighScore = localStorage.getItem('highscore')
// had to set to null to correct
if (savedHighScore === null) {
    savedHighScore = 0
}
highScoreEl.innerText = savedHighScore
//LOCALSTORAGE related functions
//Update highscore
function updateHighScore(newScore) {
    highScoreEl.innerText = newScore
    localStorage.setItem('highScore', newScore)
}
//Run a check on score 
function checkForHighScore(score) {
    let currentHighScore = parseInt(highScoreEl.innerText)
    if (score > currentHighScore) {
        highScoreEl.innerText = score
        updateHighScore(score)
    }
}



// ? Executions
// Function to generate game board
function makeGameBoard() {
    startScreenEl.style.display = 'none'
    gameReset()
    startGameBtn.disabled = true
    startGameBtn.style.pointerEvents = 'none'
    for (let index = 0; index < cellCount; index++) {
        const cell = document.createElement("div")
        // cell.innerText = index
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

//Function to handle keypress
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
    jumpSound.play()
    jumpSound.playbackRate = 4
    cells[froggyCurrentPos].classList.add("frog")
}

//Function to reset frogs position
function resetFrogPos() {
    cells.forEach((cell) => cell.classList.remove("frog"))
    froggyCurrentPos = froggyStartPos
    cells[froggyCurrentPos].classList.add("frog")
    clearInterval(timer)
}

//Function to handle lose scenarios
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

//Function to check and handle win scenarios
function checkWin() {
    if (cells[froggyCurrentPos].classList.contains("lillypad")) {
        score += 100
        scoreEl.innerText = score
        frogsHome++
        count = 20
        homeSound.play()
        cells[froggyCurrentPos].classList.add("home")
        resetFrogPos()
    }
    //Extra Points on game finish
    if (frogsHome === 4) {
        if(lives === 5){
            score += 500
        }else if(lives === 4) {
            score += 400
        }else if(lives === 3) {
            score += 300
        }else if(lives === 2) {
            score += 200
        }else if( lives === 1) {
            score += 100
        } 
        outcome()
    }
}

//Function to check on each move of the frog
function checkMove() {
    checkLose();
    checkWin();
}

// function to handle lose
function handleLoss() {
    lives--;
    livesEl.innerText = lives;
    resetFrogPos();
    count = setTime;
    deadSound.play()
}

//function to reset game board
function gameReset() {
    frogsHome = 0
    score = 0;
    scoreEl.innerText = score;
    lives = 5;
    livesEl.innerText = lives;
    count = setTime;
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


//HandleCount Function
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
//Function to clear the board of all classes
function clearGameBoard() {
    gameBoard.querySelectorAll('.grid-cell').forEach(function (div) {
        div.remove();
    });
    cells = []
}
//function to clear all running timers
function clearTimers() {
    id = window.setInterval(function () { }, 0);
    while (id--) {
        window.clearInterval(id);
    }
}
//Function to win/lose outro screen
function outcome() {
    stopGame()
    checkForHighScore(score)
    if (lives < 1) {
        loseSound.play()
        outcomeMessage.style.color = '#cf2a2a'
        outcomeMessage.innerText = `Oops! You lost with a final score of ${score}. Click the play button below to try again!"`
    } else {
        winSound.play()
        outcomeMessage.style.color = '#2cb038'
        outcomeMessage.innerText = `Hooray! You're a Froggy Champion! You leaped to victory with a score of ${score}! Ready to hop into another adventure? Click the play button below!`
    }
}

//Function to handle end game
function stopGame() {
    clearTimers()
    clearGameBoard()
    soundTrack.pause()
    soundTrack.currentTime = 0
    document.removeEventListener("keyup", inputHandler)
    startGameBtn.disabled = false
    startGameBtn.style.pointerEvents = 'auto'
    startScreenEl.style.display = 'flex'
}

//Initialise Game
function initialiseGame() {
    soundTrack.play()
    makeGameBoard()
    resetFrogPos()
    loadObstacles()
    automateObstacles(650)
    checkMoveTimer = setInterval(checkMove, 50)
    startCountdown()
    document.addEventListener("keyup", inputHandler)
}

// ? Events
startGameBtn.addEventListener("click", initialiseGame)
