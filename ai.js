const cells = document.querySelectorAll('.cell');
let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
let scoreX = 0, scoreO = 0, scoreDraw = 0;

function updateScoreboard() {
    document.getElementById('score-x').textContent = scoreX;
    document.getElementById('score-o').textContent = scoreO;
    document.getElementById('score-draw').textContent = scoreDraw;
}

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function highlightWin(pattern) {
    pattern.forEach(i => {
        cells[i].classList.add('win');
    });
}

function checkWinner(bd) {
    for (let i = 0; i < winPatterns.length; i++) {
        const [a, b, c] = winPatterns[i];
        if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) {
            return [bd[a], i];
        }
    }
    if (bd.every(cell => cell)) return ['Draw', null];
    return [null, null];
}

// Minimax algorithm for unbeatable AI
function minimax(bd, depth, isMaximizing) {
    const [winner] = checkWinner(bd); // Only use the winner
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'Draw') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (bd[i] === '') {
                bd[i] = 'O';
                let score = minimax(bd, depth + 1, false);
                bd[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (bd[i] === '') {
                bd[i] = 'X';
                let score = minimax(bd, depth + 1, true);
                bd[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let move = -1;
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
    if (move !== -1) {
        board[move] = 'O';
        cells[move].textContent = 'O';
        cells[move].classList.add('taken-o');
    }
}

function handleClick(e) {
    const idx = +e.target.dataset.index;
    if (!gameActive || board[idx]) return;
    board[idx] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken-x');
    let [result, patternIdx] = checkWinner(board);
    if (result) {
        gameActive = false;
        if (patternIdx !== null) highlightWin(winPatterns[patternIdx]);
        if (result === 'X') scoreX++;
        else if (result === 'O') scoreO++;
        else scoreDraw++;
        updateScoreboard();
        return;
    }
    // AI turn with delay
    gameActive = false;
    currentPlayer = 'O';
    setTimeout(() => {
        aiMove();
        let [aiResult, aiPatternIdx] = checkWinner(board);
        if (aiResult) {
            gameActive = false;
            if (aiPatternIdx !== null) highlightWin(winPatterns[aiPatternIdx]);
            if (aiResult === 'X') scoreX++;
            else if (aiResult === 'O') scoreO++;
            else scoreDraw++;
            updateScoreboard();
            return;
        }
        currentPlayer = 'X';
        gameActive = true;
    }, 600); // 600ms delay for AI move
}

function resetBoard() {
    board = Array(9).fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken-x', 'taken-o', 'win');
    });
    gameActive = true;
    currentPlayer = 'X';
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
document.getElementById('reset')?.addEventListener('click', () => {
    resetBoard(); // Only reset the board and cells, not the scores
});
updateScoreboard();
resetBoard();