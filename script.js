
// script.js
const boardElem = document.getElementById('board');
const statusElem = document.getElementById('status');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameMode = null;
let gameActive = false;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function setMode(mode) {
  gameMode = mode;
  startGame();
}

function startGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusElem.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
}

function renderBoard() {
  boardElem.innerHTML = '';
  board.forEach((cell, i) => {
    const div = document.createElement('div');
    div.className = 'cell';
    div.textContent = cell;
    div.addEventListener('click', () => handleClick(i));
    boardElem.appendChild(div);
  });
}

function handleClick(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  updateBoard();

  const winner = checkWin();
  if (winner) {
    showWin(winner);
    return;
  }

  if (board.every(cell => cell !== '')) {
    statusElem.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusElem.textContent = `Player ${currentPlayer}'s turn`;

  if (gameMode === 'computer' && currentPlayer === 'O') {
    setTimeout(() => {
      const move = getBestMove();
      handleClick(move);
    }, 300);
  }
}

function updateBoard() {
  board.forEach((val, i) => {
    boardElem.children[i].textContent = val;
  });
}

function checkWin() {
  for (const [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], pattern: [a, b, c] };
    }
  }
  return null;
}

function showWin(winner) {
  statusElem.textContent = `Player ${winner.player} wins!`;
  winner.pattern.forEach(i => boardElem.children[i].classList.add('win'));
  gameActive = false;
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  const result = checkWin();
  if (result) return result.player === 'O' ? 10 - depth : depth - 10;
  if (newBoard.every(cell => cell !== '')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = 'O';
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = 'X';
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}