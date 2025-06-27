document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameActive = true;
    let scoreX = 0, scoreO = 0, scoreDraw = 0;
    const strikeLine = document.getElementById('strike-line');

    // Move winPatterns here
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    function updateScoreboard() {
        document.getElementById('score-x').textContent = scoreX;
        document.getElementById('score-o').textContent = scoreO;
        document.getElementById('score-draw').textContent = scoreDraw;
    }

    function showStrike(patternIndex) {
        // Remove any previous strike
        strikeLine.innerHTML = '';
        if (patternIndex === null) return;
        let type, idx;
        if (patternIndex < 3) { type = 'horizontal'; idx = patternIndex; }
        else if (patternIndex < 6) { type = 'vertical'; idx = patternIndex - 3; }
        else if (patternIndex === 6) { type = 'diagonal'; idx = 0; }
        else if (patternIndex === 7) { type = 'diagonal'; idx = 1; }
        else return;
        const div = document.createElement('div');
        div.className = `strike ${type}-${idx}`;
        setTimeout(() => div.classList.add('show'), 10); // animate in
        strikeLine.appendChild(div);
    }

    // Example: highlight winning cells
    function highlightWin(pattern) {
        pattern.forEach(i => {
            cells[i].classList.add('win');
        });
    }

    function checkWinner(bd) {
        for (let i = 0; i < winPatterns.length; i++) {
            const [a,b,c] = winPatterns[i];
            if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return [bd[a], i];
        }
        if (bd.every(cell => cell)) return ['Draw', null];
        return [null, null];
    }

    function handleClick(e) {
        const idx = +e.target.dataset.index;
        if (!gameActive || board[idx]) return;
        board[idx] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.classList.add(currentPlayer === 'X' ? 'taken-x' : 'taken-o');
        let [result, patternIdx] = checkWinner(board);
        if (result) {
            gameActive = false;
            // Remove or comment out showStrike(patternIdx); since you don't want strike animation
            // showStrike(patternIdx);
            if (patternIdx !== null) {
                highlightWin(winPatterns[patternIdx]); // Pass the winning pattern array
            }
            if (result === 'X') scoreX++;
            else if (result === 'O') scoreO++;
            else scoreDraw++;
            updateScoreboard();
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function resetBoard() {
        board = Array(9).fill('');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('taken-x', 'taken-o', 'win'); // Remove win class on reset
        });
        gameActive = true;
        currentPlayer = 'X';
        showStrike(null);
    }

    // Only reset the board on reset button click
    document.getElementById('reset')?.addEventListener('click', () => {
        resetBoard();
    });

    // Add this to ensure event listeners are attached
    cells.forEach(cell => cell.addEventListener('click', handleClick));

    updateScoreboard();
    resetBoard();
});