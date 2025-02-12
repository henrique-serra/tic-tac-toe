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
    const board = [];

    // Set initial board
    const setInitialBoard = (rows = 3, columns = 3) => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
        return board;
    }

    const getBoard = () => board;

    const getBoardWithCellValues = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        return boardWithCellValues;
    }

    const printBoard = () => {
        const boardWithCellValues = getBoardWithCellValues();
        console.table(boardWithCellValues);
    }

    const markCell = (player, row, column) => {
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
    let player1;
    let player2;;
    let activePlayer;

    const initializePlayers = (p1Name, p1Marker, p2Name, p2Marker) => {
        player1 = Player(p1Name, p1Marker);
        player2 = Player(p2Name, p2Marker);
        activePlayer = player1;
    }

    const getActivePlayer = () => activePlayer;

    const switchPlayers = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
        return activePlayer;
    }

    const addVictoryToActivePlayer = () => {
        if (activePlayer === player1) player1.victories++;
        if (activePlayer === player2) player2.victories++;
    }

    const verticalWin = (column, boardVW) => {
        const verticalMarkers = [];
        
        for (row of boardVW) {
            verticalMarkers.push(row[column].getValue());
        }
        
        const uniqueMarkers = new Set(verticalMarkers);
       
        return uniqueMarkers.size == 1 ? true : false;
    }

    const horizontalWin = (row, boardHW) => {
        const horizontalMarkers = [];
        for (column of boardHW[row]) {
            horizontalMarkers.push(column.getValue());
        }

        const uniqueMarkers = new Set(horizontalMarkers);

        return uniqueMarkers.size == 1 ? true : false;
    }

    const diagonalWin = (boardDW) => {
        // ADD an array for each diagonal combination. There will be two arrays inside diagonalMarkers array: left-right and right-left
        const leftToRightDiagonalMarkers = [];
        const rightToLefttDiagonalMarkers = [];

        let columnForLeftToRight = 0;
        let columnForRightToLeft = boardDW[0].length - 1;
        // ADD cell values values to the arrays
        for (row of boardDW) {
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

    const win = (row, column, boardW = gameboard.getBoard()) => {
        if (verticalWin(column, boardW) || horizontalWin(row, boardW) || diagonalWin(boardW)) {
            if (activePlayer === player1) player1.victories++;
            if (activePlayer === player2) player2.victories++;
            return true;
        }

        return false;
    }

    const draw = (row, column, boardD = gameboard.getBoard()) => {
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
    }

    let playCondition = true;

    const getplayCondition = () => playCondition;
    const setPlayCondition = (hasCondition) => playCondition = hasCondition;

    const playRound = (
        row = prompt("row"), 
        column = prompt("column")
    ) => {

        gameboard.markCell(activePlayer, row, column);
        gameboard.printBoard();
        
        if (win(row, column)) {
            console.log(`${activePlayer.name} has won!`);
            activePlayer.victories++;
            setPlayCondition(false);
        }

        if (draw(row, column)) {
            console.log("It's a draw!");
            setPlayCondition(false);
        }

        return;
    }

    return {
        playRound,
        initializePlayers,
        getActivePlayer,
        switchPlayers,
        addVictoryToActivePlayer,
        getplayCondition
    }
}();

// Set these to a button
// function initializeGame() {
//     gameboard.setInitialBoard();
//     gameController.initializePlayers("Player 1", "0", "Player 2", "X");
// }


function ScreenController() {
    const container = document.querySelector("#container");
    const cells = document.querySelectorAll(".cell");
    
    const showBoardCells = () => {
        const board = gameboard.getBoard();
        const boardWithCellValues = gameboard.getBoardWithCellValues(board);
        cells.forEach( cell => {
            const cellRowIndex = cell.parentNode.dataset.row;
            const cellColumnIndex = cell.dataset.column;
            cell.textContent = boardWithCellValues[cellRowIndex][cellColumnIndex];
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

        if (!gameController.getplayCondition()) return;
        playGame(rowClickedIndex, columnClickedIndex);
        showBoardCells();
        
    })
}

ScreenController();