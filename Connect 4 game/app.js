// Grab references to the DOM elements
const button1 = document.getElementById('button1'); // Not used in the current code
const button2 = document.getElementById('button2');
const statusElement = document.querySelector('h1'); // For displaying winner
let currentPlayer = 1; // Start with Player 1 (Red)
let board = Array.from(document.getElementsByClassName('box')); // Get all cells (boxes)

// Initialize the game board as a 6x7 grid
let boardState = Array(6).fill(null).map(() => Array(7).fill(''));

// Add event listeners to each cell (box) for user vs user
board.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (currentPlayer === 1 || currentPlayer === 2) {
            const col = index % 7; // Calculate the column number
            const rowToFill = getLowestEmptyRow(col); // Find the lowest empty row in the column

            if (rowToFill !== -1) { // If an empty row is found
                boardState[rowToFill][col] = currentPlayer === 1 ? 'R' : 'Y'; // 'R' for Player 1, 'Y' for Player 2
                board[rowToFill * 7 + col].style.backgroundColor = currentPlayer === 1 ? 'red' : 'yellow'; // Change color

                if (checkWin(rowToFill, col)) {
                    const winner = currentPlayer === 1 ? 'Red' : 'Yellow';
                    statusElement.textContent = `${winner} wins!`; // Announce winner
                    setTimeout(resetBoard, 2000); // Reset after 2 seconds
                } else {
                    // Switch player
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                }
            }
        }
    });
});

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

// Commented out the computer-related code
/*
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
*/

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
document.getElementById('click').addEventListener('click', resetBoard);
