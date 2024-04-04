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
//Red carStart
const redCarStart = 71
const redCarStart2 = 53
const carStartPositions = [71,53]



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
        }
        cells.push(cell);
        gameBoard.append(cell);
    }
    resetFrogPos()
    // insert obstacles on game board
    loadAssets()

    // obstacleMvmt(redCarStart2)
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
    cells[froggyCurrentPos].classList.add('frog')
    checkWin(froggyCurrentPos)
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
        console.log('Hit Frog!')
        lossHandler()
    }
}



//function to check win
function checkWin(currentPos) {
    if (cells[currentPos].classList.contains('lillypad')) {
        console.log('there!')
        winHandler(cells[currentPos])
    }
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




//function to define water
// mark predefined cells with class of .water
// add styling to the .water class

//function to define a road
// mark predefined cells with class of .road
// add styling to .road class



//function to define multiple classes for collision objects cars/trucks/logs
//obstacle functions
//-- function to create car
//-- create element
//--

//water element function
//--function to create logs

//function to load obstacles 
function loadAssets() {
    //cars
    cells[carStartPositions[0]].classList.add('car')
    cells[carStartPositions[1]].classList.add('car')
}


//function to create car !!REDUNDANT
// function redCars() {
//     function car(redCarStart) {
//         let currPos = redCarStart
//         function move() {
//             if(redCarStart === 72) {
//                 cells[currPos].classList.remove('car')
//             if (currPos === 63) {
//                 currPos = currPos + cols
//             } else if (currPos === 45) {
//                 currPos = currPos + cols
//             }
//             currPos--
//             collisionHandler(currPos)
//             cells[currPos].classList.add('car')
//             }
            
//         }
//         move()
//         setInterval(move, 200);
//     }
//     car(redCarStart)
//     setTimeout(()=> {
//         car(redCarStart);
//     },800)
// }
// || startPos === 54

// V2 Object Movement
function obstacleMvmt(startPos) {
    function obstacle(startPos) {
        let currPos = startPos
        function move() {
            if(startPos === 71 || startPos === 53) {
                cells[currPos].classList.remove('car')
                if (currPos === 63) {
                    currPos = currPos + cols
                } else if (currPos === 45) {
                    currPos = currPos + cols
                }
                currPos--
            collisionHandler(currPos)
            cells[currPos].classList.add('car')
            } 
        }
        setInterval(move, 800);
    }
    obstacle(startPos)
    setTimeout(()=> {
        obstacle(startPos);
    },3000)
}

// function move(carPositionArr,delay) {
//     setInterval(()=> {
//         carPositionArr.forEach((obs) => {
//             //obstacle movement logic
//             let obsPos = obs      
//             cells[obsPos].classList.remove('car')
//                 if(obsPos === 63 || obsPos === 45) {
//                     obsPos+= cols
//                 }
//             collisionHandler(obsPos)
//             obsPos--       
//             cells[obsPos].classList.add('car')
//         })
//     },delay)
// }

// function move(carPositionArr, delay) {
//     setInterval(() => {
//         carPositionArr.forEach((obs) => {
//             let obsPos = obs;
//             cells[obsPos].classList.remove('car');
//             if (obsPos === 63 || obsPos === 45) {
//                 obsPos += cols;
//             }
//             collisionHandler(obsPos);
//             obsPos--;
//             cells[obsPos].classList.add('car');
//         });
//     }, delay);
// }

function move(carPositionArr, delay) {
    setInterval(() => {
        carPositionArr.forEach((obs, index) => {
            // obstacle movement logic
            let obsPos = obs;      
            cells[obsPos].classList.remove('car');
            if (obsPos === 63 || obsPos === 45) {
                obsPos += cols;
            }
            collisionHandler(obsPos);
            obsPos--;       
            cells[obsPos].classList.add('car');
            // Update the value in the original array
            carPositionArr[index] = obsPos;
        });
    }, delay);
}



function initializeGame() {
    startGameBtn.disabled = true
    //initialise grid load on start button click
    makeGameBoard()
    // Move obstacles
    move(carStartPositions,800)



    // function to manage timer interval
    function startCountdown() {
        count = 10
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


