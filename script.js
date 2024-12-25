const gameBoard = document.getElementById("gameBoard");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetButton");

let boardState = Array(9).fill(null); // Array to track the board state
let currentPlayer = "O"; // Starting player


function createSvgX() {
  const animateClass = "animate-x";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="svg-x ${animateClass}">
    <line x1="10" y1="10" x2="90" y2="90" stroke="red" stroke-width="10" />
    <line x1="10" y1="90" x2="90" y2="10" stroke="red" stroke-width="10" />
  </svg>`;
}


function createSvgO() {
  let animated = true;
  const animateTag =
    '<animate attributeName="stroke-dashoffset" from="251.2" to="0" dur="0.2s" fill="freeze" /><animate attributeName="fill" from="none" to="blue" begin="0.5s" dur="0.2s" fill="freeze" />'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="svg-o">
    <circle cx="50" cy="50" r="40" stroke="blue" stroke-width="10" fill="none"
      stroke-dasharray="251.2" stroke-dashoffset="${animated ? '251.2' : ''}">
      ${animateTag}
    </circle>
  </svg>`;
}

function createBoard() {
  gameBoard.innerHTML = ""; // Clear the board
  boardState.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = index;

    if (value) {
      cell.innerHTML = value === "X" ? createSvgX() : createSvgO(); // Static X or O
      cell.classList.add("taken");
    }

    cell.addEventListener("click", handleCellClick);
    gameBoard.appendChild(cell);
  });
}

function handleCellClick(event) {
  const index = event.target.dataset.index;
  if (boardState[index] || checkWinner()) return;
  boardState[index] = currentPlayer;
  const cell = event.target;
  cell.innerHTML = currentPlayer === "X" ? createSvgX() : createSvgO();
  cell.classList.add("taken");

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function checkWinner() {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return combo;// boardState[a];
    }
  }

  return null;
}
function drawWinningLine(combo) {
  const line = document.createElement("div");
  line.classList.add("winning-line");

  // Hole die Gewinnerzellen
  const firstCell = document.querySelector(`[data-index="${combo[0]}"]`);
  const lastCell = document.querySelector(`[data-index="${combo[2]}"]`);

  if (!firstCell || !lastCell) {
    console.error("Die Gewinnerzellen konnten nicht gefunden werden.");
    return;
  }

  // Spielfeld und Zelleninformationen
  const boardRect = gameBoard.getBoundingClientRect();
  const firstCellRect = firstCell.getBoundingClientRect();
  const lastCellRect = lastCell.getBoundingClientRect();

  // Mittelpunkte der ersten und letzten Gewinnerzelle
  const x1 = firstCellRect.left + firstCellRect.width / 2 - boardRect.left;
  const y1 = firstCellRect.top + firstCellRect.height / 2 - boardRect.top;
  const x2 = lastCellRect.left + lastCellRect.width / 2 - boardRect.left;
  const y2 = lastCellRect.top + lastCellRect.height / 2 - boardRect.top;

  // Länge und Winkel des Strichs berechnen
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  // Setze die Position und das Design des Strichs
  line.style.width = `${length}px`;
  line.style.height = "10px"; // Dicke des Strichs
  line.style.backgroundColor = "black";
  line.style.position = "absolute";
  line.style.borderRadius = "5px";
  line.style.transformOrigin = "0 50%"; // Ursprung der Drehung (linke Seite des Strichs)
  line.style.transform = `rotate(${angle}deg)`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1 - 5}px`; // Zentriere den Strich vertikal in der Zelle

  // Füge den Strich dem Spielfeld hinzu
  gameBoard.appendChild(line);
}

resetButton.addEventListener("click", () => {
  boardState = Array(9).fill(null);
  currentPlayer = "X";
  statusText.textContent = "Spieler X beginnt.";
  createBoard();
});


function updateStatus() {
  const winningCombo = checkWinner();
  if (winningCombo) {
    statusText.textContent = `Spieler ${boardState[winningCombo[0]]} gewinnt!`;
    drawWinningLine(winningCombo); // Draw the line
    return;
  }

  if (!boardState.includes(null)) {
    statusText.textContent = "Unentschieden!";
    return;
  }

  statusText.textContent = `Spieler ${currentPlayer} ist am Zug.`;
}



createBoard();
updateStatus();
