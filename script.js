function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Set initial board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.table(boardWithCellValues);
    }

    const markCell = (player, row, column) => {
        const cell = board[row][column];
        cell.updateCellValue(player);
    }

    return {
        getBoard,
        printBoard,
        markCell
    }
}

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

function Player(name, marker) {
    return {
        name,
        marker
    }
}

const game = function GameController(
    player1 = Player("Player 1", "O"),
    player2 = Player("Player 2", "X")
) {
    
    let activePlayer = player1;

    const board = Gameboard();

    const getActivePlayer = () => activePlayer;

    const switchPlayers = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const verticalWin = (column) => {
        
        const verticalMarkers = [];
        for (row of board.getBoard()) {
            verticalMarkers.push(row[column].getValue());
        }
        
        const uniqueMarkers = new Set(verticalMarkers);
       
        return uniqueMarkers.size == 1 ? true : false;
    }

    const horizontalWin = (row) => {
        const horizontalMarkers = [];
        for (column of board.getBoard()[row]) {
            horizontalMarkers.push(column.getValue());
        }

        const uniqueMarkers = new Set(horizontalMarkers);

        return uniqueMarkers.size == 1 ? true : false;
    }

    const diagonalWin = () => {
        const boardCopy = board.getBoard();
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
        if (verticalWin(column)) return true;
        if (horizontalWin(row)) return true;
        if (diagonalWin()) return true;
        return false;
    }

    const draw = (row, column) => {
        const boardCopy = board.getBoard();
        let cells = [];

        for (r of boardCopy) {
            for (c of r) {
                cells.push(c.getValue());
            }
        }

        cells = cells.flat();
        const cellsSet = new Set(cells);

        if (!win(row, column) && !cellsSet.has(null)) return true;

        return false;
    }

    const playRound = () => {
        let [row, column] = prompt("row, column").split(",");
        
        if (row > 2 || column > 2) {
            alert("Off the limits!");
            return;
        }

        const cell = board.getBoard()[row][column];
        
        if (cell.getValue()) {
            alert("Cell taken! Choose another");
            return;
        }


        board.markCell(activePlayer, row, column);
        board.printBoard();
        
        if (win(row, column)) {
            console.log(`${activePlayer.name} has won!`);
        }

        if (draw(row, column)) {
            console.log("It's a draw!");
        }

        switchPlayers();
    }

    return {
        playRound,
        getActivePlayer,
        diagonalWin,
        draw,
        win
    }
}();