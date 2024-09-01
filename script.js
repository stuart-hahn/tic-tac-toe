// Gameboard Module: Manages the state of the game board
const Gameboard = (function () {
  // Private board array representing the 3x3 game board
  let board = new Array(9).fill("");

  // Method to retrieve the current state of the board
  const getBoard = () => board;

  // Method to update the board at a specific index with the player's marker
  const updateBoard = (index, marker) => {
    // Ensure the index is within bounds and the cell is empty
    if (index >= 0 && index < board.length && board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  // Method to reset the board to its initial empty state
  const resetBoard = () => {
    board = new Array(9).fill("");
  };

  // Expose public methods
  return { getBoard, updateBoard, resetBoard };
})();

// Player Factory: Creates player objects with a name and marker
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;

  // Expose public methods
  return { getName, getMarker };
};

// GameController Module: Manages the game logic and player interactions
const GameController = (function () {
  let currentPlayer; // Tracks the current player
  let players = []; // Array to hold player objects
  let gameOver = false; // Flag to track if the game has ended

  // Initialize the game with two players
  const init = (player1Name, player2Name) => {
    players = [Player(player1Name, "X"), Player(player2Name, "O")];
    currentPlayer = players[0]; // Set the first player as the current player
    gameOver = false; // Reset the game over flag
  };

  // Method to get the current player
  const getCurrentPlayer = () => currentPlayer;

  // Method to check if the game is over
  const isGameOver = () => gameOver;

  // Method to switch to the next player's turn
  const switchTurn = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  // Method to check if there is a winner or the game is tied
  const checkGameOver = () => {
    const board = Gameboard.getBoard();
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Vertical
      [0, 4, 8],
      [2, 4, 6], // Diagonal
    ];

    // Check each win condition
    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        gameOver = true; // Set the flag when the game is over
        return `${currentPlayer.getName()} wins!`;
      }
    }

    // Check for a tie
    if (board.every((cell) => cell !== "")) {
      gameOver = true; // Set the flag when the game is over
      return "It's a tie!";
    }

    return null; // Game is not over yet
  };

  // Method to handle a player's move
  const playRound = (index) => {
    if (gameOver) {
      return "Game is over! Please restart to play again."; // Prevent further moves after game over
    }

    if (Gameboard.updateBoard(index, currentPlayer.getMarker())) {
      const result = checkGameOver();
      if (result) {
        return result; // Return the result if the game is over
      } else {
        switchTurn(); // Switch to the next player if the game continues
      }
    }
    return null; // Move was invalid or game continues
  };

  // Expose public methods
  return { init, getCurrentPlayer, playRound, isGameOver };
})();

// DisplayController Module: Handles all DOM interactions and rendering
const DisplayController = (function () {
  // Cache DOM elements
  const gameboardElement = document.getElementById("gameboard");
  const messageElement = document.createElement("div");
  const restartButton = document.createElement("button");

  // Setup restart button
  restartButton.textContent = "Restart Game";
  messageElement.classList.add("message");
  document.body.appendChild(messageElement);
  document.body.appendChild(restartButton);

  // Function to render the game board in the DOM
  const renderBoard = () => {
    gameboardElement.innerHTML = ""; // Clear the board before re-rendering

    Gameboard.getBoard().forEach((marker, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = marker;

      // Add event listener if the game is still active and the cell is empty
      if (!GameController.isGameOver() && marker === "") {
        cell.addEventListener("click", () => handleClick(index));
      }

      gameboardElement.appendChild(cell);
    });
  };

  // Function to handle clicks on the game board
  const handleClick = (index) => {
    const result = GameController.playRound(index);
    renderBoard(); // Re-render the board after each move

    if (result) {
      messageElement.textContent = result; // Display win/tie message if the game is over
    } else {
      messageElement.textContent = `${GameController.getCurrentPlayer().getName()}'s turn`;
    }
  };

  // Function to reset the game
  const resetGame = () => {
    Gameboard.resetBoard(); // Reset the game board
    GameController.init("X", "O"); // Initialize the game with default player names (modify as needed)
    renderBoard(); // Render the new game board
    messageElement.textContent = `${GameController.getCurrentPlayer().getName()}'s turn`;
  };

  // Setup initial game state and event listeners
  restartButton.addEventListener("click", resetGame);
  resetGame(); // Start a new game on page load

  // Expose renderBoard if needed for external access
  return { renderBoard };
})();
