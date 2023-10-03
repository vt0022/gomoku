// Apply mode to play with computer
function applyMode() {
    if (LEVEL === "easy") {
        COMPUTER_MAP = COMPUTER_MAP_EASY;
        HUMAN_MAP = HUMAN_MAP_EASY;
    } else if (LEVEL === "medium") {
        COMPUTER_MAP = COMPUTER_MAP_MEDIUM;
        HUMAN_MAP = HUMAN_MAP_MEDIUM;
    } else if (LEVEL === "hard") {
        COMPUTER_MAP = COMPUTER_MAP_HARD;
        HUMAN_MAP = HUMAN_MAP_HARD;
    }
}

function getComputerMove() {
    let maxScore = -Infinity;
    let priorComputerMoves = [];
    let listScorePoint = [];

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (matrixGame[i][j] === 0) {
                let maxHumanChain = Math.max(getHorizontal(i, j, 1), getVertical(i, j, 1), getRightDiagonal(i, j, 1), getLeftDiagonal(i, j, 1));
                let maxBotChain = Math.max(getHorizontal(i, j, 2), getVertical(i, j, 2), getRightDiagonal(i, j, 2), getLeftDiagonal(i, j, 2));

                let score = COMPUTER_MAP.get(maxBotChain) + HUMAN_MAP.get(maxHumanChain); // Computer turn so this is temp
                if (maxScore <= score) {
                    maxScore = score;
                    listScorePoint.push({
                        score: score,
                        point: [i, j],
                    });
                }
            }
        }
    }

    // get list max score with longest chain for bot
    for (const element of listScorePoint) {
        if (element.score === maxScore) {
            priorComputerMoves.push(element.point);
            console.log(element.score);
        }
    }

    console.log(listScorePoint);
    // Random to choose
    return priorComputerMoves[Math.floor(Math.random() * priorComputerMoves.length)];
}
