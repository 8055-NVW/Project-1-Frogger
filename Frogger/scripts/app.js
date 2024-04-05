// ? Elements
// queryselector for span.lives
const livesEl = document.querySelector(".lives");
// queryselector for span.score
const scoreEl = document.querySelector(".score");
// queryselector for span.high-score
const highScoreEl = document.querySelector(".high-score");
// querySelector for span.countdown
const countdownEl = document.querySelector(".countdown");
// querySelector for button.start-game
const startGameBtn = document.querySelector(".start-game");
// querySelector for div#game-board
const gameBoard = document.querySelector("#game-board");



// ? Variables
// global score variable
let score = 0;
scoreEl.innerText = score
// check win variable?
let win;
// variable for lives
let lives = 30;
livesEl.innerText = lives
//variable for countdown timer
let count = 60
countdownEl.innerText = count
// variable for frog starting position
const froggyStartPos = 76;
//variable for froggys current position
let froggyCurrentPos = froggyStartPos;
//array for lillypads(end-goal)

// GameBoard constants
//lillyPads
const lillyPadCells = [1, 3, 5, 7]
//roadStart
const carStartRight = [71,66,49,45]
const busStartLeft = [54,55,56]
//Logs Start
const r1LogStart =[9,10,14,15]
const r2LogStart =[20,21,22]
const r3logStart =[27,28,30,31]




// ? On Page Load
// view of highscore

// ? Executions


// ? Generate game board
const cols = 9;
const rows = 9;
const cellCount = rows * cols;
const cells = [];

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
            cell.classList.add('lillypad')
        } else if (cell.dataset.index <= 35) {
            cell.classList.add('water')
        } else if (cell.dataset.index <= 44) {
            cell.classList.add('grass')
        } else if (cell.dataset.index <= 71) {
            cell.classList.add('road')
        } else {
            cell.classList.add('grass')
        }

        cells.push(cell);
        gameBoard.append(cell);
    }
    resetFrogPos()
    loadAssets()

}



// function to handle keypress
function inputHandler(e) {
    cells[froggyCurrentPos].classList.remove('frog')

    if (e.key === 'ArrowRight' && froggyCurrentPos % cols !== cols - 1) {
        froggyCurrentPos++
    } else if (e.key === 'ArrowLeft' && froggyCurrentPos % cols !== 0) {
        froggyCurrentPos--
        //Problem Point Sorted :D
    } else if (e.key === 'ArrowUp' && cells[froggyCurrentPos - cols]) {
        if (!cells[froggyCurrentPos - cols].classList.contains('home')) {
            froggyCurrentPos -= cols
        }
    } else if (e.key === 'ArrowDown' && cells[froggyCurrentPos + cols]) {
        froggyCurrentPos += cols
    }
    setInterval(checkWin(froggyCurrentPos), 50)
    // checkWin(froggyCurrentPos)
    cells[froggyCurrentPos].classList.add('frog')

}



// function to reset frogs position
function resetFrogPos() {
    //remove frog from board
    cells.forEach(cell => cell.classList.remove('frog'))
    // reset 
    froggyCurrentPos = froggyStartPos
    cells[froggyCurrentPos].classList.add('frog')
}



// function to handle collisions
function collisionHandler(currentPos) {
    if (cells[currentPos].classList.contains('frog')) {
        // console.log('Hit Frog!')
        lossHandler()
    }
}



//function to check win
function checkWin(currentPos) {
    if (cells[currentPos].classList.contains('lillypad')) {
        console.log('there!')
        winHandler(cells[currentPos])
    } else if (cells[currentPos].classList.contains('car'))
        console.log('frog hit car!')
}



// function to handle for win(land on lillypad)
function winHandler(lily) {
    // add to score variable and update text
    score += 50
    scoreEl.innerText = score
    // keep frog class on the .lillypad cell
    lily.classList.add('home')
    // reset position of frog
    resetFrogPos()
}


// function to handle lose
function lossHandler() {
    //check lives left
    if (lives > 0) {
        //deduct life
        lives--
        livesEl.innerText = lives
        resetFrogPos()
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
    scoreEl.innerText = score
    //reset lives
    lives = 3;
    livesEl.innerText = lives
    //reset time
    count = 60
    countdownEl.innerText = count
    //enable start button
    startGameBtn.disabled = false
}




//water element function
//--function to create logs

//function to load obstacles 
function loadAssets() {
    //cars
    carStartRight.forEach(position => {
        cells[position].classList.add('car')
    })

    busStartLeft.forEach(block => {
        cells[block].classList.add('bus')
    })
}

// V2 Object Movement
function obstacleMvmt(startPos) {
    function obstacle(startPos) {
        let currPos = startPos
        function move() {
            if (startPos === 71 || startPos === 53) {
                cells[currPos].classList.remove('car')
                if (currPos === 63) {
                    currPos = currPos + cols
                } else if (currPos === 45) {
                    currPos = currPos + cols
                }
                currPos--
                // collisionHandler(currPos)
                cells[currPos].classList.add('car')
            }
        }
        setInterval(move, 800);
    }
    obstacle(startPos)
    setTimeout(() => {
        obstacle(startPos);
    }, 3000)
}


//Object inteval control


function moveBus(busArr,delay) {
    let busPositions = [...busArr]
    setInterval(() => {
        busPositions.forEach(busPos => {
            cells[busPos].classList.remove('bus');
        });
        busPositions = busPositions.map(busPos => {
            busPos++;
            if (busPos > 62) {
                busPos = 54;
            }
            cells[busPos].classList.add('bus');
            return busPos;
        });
    }, delay);
}



//obstacle move left logic
function moveCar(carPositionArr, delay) {
    let tempArr = [...carPositionArr]
    setInterval(() => {
        tempArr.forEach((obs, index) => {
            let obsPos = obs;
            collisionHandler(obsPos)
            cells[obsPos].classList.remove('car')
            if (obsPos === 63 || obsPos === 45) {
                obsPos += cols;
            }
            obsPos--;
            setInterval(collisionHandler(obsPos), 50)
            cells[obsPos].classList.add('car')
            tempArr[index] = obsPos
        });
    }, delay);
}

// obstacle move right logic
// function moveRight(carPositionArr, delay) {
//     let tempArr = [...carPositionArr]
//     setInterval(() => {
//         tempArr.forEach((obs, index) => {
//             let obsPos = obs;
//             collisionHandler(obsPos)
//             cells[obsPos].classList.remove('car')
//             if (obsPos === 62) {
//                 obsPos -= cols;
//             }
//             obsPos++;
//             collisionHandler(obsPos)
//             cells[obsPos].classList.add('car')
//             tempArr[index] = obsPos
//         });
//     }, delay);
// }




function initializeGame() {
    startGameBtn.disabled = true
    //initialise grid load on start button click
    makeGameBoard()
    // Move obstacles
    // moveCar(carStartRight,500)
    // moveBus(busStartLeft,300)



    // function to manage timer interval
    function startCountdown() {
        count = 20
        countdownEl.innerText = count
        // function to handel seconds
        function timer() {
            count--
            countdownEl.innerText = count
            document.addEventListener('keyup', inputHandler)

            if (lives < 1) {
                clearTimeout(startCountdown)
                clearInterval(interval)
                gameReset()
            }
            if (count < 1) {
                //refactored this 
                lossHandler()
                // lives--;
                // livesEl.innerText = lives
                // resetFrogPos()
                clearInterval(interval)
                setTimeout(startCountdown, 1500);

            }

        }
        const interval = setInterval(timer, 1000)
    }
    startCountdown()
}


// ? Events

// eventlistener for start-game button click   
startGameBtn.addEventListener('click', initializeGame)


