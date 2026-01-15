const board = document.querySelector(".board");
const modal = document.querySelector(".modal");
const welcome = document.querySelector(".welcome");
const gameOver = document.querySelector(".game-over");
const btnPlay = document.querySelector(".btn-play");
const btnRestart = document.querySelector(".btn-restart");
const blockHeight = 50;
const blockWidth = 50;

//* Calculateting the number of blocks board can have according to screen size

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

// Force the grid to match your JS math exactly
// board.style.gridTemplateColumns = `repeat(${cols}, ${blockWidth}px)`;
// board.style.gridTemplateRows = `repeat(${rows}, ${blockHeight}px)`;

board.style.gridTemplateColumns = `repeat(${cols}, minmax(${blockWidth}px, 1fr))`;
board.style.gridTemplateRows = `repeat(${rows}, minmax(${blockHeight}px, 1fr))`;
const blocks = [];
// 3. Clear and Generate
board.innerHTML = "";
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.innerText = `${r}-${c}`;
    board.appendChild(block);

    blocks[`${r}-${c}`] = block;
  }
}

//* Here is full Game Logic

let interval;
let snake = [
  {
    x: 1,
    y: 8,
  },
  {
    x: 1,
    y: 9,
  },
  {
    x: 1,
    y: 10,
  },
];

let direction = "down";
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};
let score = 0;
let highscore = localStorage.getItem("highestScore") || 0;
document.getElementById("high-score").innerHTML = highscore;
let time = 0;
let timerIntervalId = null;

const BeginGame = () => {
  let head = null;

  if (direction == "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction == "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction == "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction == "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  if (GameOverCheck(head)) return;

  removeFill();
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    //* Food Consumed
    //? Here we are not shrinking the snake from tail so it grows
    score++;
    if (score > highscore) {
      storeScore(score);
    }
    // blocks[`${food.x}-${food.y}`].classList.remove("food-fill");
    removeFood();

    //? Food will not spawn inside snake body
    food = validFoodPosition();

    document.getElementById("score").innerText = score;
  } else {
    snake.pop();
  }
  addFill();

  //? Render food
  // blocks[`${food.x}-${food.y}`].classList.add("food-fill");
  giveFood();
};

//* Render and Remove Blocks
function removeFill() {
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("snake-fill");
  });
}

function addFill() {
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("snake-fill");
  });
}

function giveFood() {
  blocks[`${food.x}-${food.y}`].classList.add("food-fill");
}

function removeFood() {
  blocks[`${food.x}-${food.y}`].classList.remove("food-fill");
}

//* Game Logic

function GameOverCheck(head) {
  if (head.x < 0 || head.y < 0 || head.x >= rows || head.y >= cols) {
    gameOverAction();
    return true;
  }

  for (let i = 0; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) {
      gameOverAction();
      return true;
    }
  }
  return false;
}

function gameOverAction() {
  storeScore(score);
  clearInterval(interval);
  clearInterval(timerIntervalId);
  restartGame();
  score = 0;
  document.getElementById("score").innerText = score;
}

function storeScore(num) {
  if (num > highscore) {
    localStorage.setItem("highestScore", num);
    document.getElementById("high-score").innerHTML = num;
    highscore = num;
  }
}

function restartGame() {
  modal.style.display = "flex";
  welcome.style.display = "none";
  gameOver.style.display = "flex";
}

function NewGame() {
  removeFood();
  removeFill();
  modal.style.display = "none";

  snake = [
    {
      x: 1,
      y: 8,
    },
    {
      x: 1,
      y: 9,
    },
    {
      x: 1,
      y: 10,
    },
  ];

  direction = "down";

  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  //! Reset timer
  time = 0;
  document.getElementById("time").innerText = "00:00";
  //! Clear any existing timer before starting a new one
  if (timerIntervalId) clearInterval(timerIntervalId);

  interval = play();
}

// All Event Listeners
addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (e.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (e.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (e.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  }
});

btnPlay.addEventListener("click", () => {
  interval = play();

  modal.style.display = "none";
});

btnRestart.addEventListener("click", () => {
  NewGame();
});

function play() {
  //todo: TO understand this timeInterval shit
  timerIntervalId = setInterval(() => {
    time++;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    document.getElementById("time").innerText = formattedTime;
  }, 1000);

  return setInterval(() => {
    BeginGame();
  }, 200);
}

function validFoodPosition() {
  let isvalid = false;
  let position = null;

  while (!isvalid) {
    position = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };

    isValid = !snake.some(
      (snakepart) => snakepart.x === position.x && snakepart.y === position.y
    );
  }

  return position;
}
