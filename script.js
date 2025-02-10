const gameboard = function() {
    const rows = 3;
    const columns = 3;

    // Set initial board
    const setInitialBoard = () => {
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

    // INVESTIGATE HOW TO ACCESS BOARD FROM setInitialBoard!!!
    const getBoard = () => board;

    const printBoard = (board) => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.table(boardWithCellValues);
        return boardWithCellValues;
    }

    const markCell = (player, row, column, board) => {
        const cell = board[row][column];
        cell.updateCellValue(player);
    }

    return {
        setInitialBoard,
        getBoard,
        printBoard,
        markCell
    }
}();

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

function GameController(
    player1 = Player("Player 1", "O"),
    player2 = Player("Player 2", "X")
) {
    
    let activePlayer = player1;

    const board = gameboard.setInitialBoard();

    const getActivePlayer = () => activePlayer;

    const switchPlayers = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const verticalWin = (column) => {
        
        const verticalMarkers = [];
        for (row of board.getBoard(board)) {
            verticalMarkers.push(row[column].getValue());
        }
        
        const uniqueMarkers = new Set(verticalMarkers);
       
        return uniqueMarkers.size == 1 ? true : false;
    }

    const horizontalWin = (row) => {
        const horizontalMarkers = [];
        for (column of board.getBoard(board)[row]) {
            horizontalMarkers.push(column.getValue());
        }

        const uniqueMarkers = new Set(horizontalMarkers);

        return uniqueMarkers.size == 1 ? true : false;
    }

    const diagonalWin = () => {
        const boardCopy = board.getBoard(board);
        // ADD an array for each diagonal combination. There will be two arrays inside diagonalMarkers array: left-right and right-left
        const leftToRightDiagonalMarkers = [];
        const rightToLefttDiagonalMarkers = [];

        let columnForLeftToRight = 0;
        let columnForRightToLeft = boardCopy[0].length - 1;
        // ADD cell values values to the arrays
        for (row of boardCopy) {
            leftToRightDiagonalMarkers.push(row[columnForLeftToRight].getValue());
            rightToLefttDiagonalMarkers.push(row[columnForRightToLeft].getValue());
            columnForLeftToRight++;
            columnForRightToLeft--;
        }

        // CONVERT to set each array
        const uniqueMarkersLefToRight = new Set(leftToRightDiagonalMarkers);
        const uniqueMarkersRightToLeft = new Set(rightToLefttDiagonalMarkers);

        // IF any of the inner array has only one kind of marker, then win
        if (uniqueMarkersLefToRight.size == 1 && !uniqueMarkersLefToRight.has(null)) return true;
        if (uniqueMarkersRightToLeft.size == 1 && !uniqueMarkersRightToLeft.has(null)) return true;
        
        return false;
    }

    const win = (row, column) => {
        if (verticalWin(column) || horizontalWin(row) || diagonalWin()) {
            if (activePlayer === player1) player1.victories++;
            if (activePlayer === player2) player2.victories++;
            return true;
        }

        return false;
    }

    const draw = (row, column) => {
        const boardCopy = board.getBoard(board);
        let cells = [];

        for (r of boardCopy) {
            for (c of r) {
                cells.push(c.getValue());
            }
        }

        cells = cells.flat();
        const cellsSet = new Set(cells);

        if (!win(row, column) && !cellsSet.has(null)) {
            return true;
        }

        return false;
    }

    let stopGame = false;
    const playRound = (row = prompt("row"), column = prompt("column")) => {

        if (stopGame) return;
        const cell = board.getBoard(board)[row][column];

        board.markCell(activePlayer, row, column, board);
        board.printBoard(board);
        
        if (win(row, column)) {
            console.log(`${activePlayer.name} has won!`);
            switchPlayers();
            stopGame = true;
        }

        if (draw(row, column)) {
            console.log("It's a draw!");
            switchPlayers();
            stopGame = true;
        }

        switchPlayers();

        return stopGame;
    }

    return {
        playRound,
        getActivePlayer
    }
}

function ScreenController() {
    const container = document.querySelector("#container");
    const cells = document.querySelectorAll(".cell");
    const boardCells = gameboard.printBoard();

    const showBoardCells = () => {
        cells.forEach( cell => {
            const cellRowIndex = cell.parentNode.dataset.row;
            const cellColumnIndex = cell.dataset.column;
            cell.textContent = boardCells[cellRowIndex][cellColumnIndex];
        })
    }

    container.addEventListener("click", e => {
        const rowClickedIndex = e.target.parentNode.dataset.row;
        const rowClicked = document.querySelector(`[data-row="${rowClickedIndex}"]`);
        const columnClickedIndex = e.target.dataset.column;
        const cellClicked = rowClicked.querySelector(`[data-column="${columnClickedIndex}"]`);

        if (cellClicked.textContent) {
            alert("Cell taken! Choose another!");
            return;
        }

        game.playRound(rowClickedIndex, columnClickedIndex);
        showBoardCells();
        
    })
}

function game() {

}