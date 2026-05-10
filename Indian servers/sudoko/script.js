const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const newPuzzleButton = document.getElementById('newPuzzle');
const validateButton = document.getElementById('validate');
const solveButton = document.getElementById('solve');
const resetButton = document.getElementById('reset');

const samplePuzzle = [
  0, 0, 0, 2, 6, 0, 7, 0, 1,
  6, 8, 0, 0, 7, 0, 0, 9, 0,
  1, 9, 0, 0, 0, 4, 5, 0, 0,
  8, 2, 0, 1, 0, 0, 0, 4, 0,
  0, 0, 4, 6, 0, 2, 9, 0, 0,
  0, 5, 0, 0, 0, 3, 0, 2, 8,
  0, 0, 9, 3, 0, 0, 0, 7, 4,
  0, 4, 0, 0, 5, 0, 0, 3, 6,
  7, 0, 3, 0, 1, 8, 0, 0, 0,
];

let currentPuzzle = [];
let solution = [];
const cells = [];

function createBoard() {
  boardElement.innerHTML = '';
  cells.length = 0;

  for (let i = 0; i < 81; i += 1) {
    const cell = document.createElement('div');
    cell.className = 'cell';

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.autocomplete = 'off';
    input.pattern = '[1-9]';
    input.inputMode = 'numeric';
    input.dataset.index = i;

    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeyDown);

    cell.appendChild(input);
    boardElement.appendChild(cell);
    cells.push({ cell, input });
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle.slice();
  solution = [];
  statusElement.textContent = '';

  cells.forEach(({ cell, input }, index) => {
    const value = puzzle[index];
    input.value = value === 0 ? '' : value;
    input.disabled = value !== 0;
    cell.classList.toggle('fixed', value !== 0);
    cell.classList.remove('invalid');
  });
}

function handleInput(event) {
  const input = event.target;
  const rawValue = input.value.replace(/[^1-9]/g, '');
  input.value = rawValue;
  if (rawValue.length === 0) {
    statusElement.textContent = '';
    return;
  }
  validateBoard(false);
}

function handleKeyDown(event) {
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.target.value = '';
    validateBoard(false);
  }
}

function getBoardValues() {
  return cells.map(({ input }) => {
    const value = parseInt(input.value, 10);
    return Number.isNaN(value) ? 0 : value;
  });
}

function validateBoard(showMessage = true) {
  const values = getBoardValues();
  let isValid = true;
  cells.forEach(({ cell }, index) => {
    cell.classList.remove('invalid');
  });

  for (let i = 0; i < 81; i += 1) {
    const value = values[i];
    if (value === 0) continue;
    const row = Math.floor(i / 9);
    const col = i % 9;

    for (let j = 0; j < 9; j += 1) {
      if (j !== col && values[row * 9 + j] === value) {
        isValid = false;
        cells[i].cell.classList.add('invalid');
        cells[row * 9 + j].cell.classList.add('invalid');
      }
      if (j !== row && values[j * 9 + col] === value) {
        isValid = false;
        cells[i].cell.classList.add('invalid');
        cells[j * 9 + col].cell.classList.add('invalid');
      }
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r += 1) {
      for (let c = boxCol; c < boxCol + 3; c += 1) {
        const index = r * 9 + c;
        if (index !== i && values[index] === value) {
          isValid = false;
          cells[i].cell.classList.add('invalid');
          cells[index].cell.classList.add('invalid');
        }
      }
    }
  }

  if (showMessage) {
    if (isValid) {
      statusElement.textContent = 'No conflicts detected.';
      statusElement.className = 'status success';
    } else {
      statusElement.textContent = 'Some entries conflict. Fix highlighted cells.';
      statusElement.className = 'status error';
    }
  }

  return isValid;
}

function findEmpty(values) {
  return values.findIndex((value) => value === 0);
}

function canPlace(values, index, digit) {
  const row = Math.floor(index / 9);
  const col = index % 9;

  for (let i = 0; i < 9; i += 1) {
    if (values[row * 9 + i] === digit) return false;
    if (values[i * 9 + col] === digit) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r += 1) {
    for (let c = boxCol; c < boxCol + 3; c += 1) {
      if (values[r * 9 + c] === digit) return false;
    }
  }

  return true;
}

function solveSudoku(values) {
  const emptyIndex = findEmpty(values);
  if (emptyIndex === -1) return true;

  for (let digit = 1; digit <= 9; digit += 1) {
    if (canPlace(values, emptyIndex, digit)) {
      values[emptyIndex] = digit;
      if (solveSudoku(values)) return true;
      values[emptyIndex] = 0;
    }
  }

  return false;
}

function solvePuzzle() {
  const values = getBoardValues();
  if (!validateBoard(true)) {
    statusElement.textContent = 'Resolve conflicts before solving.';
    return;
  }

  const working = values.slice();
  if (solveSudoku(working)) {
    working.forEach((value, index) => {
      cells[index].input.value = value;
    });
    statusElement.textContent = 'Puzzle solved!';
    statusElement.className = 'status success';
  } else {
    statusElement.textContent = 'No valid solution found.';
    statusElement.className = 'status error';
  }
}

function resetPuzzle() {
  loadPuzzle(samplePuzzle);
  statusElement.textContent = 'Puzzle reset.';
  statusElement.className = 'status';
}

newPuzzleButton.addEventListener('click', () => {
  loadPuzzle(samplePuzzle);
  statusElement.textContent = 'Loaded sample puzzle.';
  statusElement.className = 'status';
});

validateButton.addEventListener('click', () => validateBoard(true));
solveButton.addEventListener('click', solvePuzzle);
resetButton.addEventListener('click', resetPuzzle);

createBoard();
loadPuzzle(samplePuzzle);
