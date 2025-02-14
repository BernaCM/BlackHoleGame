// Configuração inicial do jogo
let currentPosition = 1;
let moves = 0;
let gameHistory = [];
let gameNumber = 1;
let gameActive = true;
let pits = [];

// Configuração do tabuleiro
const boardSize = 40;
const numberOfPits = Math.floor(boardSize * 0.2); // 20% do tabuleiro serão buracos

// Função para gerar buracos aleatórios
function generateRandomPits() {
    pits = [];
    while (pits.length < numberOfPits) {
        // Gera um número entre 2 e boardSize-1 (evita a posição inicial e final)
        const pit = Math.floor(Math.random() * (boardSize - 2)) + 2;
        if (!pits.includes(pit)) {
            pits.push(pit);
        }
    }
    // Ordena os buracos para facilitar a visualização
    pits.sort((a, b) => a - b);
}

// Inicializar o tabuleiro
function initializeBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    for (let i = boardSize; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = i;
        
        if (pits.includes(i)) {
            cell.classList.add('pit');
        }
        if (i === currentPosition) {
            cell.classList.add('current');
        }
        
        board.appendChild(cell);
    }
}

// Função para rolar o dado
function rollDice() {
    if (!gameActive) return;
    
    const dice = Math.floor(Math.random() * 6) + 1;
    document.getElementById('lastRoll').textContent = dice;
    moves++;
    document.getElementById('moves').textContent = moves;
    
    movePlayer(dice);
}

// Função para mover o jogador
function movePlayer(spaces) {
    const previousPosition = currentPosition;
    currentPosition += spaces;
    
    // Verificar se ultrapassou o tabuleiro
    if (currentPosition > boardSize) {
        const overflow = currentPosition - boardSize;
        currentPosition = boardSize - overflow;
    }
    
    // Verificar se caiu em um buraco
    if (pits.includes(currentPosition)) {
        gameOver('lose', `Você caiu em um buraco na posição ${currentPosition}!`);
    }
    
    // Verificar se chegou ao final
    if (currentPosition === boardSize) {
        gameOver('win', 'Parabéns! Você chegou ao final!');
    }
    
    document.getElementById('position').textContent = currentPosition;
    updateBoard(previousPosition);
}

// Atualizar o tabuleiro visualmente
function updateBoard(previousPosition) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (parseInt(cell.textContent) === previousPosition) {
            cell.classList.remove('current');
        }
        if (parseInt(cell.textContent) === currentPosition) {
            cell.classList.add('current');
        }
    });
}

// Função de fim de jogo
function gameOver(result, message) {
    gameActive = false;
    const gameOverDiv = document.getElementById('gameOver');
    gameOverDiv.textContent = message;
    gameOverDiv.style.display = 'block';
    gameOverDiv.className = `game-over ${result}`;
    
    // Adicionar ao histórico
    gameHistory.push({
        game: gameNumber,
        result: result === 'win' ? 'Vitória' : 'Derrota',
        moves: moves,
        finalPosition: currentPosition
    });
    
    updateHistory();
}

// Atualizar tabela de histórico
function updateHistory() {
    const tbody = document.getElementById('historyTableBody');
    const row = document.createElement('tr');
    const lastGame = gameHistory[gameHistory.length - 1];
    
    row.innerHTML = `
        <td>${lastGame.game}</td>
        <td>${lastGame.result}</td>
        <td>${lastGame.moves}</td>
        <td>${lastGame.finalPosition}</td>
    `;
    
    tbody.appendChild(row);
}

// Reiniciar o jogo
function resetGame() {
    currentPosition = 1;
    moves = 0;
    gameActive = true;
    gameNumber++;
    
    // Gerar novos buracos aleatórios
    generateRandomPits();
    
    document.getElementById('position').textContent = currentPosition;
    document.getElementById('lastRoll').textContent = '-';
    document.getElementById('moves').textContent = moves;
    document.getElementById('gameOver').style.display = 'none';
    
    initializeBoard();
}

// Inicializar o jogo quando a página carregar
window.onload = function() {
    generateRandomPits(); // Gerar buracos iniciais
    initializeBoard();
};