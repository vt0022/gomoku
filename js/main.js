let currentPlayer = 1; // first player
let turn = 1;

let ROWS = 0;
let COLS = 0;

let MODE = "";
let LEVEL = "";

let matrixGame = [];

let COMPUTER_MAP = new Map([]);
let HUMAN_MAP = new Map([]);

// Start the game
document.addEventListener("DOMContentLoaded", function () {
    configGame();

    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", function (event) {
        // Get references to the input fields
        const columnSizeInput = document.getElementById("column-size");
        const rowSizeInput = document.getElementById("row-size");

        // Get the values of the input fields
        const columnSizeValue = columnSizeInput.value.trim();
        const rowSizeValue = rowSizeInput.value.trim();

        // Check if the input values are empty or invalid
        if (columnSizeValue === '' || rowSizeValue === '') {
            // Prevent the form from submitting
            event.preventDefault();

            // Show an error message (you can customize this part)
            alert('Vui lòng điền đầy đủ thông tin.');

            // Optionally, you can focus on the first empty input field
            if (columnSizeValue === '') {
                columnSizeInput.focus();
            } else {
                rowSizeInput.focus();
            }
        } else {
            // Proceed with initializing the game
            initializeBoard();
        }
    });
});


// Selection
function configGame() {
    // Get mode and level
    const modeOption = document.getElementById("mode");
    const levelOption = document.getElementById("level");
    MODE = modeOption.value;
    LEVEL = levelOption.value;

    // Add an event listener to the "mode" select element
    modeOption.addEventListener("change", function () {
        // Check if the selected option is "bot"
        if (modeOption.value === "computer") {
            // If "bot" is selected, show the "game-mode" div
            levelOption.style.display = "block";
            levelOption.style.margin = "0 auto";
        } else {
            // If any other option is selected, hide the "game-mode" div
            levelOption.style.display = "none";
        }
        MODE = modeOption.value;
    });

    // Add an event listener to the "level" select element
    levelOption.addEventListener("change", function () {
        LEVEL = levelOption.value;
    });
}

// Create main board
function initializeBoard() {
    // Apply map with mode
    applyMode();

    const board = document.getElementById("board");
    board.innerHTML = "";

    // Get size and display
    COLS = document.getElementById("column-size").value;
    ROWS = document.getElementById("row-size").value;

    document.documentElement.style.setProperty("--column-size", COLS);
    document.documentElement.style.setProperty("--row-size", ROWS);

    // Hide the input element
    document.getElementById("board-input").style.display = "none";

    //Display sidebar
    document.querySelector(".game-sidebar").style.display = "block";

    // Display button new game
    var newGameButton = document.querySelector(".new-game");
    newGameButton.style.display = "inline-block";
    newGameButton.style.margin;
    newGameButton.addEventListener("click", () => location.reload());

    // Display button reset game
    var resetGameButton = document.querySelector(".reset-game");
    resetGameButton.style.display = "inline-block";
    resetGameButton.style.margin;
    resetGameButton.addEventListener("click", () => refreshGame());

    // Create matrix to store
    for (let i = 0; i < ROWS; i++) {
        matrixGame[i] = [];
        for (let j = 0; j < COLS; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = i;
            cell.dataset.column = j;
            cell.style.borderRadius = "10px";
            cell.style.fontSize = "xx-large";
            cell.addEventListener("click", () => humanMove(cell));
            board.appendChild(cell);
            matrixGame[i][j] = 0;
        }
    }
}

function refreshGame() {
    // Reset player and turn
    currentPlayer = 1; // first player
    turn = 1;
    // Reset board
    initializeBoard();
    // Reset sidebar
    var gameSidebar = document.querySelector(".game-sidebar");
    gameSidebar.innerHTML = `
    <!-- Sidebar Content -->
    <div class="sidebar-row">
        <h1>Tiến độ</h1>
    </div>
    `;
}

function humanMove(cell) {
    if (!cell.textContent) {
        // Display progress
        if (currentPlayer === 1) {
            displayXProgress(turn, cell.dataset.row, cell.dataset.column);
        } else {
            displayOProgress(cell.dataset.row, cell.dataset.column);
            turn++;
        }

        // Display move
        cell.textContent = currentPlayer === 1 ? "X" : "O";
        cell.style.color = currentPlayer === 1 ? "green" : "red";
        // Update game matrix
        matrixGame[cell.dataset.row][cell.dataset.column] = currentPlayer;

        // Check if winning
        if (checkWin([cell.dataset.row, cell.dataset.column], currentPlayer)) {
            alert("Người chơi " + cell.textContent + " thắng!");
            refreshGame();
        }
        // Check if tie
        else if (checkTie()) {
            alert("Hoà rồi!!!");
            refreshGame();
        } else {
            // Change player
            currentPlayer = currentPlayer === 1 ? 2 : 1;

            // If player choose to duo with bot
            if (MODE === "computer") {
                computerMove();
            }
        }
    }
}

function computerMove() {
    // Function to get move
    let move = getComputerMove();
    // Display progress
    if (currentPlayer === 1) {
        displayXProgress(turn, move[0], move[1]);
    } else {
        displayOProgress(move[0], move[1]);
        turn++;
    }

    const cell = document.querySelector(`[data-row="${move[0]}"][data-column="${move[1]}"]`);

    // Display move
    cell.textContent = currentPlayer === 1 ? "X" : "O";
    cell.style.color = currentPlayer === 1 ? "green" : "red";
    // Update game matrix
    matrixGame[cell.dataset.row][cell.dataset.column] = currentPlayer;

    // Check if winning
    if (checkWin([cell.dataset.row, cell.dataset.column], currentPlayer)) {
        alert("Bạn thua rồi!!!");
        refreshGame();
    }
    // Check if tie
    else if (checkTie()) {
        alert("Hoà rồi!!!");
        refreshGame();
    } else {
        // Đổi người
        currentPlayer = currentPlayer === 1 ? 2 : 1; // X là người - 1, O là máy - 2
    }
}

// Hiển thị tiến độ của X
function displayXProgress(turn, xRow, xColumn) {
    // Create new elements
    var newH2 = document.createElement("h2");
    newH2.textContent = `Lượt ${turn}`;

    var newXPlayer = document.createElement("p");
    newXPlayer.textContent = "Người chơi X: ";
    var newXSpan = document.createElement("span");
    newXSpan.textContent = `Cột = ${xColumn}; Hàng = ${xRow}`;
    newXPlayer.appendChild(newXSpan);

    // Get the game-sidebar div
    var gameSidebar = document.querySelector(".game-sidebar");

    // Append the new elements to the game-sidebar
    gameSidebar.appendChild(newH2);
    gameSidebar.appendChild(newXPlayer);
}

// Hiển thị tiến độ của O
function displayOProgress(oRow, oColumn) {
    // Create new elements
    var newOPlayer = document.createElement("p");
    if (MODE === "computer") {
        newOPlayer.textContent = "Máy (O): ";
    } else {
        newOPlayer.textContent = "Người chơi O: ";
    }

    var newOSpan = document.createElement("span");
    newOSpan.textContent = `Cột = ${oColumn}; Hàng = ${oRow}`;
    newOPlayer.appendChild(newOSpan);
    var breakLine = document.createElement("hr");

    // Get the game-sidebar div
    var gameSidebar = document.querySelector(".game-sidebar");

    // Append the new elements to the game-sidebar
    gameSidebar.appendChild(newOPlayer);
    gameSidebar.appendChild(breakLine);
}

function getHorizontal(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
        if (y + i < matrixGame[0].length && matrixGame[x][y + i] === player) {
            count++;
        } else {
            break;
        }
    }

    for (let i = 1; i < 5; i++) {
        if (y - i >= 0 && y - i < matrixGame[0].length && matrixGame[x][y - i] === player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

function getVertical(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
        if (x + i < matrixGame.length && matrixGame[x + i][y] === player) {
            count++;
        } else {
            break;
        }
    }

    for (let i = 1; i < 5; i++) {
        if (x - i >= 0 && x - i < matrixGame.length && matrixGame[x - i][y] === player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

function getRightDiagonal(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
        if (x - i >= 0 && x - i < matrixGame.length && y + i < matrixGame[0].length && matrixGame[x - i][y + i] === player) {
            count++;
        } else {
            break;
        }
    }

    for (let i = 1; i < 5; i++) {
        if (x + i < matrixGame.length && y - i >= 0 && y - i < matrixGame[0].length && matrixGame[x + i][y - i] === player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

function getLeftDiagonal(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
        if (x - i >= 0 && x - i < matrixGame.length && y - i >= 0 && y - i < matrixGame[0].length && matrixGame[x - i][y - i] === player) {
            count++;
        } else {
            break;
        }
    }

    for (let i = 1; i < 5; i++) {
        if (x + i < matrixGame.length && y + i < matrixGame[0].length && matrixGame[x + i][y + i] === player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

function checkWin(points, player) {
    return getHorizontal(Number(points[0]), Number(points[1]), player) >= 5 || getVertical(Number(points[0]), Number(points[1]), player) >= 5 || getRightDiagonal(Number(points[0]), Number(points[1]), player) >= 5 || getLeftDiagonal(Number(points[0]), Number(points[1]), player) >= 5;
}

function checkTie() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (matrixGame[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}
