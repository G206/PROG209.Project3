// Javascript File

//The canvas
var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");

//The game map
var map =
[
  [6,3,3,3,3,3,6,6,3,3,3,3,3,6],
  [3,1,1,1,1,1,1,1,1,1,1,1,1,3],
  [3,1,2,2,2,1,1,2,2,2,1,2,1,3],
  [3,1,1,1,2,2,1,1,1,1,1,2,1,3],
  [3,1,1,1,1,1,1,1,2,1,1,1,1,3],
  [3,1,2,2,2,1,1,2,2,2,2,2,1,3],
  [3,1,1,1,1,1,1,1,2,1,1,1,1,3],
  [3,1,1,1,2,2,2,1,2,1,2,1,1,3],
  [3,1,2,1,1,1,2,1,1,1,2,1,1,3],
  [3,1,2,2,1,1,2,2,2,2,2,2,1,3],
  [3,1,1,1,1,1,1,1,1,1,1,1,1,3],
  [6,3,3,3,3,3,3,3,3,3,3,3,3,6]
];

//The game objects map
var gameObjects =
[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,5,0,0,0,0],
  [0,0,0,0,0,5,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,5,0,0,0,0,0,0,5,0,0,0,0],
  [0,0,0,0,0,0,5,0,0,0,0,0,0,0],
  [0,0,0,0,5,0,0,0,0,5,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,5,0,5,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,5,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

//Map code
var EMPTY = 0;
var FLOOR = 1;
var BOX = 2;
var WALL = 3;
var PLAYER = 4;
var DIAMOND = 5;
var WALL_BLOCK = 6;
var WALL_EXIT = 7;

//The size of each tile cell
var SIZE = 64;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

//The number of columns on the tilesheet
var tilesheetColumns = 4;

//Sprites we need to access by name
var player = null;
var timeDisplay = null;
var timerMessage = null;

//Arrays to store the game objects
var sprites = [];
var messages = [];
var boxes = [];
var walls = [];
var diamonds = [];
var assetsToLoad = [];
var assetsLoaded = 0;

//Load the tilesheet image
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "_images/mazeEscape1.png";
assetsToLoad.push(image);

//Game variables
var diamondsDefused = 0;

//Game states
var LOADING = 0;
var BUILD_MAP = 1;
var PLAYING = 2;
var OVER = 3;
var gameState = LOADING;

//Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//Directions
var moveUp = false;
var moveDown = false;
var moveRight = false;
var moveLeft = false;

// Custom Game Variables added to existing code base - stored in one object variable
var gameVar = {
    // HTML Elements
    screenStart: document.getElementById('splashStart'),
    screenLevel: document.getElementById('splashLevel'),
    screenEnd: document.getElementById('splashEnd'),
    screenGame: document.getElementById('game'),
    screenGameLevel: document.getElementById('gameLevel'),
    messageEnd: document.getElementById('splashMessageEnd'),
    buttonStart: document.getElementById('btnStart'),
    buttonAudio: document.getElementById('btnAudio'),
    // ID to control animation
    gameAnimation: null,
    audioPlay: true,
    // Game Time & Bonus Time
    timeGame: 17,
    timeBonus: 1,
    // Player Speed Variables
    playerSpeed: 4,
    // Variables to track game levels, how many allowed, and dimonds on the board
    currentLevel: 1,
    maxLevel: 4,
    maxDiamonds: 14,
    // Sprite Objects
    exitKEY: null,
    exitBLOCK: null,
    // Variables used to randomly place Key and Exit on Map
    playerROW: null,
    playerCOL: null,
    exitCOL: null,
    exitROW: null,
    keyROW: null,
    keyCOL: null,
    // Function to return a random value in a given index
    randomLoc: function (array) {  //Parameter must be an array
        var location = array[Math.floor(Math.random() * array.length)];
        return location;
    },
    // Function to return a random number from two values given
    randomBetween: function (min, max) {
        var numBetween = Math.floor(Math.random() * (max-min)) + min;
        return numBetween;
    },
    // Variables to store game map as objects
    grid: makeArray(ROWS, COLUMNS),
    mapCell: {
    	colID: 0,
    	rowID: 0,
        mapValue: 0,
    	occupied: false,
    },
};

// Code to create 2 dimensional array from stackoverflow.com
function makeArray (rows, columns)  {
    this.rows = rows;
    this.columns = columns;
    this.myarray = new Array(this.rows);
    for (var i=0; i < this.columns; i +=1) {
        this.myarray[i]=new Array(this.rows);
    }
    return this.myarray;
}
// Function to check contents of Map tile with passed in Parameter
function checkTile(row, col, tileContent) {
    var mapTile = map[row][col];
    var notEmpty = true;

        console.log("checkTile Function. Row & Col Parameter Passed In: " + row + " " + col + ". Content Parameter Tested: " + tileContent + ". Map Tile Content: " + mapTile);

    if (mapTile == tileContent) {
        notEmpty = false;
    }
    return notEmpty;
}
// Function when current level is completed
function levelComplete() {
    var buttonStartLevel = document.getElementById('btnStartLevel');

        console.log("level Complete Function.");

    gameTimer.stop();
    // Stop Animation from Running
    cancelAnimationFrame(gameVar.gameAnimation);
    // Increase Game Level
    gameVar.currentLevel++;
        console.log("Current Game Level after + 1: " + gameVar.currentLevel);
    // Active Level Change Splash Screen
    if (gameVar.currentLevel <= gameVar.maxLevel) {
        gameVar.screenGameLevel.textContent = "LEVEL " + gameVar.currentLevel;
        gameVar.screenLevel.style.display = 'block';
        buttonStartLevel.addEventListener("click", startNew, false);
    } else {
        endGame();
    }

    // Function to start new level
    function startNew() {
        // Remove Event listeners
        buttonStartLevel.removeEventListener("click", startNew, false);
        // Reset variables
        sprites = [];
        messages = [];
        boxes = [];
        walls = [];
        diamonds = [];
        diamondsDefused = 0;
        // Remove Exit Block from old level
        map[gameVar.exitROW][gameVar.exitCOL] = WALL;
        // Delete sprite objects
        gameVar.exitKEY  = null;
        gameVar.exitBLOCK = null;
        // Change Variable values for new level
        // Game Time
        gameVar.timeGame = gameVar.timeGame - 5;
        // Player Speed Variables
        gameVar.playerSpeed = gameVar.playerSpeed + 2;

            console.log("gameVar.timeGame Var: " + gameVar.timeGame + " gameVar.playerSpeed: "+ gameVar.playerSpeed );
        // Close Splash screen and restart game
        gameVar.screenLevel.style.display = 'none';
        gameTimer.reset();
        gameTimer.time = gameVar.timeGame;
        gameTimer.start();
        gameState = BUILD_MAP;
        update();
    }
}
//Add keyboard listeners
window.addEventListener("keydown", function(event)
{
  switch(event.keyCode)
  {
    case UP:
	    moveUp = true;
	    break;

	  case DOWN:
	    moveDown = true;
	    break;

	  case LEFT:
	    moveLeft = true;
	    break;

	  case RIGHT:
	    moveRight = true;
	    break;
  }
}, false);

window.addEventListener("keyup", function(event)
{
  switch(event.keyCode)
  {
    case UP:
	    moveUp = false;
	    break;

	  case DOWN:
	    moveDown = false;
	    break;

	  case LEFT:
	    moveLeft = false;
	    break;

	  case RIGHT:
	    moveRight = false;
	    break;
  }
}, false);


function update()
{
// console.log("update Function");
  //The animation loop - ID Created to control Start / Stop
  gameVar.gameAnimation = requestAnimationFrame(update, canvas);

  //Change what the game is doing based on the game state
  switch(gameState)
  {
    case LOADING:
      console.log("loading...");
      break;

    case BUILD_MAP:
        createFirstObjects();
        buildMap(map);
        buildMap(gameObjects);
        createOtherObjects();
        gameState = PLAYING;
        break;

    case PLAYING:
      playGame();
      break;

    case OVER:
      endGame();
      break;
  }
  //Render the game
  render();
}

function loadHandler()
{
    console.log("loadHandler Function");

  assetsLoaded++;
  if(assetsLoaded === assetsToLoad.length)
  {
    //Remove the load handler
    image.removeEventListener("load", loadHandler, false);
    //Build the level
    gameState = BUILD_MAP;
  }
}
// Function to build game MAP
function buildMap(levelMap)
{
    console.log("buildMap Function");
  for(var row = 0; row < ROWS; row++)
  {
    for(var column = 0; column < COLUMNS; column++)
    {
      var currentTile = levelMap[row][column];

      if(currentTile !== EMPTY)
      {
        //Find the tile's x and y position on the tile sheet
        var tilesheetX = Math.floor((currentTile - 1) % tilesheetColumns) * SIZE;
        var tilesheetY = Math.floor((currentTile - 1) / tilesheetColumns) * SIZE;

        // Add property to GRID for all objects to determine if Tile is EMPTY
        switch (currentTile)
        {
          case FLOOR:
            var floor = Object.create(spriteObject);
            floor.sourceX = tilesheetX;
            floor.sourceY = tilesheetY;
            floor.x = column * SIZE;
            floor.y = row * SIZE;
            sprites.push(floor);
            gameVar.grid[row][column].occupied = false;
            break;

          case BOX:
            var box = Object.create(spriteObject);
            box.sourceX = tilesheetX;
            box.sourceY = tilesheetY;
            box.x = column * SIZE;
            box.y = row * SIZE;
            sprites.push(box);
            boxes.push(box);
            gameVar.grid[row][column].occupied= true;
            break;

          case WALL:
            var wall = Object.create(spriteObject);
            wall.sourceX = tilesheetX;
            wall.sourceY = tilesheetY;
            wall.x = column * SIZE;
            wall.y = row * SIZE;
            sprites.push(wall);
            walls.push(wall);
            gameVar.grid[row][column].occupied = true;
            break;

            // Special Wall Object to restrict placement of exit block
            case WALL_BLOCK:
              var wall_block = Object.create(spriteObject);
              wall_block.sourceX = 128;
              wall_block.sourceY = 0;
              wall_block.x = column * SIZE;
              wall_block.y = row * SIZE;
              sprites.push(wall_block);
              walls.push(wall_block);
              gameVar.grid[row][column].occupied = true;
              break;
        }
      }
    }
  }
}
// Function to create objects that are required before the main Map Build
function createFirstObjects() {
    console.log("createFirstObjects Function");

    // Sprite Exit Block Object
      gameVar.exitBLOCK = Object.create(spriteObject);
      gameVar.exitBLOCK.sourceX = 128;
      gameVar.exitBLOCK.sourceY = 0;
      gameVar.exitBLOCK.sourceWidth = 64;
      gameVar.exitBLOCK.sourceHeight = 64;
      gameVar.exitBLOCK.width = SIZE;
      gameVar.exitBLOCK.height = SIZE;

      // Randomly choose the X and Y for the Exit Block - Restricts placement on timer or corners
      do {
          gameVar.exitROW = gameVar.randomBetween(0,ROWS);
          gameVar.exitCOL = gameVar.randomBetween(0,COLUMNS);
            console.log("do while exit BLOCK loop. Row & Col Parameter Passed In: " + gameVar.exitROW + " " + gameVar.exitCOL + ". Occupied value: " + gameVar.grid[gameVar.exitROW][gameVar.exitCOL].occupied);
      } while (checkTile(gameVar.exitROW, gameVar.exitCOL, WALL));
      // Position Sprite on EMPTY tile
      gameVar.exitBLOCK.x = gameVar.exitCOL * SIZE;
      gameVar.exitBLOCK.y = gameVar.exitROW * SIZE;
      gameVar.exitBLOCK.visible = true;
      map[gameVar.exitROW][gameVar.exitCOL] = WALL_EXIT;
      gameVar.grid[gameVar.exitROW][gameVar.exitCOL].occupied = true;
      sprites.push(gameVar.exitBLOCK);
}

function createOtherObjects()
{
    console.log("createOtherObjects Function");
// Variables for only this function
    var countDiamonds = 0;
    var diamondROW;
    var diamondCOL;

    timeDisplay = Object.create(spriteObject);
    timeDisplay.sourceX = 0;
    timeDisplay.sourceY = 128;
    timeDisplay.sourceWidth = 128;
    timeDisplay.sourceHeight = 64;
    timeDisplay.width = 128;
    timeDisplay.height = 64;
    timeDisplay.x = canvas.width / 2 - timeDisplay.width / 2;
    timeDisplay.y = 0;
    sprites.push(timeDisplay);

// Create diamonds upto max limit
    do {
        var diamond = Object.create(spriteObject);
        diamond.sourceX = 0;
        diamond.sourceY = 64;
        diamond.sourceWidth = 64;
        diamond.sourceHeight = 64;
        diamond.width = 48;
        diamond.height = 48;
    // Randomly Place diamonds
        do {
            diamondROW = gameVar.randomBetween(0,ROWS);
            diamondCOL = gameVar.randomBetween(0,COLUMNS);
                console.log("do while exit Diamond loop. Row & Col Parameter Passed In: " + diamondROW + " " + diamondCOL + ". Occupied value: " + gameVar.grid[diamondROW][diamondCOL].occupied);

        } while (gameVar.grid[diamondROW][diamondCOL].occupied);
         // Position Sprite on EMPTY tile
        diamond.x = diamondCOL * SIZE + 8;
        diamond.y = diamondROW * SIZE + 8;
        console.log("Placed Diamond at ");
        diamonds.push(diamond);
        sprites.push(diamond);
        gameVar.grid[diamondROW][diamondCOL].occupied = true;
        countDiamonds ++;
    } while (countDiamonds < gameVar.maxDiamonds);

  //Sprite Key Object
  gameVar.exitKEY = Object.create(spriteObject);
  gameVar.exitKEY.sourceX = 64;
  gameVar.exitKEY.sourceY = 64;
  gameVar.exitKEY.sourceWidth = 64;
  gameVar.exitKEY.sourceHeight = 64;
  gameVar.exitKEY.width = SIZE;
  gameVar.exitKEY.height = SIZE;
  // Randomly choose the X and Y for the Key - Restricts placement to only FLOOR
  do {
      gameVar.keyROW = gameVar.randomBetween(0,ROWS);
      gameVar.keyCOL = gameVar.randomBetween(0,COLUMNS);
      console.log("do while exit Key loop. Row & Col Parameter Passed In: " + gameVar.keyROW + " " + gameVar.keyCOL + ". Occupied value: " + gameVar.grid[gameVar.keyROW][gameVar.keyCOL].occupied);

  } while (gameVar.grid[gameVar.keyROW][gameVar.keyCOL].occupied);
   // Position Sprite on EMPTY tile
  gameVar.grid[gameVar.keyROW][gameVar.keyCOL].occupied = true;
  gameVar.exitKEY.x = gameVar.keyCOL * SIZE;
  gameVar.exitKEY.y = gameVar.keyROW * SIZE;
  gameVar.exitKEY.visible = false;
  sprites.push(gameVar.exitKEY);

  // Coundown Timer Display
  timerMessage = Object.create(messageObject);
  timerMessage.x = 428;
  timerMessage.y = 10;
  timerMessage.font = "bold 40px Helvetica";
  timerMessage.fillStyle = "white";
  timerMessage.text = "";
  messages.push(timerMessage);

  // Game Player Object. Randomly placed
      player = Object.create(spriteObject);
      player.sourceX = 192;
      player.sourceY = 0;
      player.width = 48;
      player.height = 48;
      // Randomly choose the X and Y for the Player - Restricts placement to only FLOOR
      do {
          gameVar.playerROW = gameVar.randomBetween(0,ROWS);
          gameVar.playerCOL = gameVar.randomBetween(0,COLUMNS);
          console.log("do while PLAYER loop. Row & Col Parameter Passed In: " + gameVar.playerROW + " " + gameVar.playerCOL + ". Occupied value: " + gameVar.grid[gameVar.playerROW][gameVar.playerCOL].occupied);
      } while (gameVar.grid[gameVar.playerROW][gameVar.playerCOL].occupied);
      // Position Sprite on EMPTY tile
      player.x = gameVar.playerCOL * SIZE + 8;
      player.y = gameVar.playerROW * SIZE + 8;
      player.key = false;     // Variable to store if carrying Key;
      sprites.push(player);
}

function playGame()
{
    // console.log("playGame Function");
  //Up
  if(moveUp && !moveDown)
  {
    player.vy = -gameVar.playerSpeed;
  }
  //Down
  if(moveDown && !moveUp)
  {
    player.vy = gameVar.playerSpeed;
  }
  //Left
  if(moveLeft && !moveRight)
  {
    player.vx = -gameVar.playerSpeed;
  }
  //Right
  if(moveRight && !moveLeft)
  {
    player.vx = gameVar.playerSpeed;
  }

  //Set the player's velocity to zero if none of the keys are being pressed
  if(!moveUp && !moveDown)
  {
    player.vy = 0;
  }
  if(!moveLeft && !moveRight)
  {
    player.vx = 0;
  }

  player.x += player.vx;
  player.y += player.vy;

  if (!player.key) {
      //Player's screen boundaries with 64 pixel padding
      //to compensate for the screen border
      if(player.x < SIZE)
      {
        player.x = SIZE;
      }
      if(player.y < SIZE)
      {
        player.y = SIZE;
      }
      if(player.x + player.width > canvas.width - SIZE)
      {
        player.x = canvas.width - player.width - SIZE;
      }
      if(player.y + player.height > canvas.height - SIZE)
      {
        player.y = canvas.height - player.height - SIZE;
      }
  } else {
      // Once Player has key, remove boundary limitation
      if(player.x < 0)
      {
        player.x = 0;
      }
      if(player.y < 0)
      {
        player.y = 0;
      }
      if(player.x + player.width > canvas.width )
      {
        player.x = canvas.width - player.width;
      }
      if(player.y + player.height > canvas.height)
      {
        player.y = canvas.height - player.height;
      }
      // Collision with Exit BLOCK
        if(hitTestCircle(player, gameVar.exitBLOCK) &&  player.key)
        {
            gameVar.exitBLOCK.visible = false;
            levelComplete();

        }
        // Collisions with WALLS
        for(var i = 0; i < walls.length; i++)
        {
          blockRectangle(player, walls[i]);
        }
  }
  //Alternatively, move the player and set its screen boundaries at the same time with this code:
  //player.x = Math.max(64, Math.min(player.x + player.vx, canvas.width - player.width - 64));
  //player.y = Math.max(64, Math.min(player.y + player.vy, canvas.height - player.height - 64));

  // Collision with Exit Key
    if(hitTestCircle(player, gameVar.exitKEY) && gameVar.exitKEY.visible)
    {
      gameVar.exitKEY.visible = false;
      player.sourceX = 192;
      player.sourceY = 64;
      player.key = true;
      gameVar.exitBLOCK.sourceX = 128;
      gameVar.exitBLOCK.sourceY = 64;
    }

  //Collisions with boxes
  for(var i = 0; i < boxes.length; i++)
  {
    blockRectangle(player, boxes[i]);
  }

  //Collisions with diamonds
  for(var i = 0; i < diamonds.length; i++)
  {
    var diamond = diamonds[i];

    //If there's a collision, make the diamonds invisible,
    //reduce diamondsDefused by 1, and check whether
    //the player has won the game
    if(hitTestCircle(player, diamond) && diamond.visible)
    {
      diamond.visible = false;
      diamondsDefused++;
      gameTimer.time = gameTimer.time + gameVar.timeBonus;
        console.log("Total Diamonds / Dimond Captured: " + diamonds.length + " / " + diamondsDefused );
      if(diamondsDefused === diamonds.length)
      {
          gameVar.exitKEY.visible = true;
          gameVar.exitBLOCK.visible = true;
      }
    }
  }

  //Display the gameTimer
  timerMessage.text = gameTimer.time;

  //This modification adds an extra "0" to the time
  //if the time is less than 10
  if(gameTimer.time < 10)
  {
    timerMessage.text = "0" + gameTimer.time;
  }

  //Check whether the time is over
  if(gameTimer.time === 0)
  {
    gameState = OVER;
  }
}

function endGame()
{
        console.log("endGame Function.");
    gameTimer.stop();
    cancelAnimationFrame(gameVar.gameAnimation);
  if(diamondsDefused === diamonds.length)
  {
      gameVar.messageEnd.textContent = "It appears you have WON. Must be beginner's luck...";
    // gameOverMessage.text = "You Won!";
  }
  else
  {
      gameVar.messageEnd.textContent = "You have LOST. Try your luck next time...";
    // gameOverMessage.text = "You Lost!";
  }
  gameVar.screenEnd.style.display = 'block';

}

function render()
{
    // console.log("render Function");
  drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

  //Display the sprites
  if(sprites.length !== 0)
  {
    for(var i = 0; i < sprites.length; i++)
	{
	  var sprite = sprites[i];
	  if(sprite.visible)
	  {
        drawingSurface.drawImage
        (
           image,
           sprite.sourceX, sprite.sourceY,
           sprite.sourceWidth, sprite.sourceHeight,
           Math.floor(sprite.x), Math.floor(sprite.y),
           sprite.width, sprite.height
        );
      }
    }
  }

  //Display the game messages
  if(messages.length !== 0)
  {
    for(var i = 0; i < messages.length; i++)
    {
      var message = messages[i];
      if(message.visible)
      {
        drawingSurface.font = message.font;
        drawingSurface.fillStyle = message.fillStyle;
        drawingSurface.textBaseline = message.textBaseline;
        drawingSurface.fillText(message.text, message.x, message.y);
      }
    }
  }
}
// Function to play/stop audio file
function playAudio() {
    console.log("playAudio Function");
	var audio = document.getElementById("audio");

    if (gameVar.audioPlay) {
        audio.loop = true;
    	audio.play();
    } else {
        audio.pause();
    }

    if (gameVar.audioPlay) {
        gameVar.audioPlay = false;
    } else if (!gameVar.audioPlay) {
        gameVar.audioPlay = true;
    }

}

// Function to initialize Game
function startGame() {
    console.log("startGame Function");
    // Initialize Grid Variable
    for (i=0; i<ROWS; i++){
		for (j=0; j<COLUMNS; j++) {
			gameVar.grid[i][j] = Object.create(gameVar.mapCell);
            gameVar.grid[i][j].rowID = i;
			gameVar.grid[i][j].colID = j;
			gameVar.grid[i][j].value = map[i][j];
		}
	}
    //Remove Event listeners
    gameVar.buttonStart.removeEventListener("click", startGame, false);
    // Close Start Splash screen and start Game Screen
    gameVar.screenStart.style.display='none';
    gameVar.screenGame.style.display='block';

    //The game timer
    gameTimer.time = gameVar.timeGame;
    gameTimer.start();
    //Start the game animation loop
    update();
}

// Play Background Music at game start
playAudio();

// Event listeners
gameVar.buttonAudio.addEventListener("click", playAudio, false);
gameVar.buttonStart.addEventListener("click", startGame, false);
