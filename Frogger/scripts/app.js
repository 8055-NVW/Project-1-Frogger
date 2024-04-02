// ? Elements
    // queryselector for span.lives
const livesEl = document.querySelector('.lives')
    // queryselector for span.score
const scoreEl = document.querySelector('.score')
    // queryselector for span.high-score
const highScoreEl = document.querySelector('.high-score')
    // querySelector for span.countdown
const countdownEl = document.querySelector('.countdown')
    // querySelector for button.start-game
const startGameBtn = document.querySelector('.start-game')
    // querySelector for div#game-board
const gameBoard = document.querySelector('#game-board')
    console.log(gameBoard)



// ? Variables
    // global score variable
let score = 0
    // global timer variable
let timer
    // check win variable?
let win
    // variable for lives
let lives = 3
    // variable for frog starting position

    // array containing collision classes on board
const obstacles = ['water','truck','car']



// ? On Page Load
    // view of highscore
    // load grid 

// ? Generate game board
    const cols = 9
    const rows = 9
    const cellCount = rows * cols
    const cells = []



    

// ? Executions 
    //function to initialise game with event listner for keydown
        //
    // function to handle keypress
        //define key up
        //define key down
        //define key left
        //define key right

    // function to handle collisions
        //define collision elements in array?
        // sequence through to check if frog class is included in the collision cells
        // if true initiate lose function

    // function to handle for win
        // check to see if frog makes it to .lillyPad 
        // add to score variable if true
        // keep frog class on the .lillypad cell
        // reset position of frog 

    // function to handle lose
        //check lives left
        //deduct life if lives remain
        //display final score on lising final life
        //initiate board reset function

    //function to reset game board
        // set .frog position to starting position
        // set timer to 1 minute
        // sety lives to 3
        // set score to zero

    // function to generate objects

    //function to define water
        // mark predefined cells with class of .water
        // add styling to the .water class

    //function to define a road
        // mark predefined cells with class of .road
        // add styling to .road class

    //function to define a lily-pad
        // mark predefined cells wilt class of .lillyPad
        //ass styling to .lillyPad class

    //function to define multiple classes for collision objects cars/trucks/logs 
        //obstacle functions
            //-- function to create car
                //-- create element
                //--

        //water element function
            //--function to create logs


// ? Events
    // eventlistener for start-game button click
