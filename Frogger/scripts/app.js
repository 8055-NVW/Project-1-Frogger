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
let lives = 3;
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
const lillyPadCells = [1,3,5,7]




// ? On Page Load
// view of highscore







// ? Executions




function resetFrogPos() {
    //remove frog from board
    cells.forEach(cell => cell.classList.remove('frog'))
    // reset 
    froggyCurrentPos = froggyStartPos
    cells[froggyCurrentPos].classList.add('frog')
}

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
    if(lillyPadCells.includes(index)) {
        cell.classList.add('lillypad')
    }
    cells.push(cell);
    gameBoard.append(cell);
  }
  resetFrogPos()
}



// function to handle keypress
function inputHandler(e) {
    cells[froggyCurrentPos].classList.remove('frog')
    if(e.key === 'ArrowRight' && froggyCurrentPos % cols !== cols - 1) {
        froggyCurrentPos++
    } else if (e.key === 'ArrowLeft' && froggyCurrentPos % cols !== 0) {
        froggyCurrentPos--
    } else if (e.key === 'ArrowUp' && cells[froggyCurrentPos - cols]) {
        froggyCurrentPos-= cols
    } else if (e.key === 'ArrowDown' && cells[froggyCurrentPos + cols]) {
        froggyCurrentPos+= cols
    }
    cells[froggyCurrentPos].classList.add('frog')
    winHandler()
}


// function to handle collisions
//define collision elements in array?
// sequence through to check if frog class is included in the collision cells
// if true initiate lose function

// function to handle for win
function winHandler() {
    // check to see if frog makes it to .lillyPad
    const lillyPadArr = document.querySelectorAll('.lillypad')
    lillyPadArr.forEach(lillyPad => {
        if(lillyPad.classList.contains('frog')) {  
            // add to score variable if true
            score+= 50
            scoreEl.innerText = score
            // keep frog class on the .lillypad cell

            // reset position of frog
            resetFrogPos()
            console.log(score)
        }
    })
    
}







// function to handle lose
//check lives left
//deduct life if lives remain
//display final score on lising final life
//initiate board reset function

//function to reset game board
function gameReset() {
    //reset score
    let score = 0;
    scoreEl.innerText = score
    //reset lives
    let lives = 3;
    livesEl.innerText = lives
    //reset time
    let count = 60
    countdownEl.innerText = count
    // set .frog position to starting position
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




function initializeGame() {
    startGameBtn.disabled = true
    //initialise grid load on start button click
    makeGameBoard()

    interval = setInterval(()=> {
        count--
        countdownEl.innerText = count
        document.addEventListener('keyup', inputHandler)
        if(count < 1) {
            lives--;
            livesEl.innerText = lives
            resetFrogPos()
            clearInterval(interval)
            interval = setInterval(intervalFunction, 2000)
        }
        
    },500)
}

// ? Events

// eventlistener for start-game button click   
startGameBtn.addEventListener('click',initializeGame)

