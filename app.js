// Event handlers
document.querySelector(".start").addEventListener("click", () => {
  GameController.start();
});

document.querySelector(".restart").addEventListener("click", () => {
  GameController.restart();

  GameController.start();
});

document.querySelector(".quit").addEventListener("click", () => {
  GameController.restart();
  gameOver = false;
  GameController.quit();
});

// factory function
const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

// display controller module
const displayController = (() => {
  const messageEl = document.querySelector(".message-box p");
  const renderMessage = (message, messageFlag) => {
    if (messageFlag) {
      messageEl.classList.add("bgColor-green");
    } else {
      messageEl.classList.add("bgColor-red");
    }

    messageEl.textContent = message;
  };

  const removeMessage = () => {
    messageEl.removeAttribute("class");
    messageEl.textContent = "";
  };
  return {
    renderMessage,
    removeMessage,
  };
})();

// Gameboard module
const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  const gridEl = document.querySelector(".grid");

  for (let i = 0; i < rows * columns; i++) {
    board.push("");
  }
  const render = () => {
    let boardHTML = "";
    board.forEach((cell, index) => {
      boardHTML += `<div class="cell" id="cell-${index}">${cell}</div>`;
    });
    gridEl.innerHTML = boardHTML;
    // event listeners on cells
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", GameController.handleClick);
    });
  };

  const update = (index, mark) => {
    board[index] = mark;
    render();
  };

  const getGameboard = () => board;
  const removeGrid = () => {
    gridEl.innerHTML = "";
  };
  return {
    render,
    update,
    getGameboard,
    removeGrid,
  };
})();

//Game controller module
const GameController = (() => {
  let players = [];
  let activePlayer;
  let gameOver;

  const playerOneInputEl = document.querySelector("#playerOne");
  const playerTwoInputEl = document.querySelector("#playerTwo");
  const formInputEl = document.querySelector(".form-input");
  const playersInfoEl = document.querySelector(".playersInfo");
  const btnWrapperEl = document.querySelector(".btn-wrapper");

  const start = () => {
    // check if fields are empty
    if (checkForNull()) {
      displayController.renderMessage("Please fill the details.", false);
      return false;
    } else {
      setGameboardPage();
    }

    players = [
      createPlayer(playerOneInputEl.value, "X"),
      createPlayer(playerTwoInputEl.value, "O"),
    ];
    activePlayer = players[0];
    gameOver = false;

    Gameboard.render();
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    gameOver = false;
    displayController.removeMessage();
  };

  const quit = () => {
    playerOneInputEl.value = "";
    playerTwoInputEl.value = "";
    players = [];
    Gameboard.removeGrid();
    formInputEl.classList.remove("hide");
    playersInfoEl.classList.add("hide");
    btnWrapperEl.firstElementChild.classList.add("hide");
    btnWrapperEl.firstElementChild.nextElementSibling.classList.remove("hide");
    btnWrapperEl.lastElementChild.classList.add("hide");
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
      displayController.renderMessage(`${activePlayer.name} won!`, true);
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage(`It's a tie`, true);
    }

    switchPlayerTurn();
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

  function checkForNull() {
    if (!playerOneInputEl.value || !playerTwoInputEl.value) return true;
  }

  function setGameboardPage() {
    // hide the message element
    displayController.removeMessage();
    // hide the form input element
    formInputEl.classList.add("hide");
    //set the name of players and make it visible
    playersInfoEl.firstElementChild.children[0].textContent = playerOneInputEl.value.toUpperCase();
    playersInfoEl.lastElementChild.children[0].textContent = playerTwoInputEl.value.toUpperCase();
    playersInfoEl.classList.remove("hide");
    //make the other buttons visible
    btnWrapperEl.firstElementChild.classList.remove("hide");
    btnWrapperEl.firstElementChild.nextElementSibling.classList.add("hide");
    btnWrapperEl.lastElementChild.classList.remove("hide");
  }

  return {
    start,
    handleClick,
    restart,
    quit,
  };
})();
