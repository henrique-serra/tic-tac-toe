function Cell() {
    let value = null;

    const getValue = () => value;
    const updateCellValue = (player) => {
        value = player.marker;
    };

    return {
        getValue,
        updateCellValue
    };
}

function Player(name, marker, victories = 0) {
    return {
        name,
        marker,
        victories
    }
}

const gameboard = function() {

    // Set initial board
    const setInitialBoard = (rows = 3, columns = 3) => {
        const board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
        return board;
    }

    const board = setInitialBoard();

    const getBoard = () => board;

    const getBoardWithCellValues = (board) => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        return boardWithCellValues;
    }

    const printBoard = (board) => {
        const boardWithCellValues = getBoardWithCellValues(board);
        console.table(boardWithCellValues);
    }

    const markCell = (player, row, column, board) => {
        const cell = board[row][column];
        cell.updateCellValue(player);
    }

    return {
        setInitialBoard,
        getBoard,
        getBoardWithCellValues,
        printBoard,
        markCell
    }
}();

const gameController = function () {
    let player1 = null;
    let player2 = null;
    let activePlayer = null;
    let playCondition = true;

    const initializePlayers = (p1, p2) => {
        player1 = p1;
        player2 = p2;
        activePlayer = player1;
    };

    const getActivePlayer = () => activePlayer;

    const switchPlayers = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
        return activePlayer;
    };

    const verticalWin = (column, boardVW) => {
        const verticalMarkers = [];
        
        for (row of gameboard.getBoardWithCellValues(boardVW)) {
            verticalMarkers.push(row[column]);
        }
        
        const uniqueMarkers = new Set(verticalMarkers);
       
        return uniqueMarkers.size == 1 && !uniqueMarkers.has(null);
    };

    const horizontalWin = (row, boardHW) => {
        const horizontalMarkers = [];
        for (column of boardHW[row]) {
            horizontalMarkers.push(column.getValue());
        }

        const uniqueMarkers = new Set(horizontalMarkers);

        return uniqueMarkers.size == 1 && !uniqueMarkers.has(null);
    };

    const diagonalWin = (boardDW) => {
        const leftToRightDiagonalMarkers = [];
        const rightToLefttDiagonalMarkers = [];

        let columnForLeftToRight = 0;
        let columnForRightToLeft = boardDW[0].length - 1;
        
        for (row of boardDW) {
            leftToRightDiagonalMarkers.push(row[columnForLeftToRight].getValue());
            rightToLefttDiagonalMarkers.push(row[columnForRightToLeft].getValue());
            columnForLeftToRight++;
            columnForRightToLeft--;
        }

        const uniqueMarkersLefToRight = new Set(leftToRightDiagonalMarkers);
        const uniqueMarkersRightToLeft = new Set(rightToLefttDiagonalMarkers);

        if (uniqueMarkersLefToRight.size == 1 && !uniqueMarkersLefToRight.has(null)) return true;
        if (uniqueMarkersRightToLeft.size == 1 && !uniqueMarkersRightToLeft.has(null)) return true;
        
        return false;
    };

    const win = (row, column, boardW) => {
        if (verticalWin(column, boardW) || horizontalWin(row, boardW) || diagonalWin(boardW)) {
            if (activePlayer === player1) player1.victories++;
            if (activePlayer === player2) player2.victories++;
            return true;
        }

        return false;
    };

    const draw = (row, column, boardD) => {
        let cells = [];

        for (r of boardD) {
            for (c of r) {
                cells.push(c.getValue());
            }
        }

        cells = cells.flat();
        const cellsSet = new Set(cells);

        if (!win(row, column, boardD) && !cellsSet.has(null)) {
            return true;
        }

        return false;
    };

    const getplayCondition = () => playCondition;
    const setPlayCondition = (hasCondition) => playCondition = hasCondition;
    const resetPlayCondition = () => playCondition = true;

    const playRound = (row, column, boardRound) => {
        if (!activePlayer) {
            console.error("Players not initialized! Call initializePlayers first.");
            return;
        }

        gameboard.markCell(activePlayer, row, column, boardRound);
        gameboard.printBoard(boardRound);
        
        if (win(row, column, boardRound)) {
            console.log(`${activePlayer.name} has won!`);
            activePlayer.victories++;
            setPlayCondition(false);
        }

        if (draw(row, column, boardRound)) {
            console.log("It's a draw!");
            setPlayCondition(false);
        }
    };

    return {
        initializePlayers,
        playRound,
        getActivePlayer,
        switchPlayers,
        getplayCondition,
        resetPlayCondition
    };
}();

function playGame(row, column) {
    const board = gameboard.getBoard();
    gameController.playRound(row, column, board);
    gameController.switchPlayers();

}

function ScreenController() {
    const container = document.querySelector("#container");
    const cells = document.querySelectorAll(".cell");
    const playerForm = document.querySelector("#players-input");
    const currentPlayerDisplay = document.querySelector("#current-player");
    const winnerDisplay = document.querySelector("#winner-display");
    const newGameButton = document.querySelector("#new-game");
    
    const showBoardCells = () => {
        const board = gameboard.getBoard();
        const boardWithCellValues = gameboard.getBoardWithCellValues(board);
        cells.forEach(cell => {
            const cellRowIndex = cell.parentNode.dataset.row;
            const cellColumnIndex = cell.dataset.column;
            cell.textContent = boardWithCellValues[cellRowIndex][cellColumnIndex];
        });
    };

    const updateCurrentPlayer = () => {
        const activePlayer = gameController.getActivePlayer();
        currentPlayerDisplay.textContent = `Vez de: ${activePlayer.name} (${activePlayer.marker})`;
    };

    const showWinner = (playerName) => {
        winnerDisplay.textContent = `${playerName} venceu!`;
        newGameButton.classList.remove('hidden');
    };

    const showDraw = () => {
        winnerDisplay.textContent = "Empate!";
        newGameButton.classList.remove('hidden');
    };

    const startGame = (event) => {
        event.preventDefault();
        
        const player1Name = document.querySelector("#player1").value;
        const player2Name = document.querySelector("#player2").value;
        
        // Inicializa os jogadores
        const player1 = Player(player1Name, "O");
        const player2 = Player(player2Name, "X");
        gameController.initializePlayers(player1, player2);
        
        // Esconde o formulário e mostra o tabuleiro
        playerForm.parentElement.classList.add('hidden');
        container.classList.remove('hidden');
        
        // Atualiza o display do jogador atual
        updateCurrentPlayer();
    };

    const resetGame = () => {
        // Reseta o estado interno do tabuleiro
        gameboard.resetBoard();
        
        // Reseta a condição do jogo
        gameController.resetPlayCondition();
        
        // Limpa o tabuleiro visualmente
        cells.forEach(cell => {
            cell.textContent = '';
            cell.disabled = false;
        });
        
        // Reseta os displays
        winnerDisplay.textContent = '';
        currentPlayerDisplay.textContent = '';
        
        // Esconde o botão de novo jogo
        newGameButton.classList.add('hidden');
        
        // Mostra o formulário e esconde o tabuleiro
        playerForm.parentElement.classList.remove('hidden');
        container.classList.add('hidden');
        
        // Limpa o formulário
        playerForm.reset();
    };

    container.addEventListener("click", e => {
        if (!gameController.getplayCondition()) return;
        
        const rowClickedIndex = e.target.parentNode.dataset.row;
        const columnClickedIndex = e.target.dataset.column;
        const cellClicked = e.target;

        if (cellClicked.textContent) {
            alert("Célula ocupada! Escolha outra!");
            return;
        }

        playGame(rowClickedIndex, columnClickedIndex);
        showBoardCells();
        
        if (!gameController.getplayCondition()) {
            const activePlayer = gameController.getActivePlayer();
            if (cellClicked.textContent) {
                showWinner(activePlayer.name);
            } else {
                showDraw();
            }
            cells.forEach(cell => cell.disabled = true);
        } else {
            updateCurrentPlayer();
        }
    });

    playerForm.addEventListener("submit", startGame);
    newGameButton.addEventListener("click", resetGame);
}

ScreenController();