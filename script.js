// get elements
const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const resetBtn = document.getElementById("resetBtn");
const gameScore = document.getElementById("gameScore");
const gameHighScore = document.getElementById("highScore");

// game sound
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");

// change width and height
if (screen.width < 500) {
  gameBoard.width = screen.width - 20;
  gameBoard.height = screen.width - 20;
}

// width and height
let gameWidth = gameBoard.width;
let gameHeight = gameBoard.height;

//set values
const unitSize = gameWidth / 20; //changes

// set positions
let xVelocity = unitSize;
let yVelocity = 0;
let xFood;
let yFood;

let score;
let highScore;

// set snake initial body
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

gameStart();

// key press
window.addEventListener("keydown", changeDirection);

// reset button
resetBtn.addEventListener("click", gameReset);

// game start
function gameStart() {
  running = true;
  score = 0;
  nextTick();
  displayHighScore();
  createFood();
  drawFood();
  changeScore();
}

// main
function nextTick() {
  if (running) {
    setTimeout(() => {
      checkGameOver();
      clearBoard();
      moveSnake();
      drawSnake();
      drawFood();
      nextTick();
    }, 75);
  } else {
    displayGameOver();
  }
}

// clear board
function clearBoard() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

// snake move
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);

  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    foodSound.play();
    changeScore();
    createFood();
  } else {
    snake.pop();
  }
}

// snake draw
function drawSnake() {
  ctx.fillStyle = "green";
  ctx.strokeStyle = "white";

  for (const snakePart of snake) {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  }
}

// create food only called when snake take food
function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameWidth - unitSize);
}

// draw food
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

// snake direction
function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;
  const arr = [37, 38, 39, 40];

  if (arr.includes(keyPressed)) {
    moveSound.play();
  }

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

// change score
function changeScore() {
  gameScore.textContent = score;
}

// game reset
function gameReset() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
}

// check game over
function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }

  if (running === false) {
    gameOverSound.play();
  }
}

// display game over
function displayGameOver() {
  let result = displayHighScore();

  ctx.font = `${gameWidth / 10}px MV Boli`;
  ctx.fillStyle = "White";
  ctx.textAlign = "center";

  // new high score
  if (result == true) {
    ctx.fillText("NEW HIGH SCORE", gameWidth / 2, gameHeight / 2);
  } else {
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  }
  running = false;
}

// high score
function displayHighScore() {
  highScore = localStorage.getItem("highScore");

  if (!highScore) {
    highScore = 0;
  }

  // set high score
  gameHighScore.textContent = `High Score : ${highScore}`;

  if (score > highScore) {
    localStorage.setItem("highScore", score);
    return (newHighScore = true);
  }
}
