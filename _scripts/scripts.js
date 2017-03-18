// Javascript File
// (function(){

//The canvas
var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");

//The game map
var map =
[
  [6,3,3,3,3,6,6,3,3,3,3,6],
  [3,1,1,1,1,1,1,1,1,1,1,3],
  [3,1,2,2,2,1,1,2,2,2,1,3],
  [3,1,1,1,2,2,1,1,1,1,1,3],
  [3,1,1,1,1,1,1,1,2,1,1,3],
  [3,1,2,2,2,1,1,2,2,2,1,3],
  [3,1,1,1,1,1,1,1,2,1,1,3],
  [3,1,1,1,2,2,2,1,1,1,1,3],
  [3,1,2,1,1,1,2,1,1,1,1,3],
  [3,1,2,2,1,1,2,2,2,2,1,3],
  [3,1,1,1,1,1,1,1,1,1,1,3],
  [6,3,3,3,3,3,3,3,3,3,3,6]
];

//The game objects map
var gameObjects =
[
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,5,0,0],
  [0,0,0,0,0,5,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,5,0,0,0,0,0,0,5,0,0],
  [0,0,0,0,0,0,5,0,0,0,0,0],
  [0,0,0,0,5,0,0,0,0,5,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,5,0,5,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,5,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0]
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

// Custom Game Variables - stored in one object variable
var gameVar = {
    // HTML Elements
    screenStart: document.getElementById('splashStart'),
    screenLevel: document.getElementById('gameLevel'),
    screenEnd: document.getElementById('splashEnd'),
    screenGame: document.getElementById('game'),
    messageEnd: document.getElementById('splashMessageEnd'),
    buttonStart: document.getElementById('btnStart'),
    buttonAudio: document.getElementById('btnAudio'),
    audioPlay: true,
    // Game Time
    gameTime: 20,
    // Player Speed Variables
    playerSpeed: 4,
    // Variables to track game levels and how many allowed
    currentLevel: 1,
    maxLevel: 3,
    // Sprite Objects
    exitKEY: null,
    exitBLOCK: null,
    // Variables used to randomly place Key and Exit on Map
    playerY: null,
    playerX: null,
    keyY: null,
    keyX: null,
    exitY: null,
    exitX: null,
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

};

// Function to check contents of Map tile
function checkTile(row, col, tileContent) {
    var mapTile = map[row][col];
    var notEmpty = true;
    console.log("Row & Col Parameter Passed In: " + row + " " + col + ". Content Parameter Tested: " + tileContent + ". Map Tile Content: " + mapTile);

    if (mapTile == tileContent) {
        notEmpty = false;
    }
    return notEmpty;
}
// Function when level is completed
function levelComplete() {
    var buttonStartLevel = document.getElementById('btnStartLevel');

    gameVar.screenLevel.style.display = 'block';
    buttonStartLevel.addEventListener("click", startNew, false);
    gameVar.screenLevel.textContent = "Level 2";

    // Function to start new level
    function startNew() {
        // Reset variables
        sprites = [];
        messages = [];
        boxes = [];
        walls = [];
        diamonds = [];
        diamondsDefused = 0;
        // Change Variable values for new level
        // Game Time
        console.log("gameVar.gameTime Var: " + gameVar.gameTime + " gameVar.playerSpeed: "+ gameVar.playerSpeed );
        gameVar.gameTime = gameVar.gameTime - 5;
        // Player Speed Variables
        gameVar.playerSpeed = gameVar.playerSpeed + 1;
        gameVar.screenLevel.style.display = 'none';
        gameTimer.reset();
        gameTimer.time = gameVar.gameTime;
        gameTimer.start();
        gameState = BUILD_MAP;
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
  //The animation loop
  requestAnimationFrame(update, canvas);

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
  assetsLoaded++;
  if(assetsLoaded === assetsToLoad.length)
  {
    //Remove the load handler
    image.removeEventListener("load", loadHandler, false);
    //Build the level
    gameState = BUILD_MAP;
  }
}

function buildMap(levelMap)
{
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

        switch (currentTile)
        {
          case FLOOR:
            var floor = Object.create(spriteObject);
            floor.sourceX = tilesheetX;
            floor.sourceY = tilesheetY;
            floor.x = column * SIZE;
            floor.y = row * SIZE;
            sprites.push(floor);
            break;

          case BOX:
            var box = Object.create(spriteObject);
            box.sourceX = tilesheetX;
            box.sourceY = tilesheetY;
            box.x = column * SIZE;
            box.y = row * SIZE;
            sprites.push(box);
            boxes.push(box);
            break;

          case WALL:
            var wall = Object.create(spriteObject);
            wall.sourceX = tilesheetX;
            wall.sourceY = tilesheetY;
            wall.x = column * SIZE;
            wall.y = row * SIZE;
            sprites.push(wall);
            walls.push(wall);
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
              break;

          case DIAMOND:
            var diamond = Object.create(spriteObject);
            diamond.sourceX = tilesheetX;
            diamond.sourceY = tilesheetY;
            diamond.sourceWidth = 64;
            diamond.sourceHeight = 64;
            diamond.width = 56;
            diamond.height = 56;
            diamond.x = column * SIZE + 10;
            diamond.y = row * SIZE + 16;
            diamonds.push(diamond);
            sprites.push(diamond);
            break;
        }
      }
    }
  }
}
// Function to create objects that are required before the main Map Build
function createFirstObjects() {
    // Sprite Exit Block Object
      gameVar.exitBLOCK = Object.create(spriteObject);
      gameVar.exitBLOCK.sourceX = 128;
      gameVar.exitBLOCK.sourceY = 0;
      gameVar.exitBLOCK.sourceWidth = 64;
      gameVar.exitBLOCK.sourceHeight = 64;
      gameVar.exitBLOCK.width = SIZE;
      gameVar.exitBLOCK.height = SIZE;
      // debugger;
      // Randomly choose the X and Y for the Exit Block - Restricts placement on timer or corners
      do {
          gameVar.exitY = gameVar.randomBetween(0,ROWS);
          gameVar.exitX = gameVar.randomBetween(0,COLUMNS);
      } while (checkTile(gameVar.exitY, gameVar.exitX, WALL));

      gameVar.exitBLOCK.x = gameVar.exitX * SIZE;
      gameVar.exitBLOCK.y = gameVar.exitY * SIZE;
      gameVar.exitBLOCK.visible = true;
      gameVar.exitBLOCK.key = false;
      map[gameVar.exitY][gameVar.exitX] = WALL_EXIT;
      sprites.push(gameVar.exitBLOCK);
}

function createOtherObjects()
{
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

// Game Player Object. Randomly placed
    player = Object.create(spriteObject);
    player.sourceX = 192;
    player.sourceY = 0;
    player.width = 48;
    player.height = 48;
    // Randomly choose the X and Y for the Player - Restricts placement to only FLOOR
    do {
        gameVar.playerY = gameVar.randomBetween(0,ROWS);
        gameVar.playerX = gameVar.randomBetween(0,COLUMNS);
    } while (checkTile(gameVar.playerY, gameVar.playerX, FLOOR));
    player.x = gameVar.playerX * SIZE;
    player.y = gameVar.playerY * SIZE;
    player.key = false;     // Variable to store if carrying Key;
    sprites.push(player);

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
      gameVar.keyY = gameVar.randomBetween(0,ROWS);
      gameVar.keyX = gameVar.randomBetween(0,COLUMNS);
  } while (checkTile(gameVar.keyY, gameVar.keyX, FLOOR));

  gameVar.exitKEY.x = gameVar.keyX * SIZE;
  gameVar.exitKEY.y = gameVar.keyY * SIZE;
  gameVar.exitKEY.visible = false;
  sprites.push(gameVar.exitKEY);

  timerMessage = Object.create(messageObject);
  timerMessage.x = 363;
  timerMessage.y = 10;
  timerMessage.font = "bold 40px Helvetica";
  timerMessage.fillStyle = "white";
  timerMessage.text = "";
  messages.push(timerMessage);
}

function playGame()
{
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
        if(hitTestCircle(player, gameVar.exitBLOCK))
        {
            gameVar.exitBLOCK.visible = false;
            endGame();
        // Change Game State to OVER to Exit or Next Level
        //   gameState = OVER;
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
      gameTimer.time ++;
      console.log("Total Diamonds / Dimond Captured: " + diamonds.length + " / " + diamondsDefused );
      if(diamondsDefused === diamonds.length)
      {
          gameVar.exitKEY.visible = true;
          gameVar.exitBLOCK.visible = true;
        //Change the game state to OVER if
        //the player has defused all the diamonds
        // gameState = OVER;
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
    gameTimer.stop();
    gameVar.currentLevel++;
    console.log("Current Game Level after + 1: " + gameVar.currentLevel);
    if (gameVar.currentLevel <= gameVar.maxLevel) {
        levelComplete();
    }

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
    gameVar.screenStart.style.display='none';
    gameVar.screenLevel.style.display='none';
    gameVar.screenGame.style.display='block';

    //The game timer
    gameTimer.time = gameVar.gameTime;
    gameTimer.start();
    //Start the game animation loop
    update();

}

// Play Background Music at game start
playAudio();

// Event listeners
gameVar.buttonAudio.addEventListener("click", playAudio, false);
gameVar.buttonStart.addEventListener("click", startGame, false);

// }());
