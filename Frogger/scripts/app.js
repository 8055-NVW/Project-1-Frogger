// ? Elements
// queryselector for span.lives
const livesEl = document.querySelector(".lives");
// queryselector for span.score
const scoreEl = document.querySelector(".score");
// queryselector for span.high-score
const highScoreEl = document.querySelector(".high-score");
// // querySelector for div.countdown-outer
// const countDownOuter = document.querySelector('.countdown-outer')
// querySelector for div.countdown
const countdownEl = document.querySelector(".countdown");
// querySelector for button.start-game
const startGameBtn = document.querySelector(".start-game");
// querySelector for div#game-board
const gameBoard = document.querySelector("#game-board");

// ? Variables
// global score variable
let score = 0;
scoreEl.innerText = score;
// check win variable?
let win;
// variable for lives
let lives = 30;
livesEl.innerText = lives;
//variable for countdown timer
const setTime = 20
let count = setTime;
countdownEl.innerText = count;
// variable for frog starting position
const froggyStartPos = 76;
//variable for froggys current position
let froggyCurrentPos = froggyStartPos;
//array for lillypads(end-goal)

// GameBoard constants
//Grid Constants
const cols = 9;
const rows = 9;
const cellCount = rows * cols;
const cells = [];

//lillyPads
const lillyPadCells = [1, 3, 5, 7];

//Road Start Positiopns
const carRight = [71, 66, 49, 45];
const busLeft = [54, 55, 56];

//Logs Start Positions
const logRowOne = [9, 10, 11, 14, 15, 16];
const logRowTwo = [20, 21, 22];
const logRowThree = [33, 34, 35];

//Frog on Log Variable
let frogMoved = false;

// ? On Page Load
// view of highscore

// ? Executions

// Function to generate game board
function makeGameBoard() {
    for (let index = 0; index < cellCount; index++) {
        const cell = document.createElement("div");
        cell.innerText = index;
        cell.dataset.index = index;
        cell.classList.add("grid-cell");
        cell.style.width = `${100 / cols}%`;
        cell.style.height = `${100 / rows}%`;
        //Make lillypads
        if (lillyPadCells.includes(index)) {
            cell.classList.add("lillypad");
            //make Water
        } else if (cell.dataset.index <= 35) {
            cell.classList.add("water");
            //make Grass
        } else if (cell.dataset.index <= 44) {
            cell.classList.add("grass");
            //make road
        } else if (cell.dataset.index <= 71) {
            cell.classList.add("road");
        } else {
            //make grass
            cell.classList.add("grass");
        }
        cells.push(cell);
        gameBoard.append(cell);
    }
    resetFrogPos();
    loadAssets();
}

// function to handle keypress
function inputHandler(e) {
    cells[froggyCurrentPos].classList.remove("frog");

    if (e.key === "ArrowRight" && froggyCurrentPos % cols !== cols - 1) {
        froggyCurrentPos++;
    } else if (e.key === "ArrowLeft" && froggyCurrentPos % cols !== 0) {
        froggyCurrentPos--;
        //Problem Point Sorted :D
    } else if (e.key === "ArrowUp" && cells[froggyCurrentPos - cols]) {
        if (!cells[froggyCurrentPos - cols].classList.contains("home")) {
            froggyCurrentPos -= cols;
        }
    } else if (e.key === "ArrowDown" && cells[froggyCurrentPos + cols]) {
        froggyCurrentPos += cols;
    }
    checkWinLose(froggyCurrentPos);
    cells[froggyCurrentPos].classList.add("frog");
}

//

// function to reset frogs position
function resetFrogPos() {
    //remove frog from board
    cells.forEach((cell) => cell.classList.remove("frog"));
    // reset
    froggyCurrentPos = froggyStartPos;
    setTimeout(() => {
        cells[froggyCurrentPos].classList.add("frog");
    }, 500);
}

// function to handle collisions
function collisionHandler(currentPos) {
    if (cells[currentPos].classList.contains("frog")) {
        lossHandler();
    }
}

//function to check win
function checkWinLose(currentPos) {
    if (cells[currentPos].classList.contains("lillypad")) {
        handleWin(cells[currentPos]);
    } else if (
        cells[currentPos].classList.contains("water") &&
        !cells[currentPos].classList.contains("log")
    ) {
        lossHandler();
    }
}


// function to handle for win(land on lillypad)
function handleWin(lily) {
    // add to score variable and update text
    score += 50;
    scoreEl.innerText = score;
    // keep frog class on the .lillypad cell
    lily.classList.add("home");
    // reset position of frog
    clearTimeout(startCountdown);
    clearInterval(interval);
    startCountdown()
    resetFrogPos();
}

// function to handle lose
function lossHandler() {
    //check lives left
    if (lives > 0) {
        //deduct life
        lives--;
        livesEl.innerText = lives;
        resetFrogPos();
    } else {
        // complete later
        //display final score on lising final life
        //initiate board reset function
    }
}

//function to reset game board
function gameReset() {
    //reset score
    score = 0;
    scoreEl.innerText = score;
    //reset lives
    lives = 3;
    livesEl.innerText = lives;
    //reset time
    count = setTime;
    countdownEl.innerText = count;
    //enable start button
    startGameBtn.disabled = false;
}

//function to load singel assets
function autoAssetLoader(arr, className) {
    arr.forEach((index) => {
        cells[index].classList.add(className);
    });
}

//function to load all assets
function loadAssets() {
    autoAssetLoader(carRight, "car");
    autoAssetLoader(busLeft, "bus");
    autoAssetLoader(logRowOne, "log");
    autoAssetLoader(logRowTwo, "log");
    autoAssetLoader(logRowThree, "log");
}

// FUNCTIONS FOR OBSTACLES

//Obstacle move right logic
function moveRight(arr, delay) {
    let positions = [...arr];
    setInterval(() => {
        positions.forEach((pos) => {
            cells[pos].classList.remove("bus");
            collisionHandler(pos)
        });
        positions = positions.map((pos) => {
            pos++;
            if (pos > 62) {
                pos -= cols;
            }
            collisionHandler(pos)
            cells[pos].classList.add("bus");
            return pos;
        });
    }, delay);
}

//Obstacle move left logic
function moveLeft(carPositionArr, delay) {
    let tempArr = [...carPositionArr];
    setInterval(() => {
        tempArr.forEach((obs, index) => {
            let obsPos = obs;
            collisionHandler(obsPos);
            cells[obsPos].classList.remove("car");
            if (obsPos === 63 || obsPos === 45) {
                obsPos += cols;
            }
            obsPos--;
            collisionHandler(obsPos);
            cells[obsPos].classList.add("car");
            tempArr[index] = obsPos;
        });
    }, delay);
}

//Function to move Log Left
function moveLogLeft(arr, delay) {
    let positions = [...arr];
    setInterval(() => {
        positions.forEach((pos) => {
            moveFrogOnLog(pos, "left");
            cells[pos].classList.remove("log");
        });
        positions = positions.map((pos) => {
            pos--;
            if (pos < 18) {
                pos += cols;
            }
            cells[pos].classList.add("log");
            return pos;
        });
    }, delay);
}

//Function to Move Log Right
function moveLogRight(arr, delay) {
    let positions = [...arr];
    setInterval(() => {
        positions.forEach((pos) => {
            moveFrogOnLog(pos, "right");
            cells[pos].classList.remove("log");
        });
        positions = positions.map((pos) => {
            pos++;
            if (arr === logRowOne && pos > 17) {
                pos -= cols;
            }
            if (arr === logRowThree && pos > 35) {
                pos -= cols;
                if(cells[pos].classList.contains('frog')){
                    console.log('OUT!')
                }
            }
            cells[pos].classList.add("log");
            return pos;
        });
    }, delay);
}

//Function to Move Frog on the Log
function moveFrogOnLog(pos, direction) {
    if (!frogMoved && cells[pos].classList.contains("frog")) {
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
    if (froggyCurrentPos % cols === cols - 1 || froggyCurrentPos < 18) {
        // resetFrogPos()
        console.log('hit right/left')
    }
}

//Function to Initialize Movement of all Moving Elements
function animateObstacles() {
    moveLeft(carRight, 500);
    moveRight(busLeft, 500);
    moveLogRight(logRowOne, 500);
    moveLogLeft(logRowTwo, 500);
    moveLogRight(logRowThree, 500);
}

// HandleCount
function startCountdown() {
    count = setTime;
    countdownEl.innerText = count;
    // function to handle seconds
    function timer() {
        count--;
        let remainingPercentage = (count/setTime) * 100
        countdownEl.style.width = `${remainingPercentage}%`;
        countdownEl.innerText = count;
        ;
        if (lives < 1) {
            clearTimeout(startCountdown);
            clearInterval(interval);
            gameReset();
        }
        if (count < 1) {
            lossHandler();
            clearInterval(interval);
            setTimeout(startCountdown, 1500);
        }
    }
    const interval = setInterval(timer, 1000);
}

//Handle Game
function initializeGame() {
    startGameBtn.disabled = true;
    //initialise grid load on start button click
    makeGameBoard();
    animateObstacles();
    document.addEventListener("keyup", inputHandler)
    startCountdown();
}















// ? Events
// eventlistener for start-game button click
startGameBtn.addEventListener("click", initializeGame);
