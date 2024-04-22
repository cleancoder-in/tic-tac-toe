const displayController = (() => {
  const renderMessage = (message) => {
    const messageEl = document.querySelector(".message");
    messageEl.classList.add("bgColor-green");
    messageEl.textContent = message;
  };
  return {
    renderMessage,
  };
})();

const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows * columns; i++) {
    board.push("");
  }
  const render = () => {
    console.log(board);
    let boardHTML = "";
    board.forEach((cell, index) => {
      boardHTML += `<div class="cell" id="cell-${index}">${cell}</div>`;
    });
    document.querySelector(".grid").innerHTML = boardHTML;
    // event listeners on cells
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", Game.handleClick);
    });
  };

  const update = (index, mark) => {
    getGameboard()[index] = mark;
    render();
  };

  const getGameboard = () => board;

  return {
    render,
    update,
    getGameboard,
  };
})();

// factory function
const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

const checkForWin = (board) => {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  for (let i = 0; i < winCombos.length; i++) {
    let [a, b, c] = winCombos[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
};

const checkForTie = (board) => {
  return board.every((cell) => cell !== "");
};

const Game = (() => {
  let players = [];
  let activePlayer;
  let gameOver;

  const start = () => {
    players = [
      createPlayer(
        document.getElementById("playerOne").value || "Player-One",
        "X"
      ),
      createPlayer(
        document.getElementById("playerTwo").value || "Player-Two",
        "O"
      ),
    ];
    activePlayer = players[0];
    gameOver = false;
    Gameboard.render();
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const handleClick = (e) => {
    if (gameOver) return;
    const index = parseInt(e.target.id.split("-")[1]);
    if (Gameboard.getGameboard()[index] !== "") return;
    Gameboard.update(index, activePlayer.mark);
    if (checkForWin(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage(`${activePlayer.name} won!`);
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage(`It's a tie`);
    }

    switchPlayerTurn();
  };

  return {
    start,
    handleClick,
    restart,
  };
})();

// document.addEventListener("DOMContentLoaded", () => {
//   Gameboard.render();
// });

document.querySelector(".start").addEventListener("click", () => {
  Game.start();
});

document.querySelector(".restart").addEventListener("click", () => {
  Game.restart();
  gameOver = false;
  const messageEl = document.querySelector(".message");
  messageEl.classList.remove("bgColor-green");
  messageEl.textContent = "";
  Game.start();
});
