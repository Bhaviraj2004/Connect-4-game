// Grab references to the DOM elements
const button2 = document.getElementById('button2');
const resetButton = document.getElementById('click');
const statusElement = document.querySelector('h1'); // For displaying winner
let currentPlayer = 1; // Start with Player 1 (Red)
let board = Array.from(document.getElementsByClassName('box')); // Get all cells (boxes)

// Initialize the game board as a 6x7 grid
let boardState = Array(6).fill(null).map(() => Array(7).fill(''));

// Function to find the lowest empty row in the selected column
function getLowestEmptyRow(col) {
    for (let row = 5; row >= 0; row--) {
        if (boardState[row][col] === '') {
            return row;
        }
    }
    return -1; // Column is full
}

// Function to check for a win in any direction
function checkWin(row, col) {
    const directions = [
        { r: 1, c: 0 },  // Vertical
        { r: 0, c: 1 },  // Horizontal
        { r: 1, c: 1 },  // Diagonal "/"
        { r: 1, c: -1 }  // Diagonal "\"
    ];
    const target = boardState[row][col];

    function countInDirection(rDir, cDir) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
            const r = row + rDir * i;
            const c = col + cDir * i;
            if (r >= 0 && r < 6 && c >= 0 && c < 7 && boardState[r][c] === target) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    for (const { r, c } of directions) {
        if (countInDirection(r, c) + countInDirection(-r, -c) - 1 >= 4) {
            return true; // 4 in a row
        }
    }
    return false;
}

// Function to handle the computer's move
function computerMove() {
    let availableColumns = [];

    // Find available columns (ones that aren't full)
    for (let col = 0; col < 7; col++) {
        if (getLowestEmptyRow(col) !== -1) {
            availableColumns.push(col);
        }
    }

    if (availableColumns.length > 0) {
        const col = availableColumns[Math.floor(Math.random() * availableColumns.length)];
        const rowToFill = getLowestEmptyRow(col);

        // Make the computer's move
        boardState[rowToFill][col] = 'Y'; // 'Y' for Computer
        board[rowToFill * 7 + col].style.backgroundColor = 'yellow'; // Change color

        if (checkWin(rowToFill, col)) {
            statusElement.textContent = 'Yellow wins!';
            setTimeout(resetBoard, 2000); // Reset after 2 seconds
        } else {
            currentPlayer = 1; // Switch back to Player 1
        }
    }
}

// Add event listener to each cell (box) for computer vs user
board.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (currentPlayer === 1) {
            const col = index % 7; // Calculate the column number
            const rowToFill = getLowestEmptyRow(col); // Find the lowest empty row in the column

            if (rowToFill !== -1) { // If an empty row is found
                boardState[rowToFill][col] = 'R'; // 'R' for Player 1
                board[rowToFill * 7 + col].style.backgroundColor = 'red'; // Change color

                if (checkWin(rowToFill, col)) {
                    statusElement.textContent = 'Red wins!'; // Announce winner
                    setTimeout(resetBoard, 2000); // Reset after 2 seconds
                } else {
                    currentPlayer = 2;
                    setTimeout(computerMove, 500); // Add delay for computer move
                }
            }
        }
    });
});

// Function to reset the game board
function resetBoard() {
    // Clear the board state
    boardState = Array(6).fill(null).map(() => Array(7).fill(''));

    // Reset the UI
    board.forEach(box => {
        box.style.backgroundColor = 'white';
    });

    // Reset the player
    currentPlayer = 1;
    statusElement.textContent = 'Connect 4 Game'; // Reset game status text
}

// Event listener for the reset button
resetButton.addEventListener('click', resetBoard);

// Event listener for button2 to start the game
button2.addEventListener('click', () => {
    // Hide button2 after starting the game
    button2.style.display = 'none';
    resetBoard(); // Initialize the board when game starts
});
