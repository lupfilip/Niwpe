var gameboard = [];
var X = [];
var Y = [];
var selected;
var moves = [];
var onTurn;
var game = [];

function fillBoard() {
    let size = Math.sqrt(gameboard.length) / 2;

    gameboard[0] = 1;
    gameboard[gameboard.length - 1] = 3;
    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            if(i === 0 && j === 0) continue;
            else {
                gameboard[j + i * Math.sqrt(gameboard.length)] = 2;
                gameboard[gameboard.length - 1 - j - i * Math.sqrt(gameboard.length)] = 4;
            }
        }
    }
}

function createBoard(field) {
    field.innerHTML = "";
    let board = document.createElement("div");
    board.id = "board";

    let size = parseInt(document.getElementById("size").value);
    size = 2 * size + 2;
    document.getElementById("boardSize").innerHTML = "Board size: " + size + 'x' + size;
    gameboard = new Array(size * size);

    size = (size <= 8 ? size : 8);
    board.style.gridTemplateColumns = "1fr repeat("+size+", 3fr) 1fr";
    board.style.gridTemplateRows = "1fr repeat("+size+", 3fr) 1fr";

    let item;
    for(let i = 0; i < size + 2; i++) {
        for(let j = 0; j < size + 2; j++) {
            if(i % (size+1) === 0 && j % (size+1) === 0) {
                item = document.createElement("div");
            }
            else if(i % (size+1) === 0) {
                item = document.createElement("p");
                item.innerHTML = j;
            }
            else if(j % (size+1) === 0) {
                item = document.createElement("p");
                item.innerHTML = i;
            }
            else {
                item = document.createElement("div");
                item.setAttribute("square-id", (j-1 + (size * (i-1))));
                item.addEventListener("click", selectPiece);

                if((i + j) % 2 === 0) {
                    item.classList.add("dark");
                }
                else {
                    item.classList.add("light");
                }
            }

            board.appendChild(item);
        }
    }

    X = [0, size];
    Y = [0, size];

    field.appendChild(board);
}

function newGame() {
    createBoard(document.getElementById("field"));
    fillBoard();
    selected = undefined;
    onTurn = 0;
    generateMoves();
    game = [];
    displayGame();

    let board = document.getElementById("board");
    X = [Math.sqrt(gameboard.length) / 2 - Math.sqrt(board.children.length) / 2, 
        Math.sqrt(gameboard.length) / 2 + Math.sqrt(board.children.length) / 2];
    Y = [Math.sqrt(gameboard.length) / 2 - Math.sqrt(board.children.length) / 2, 
        Math.sqrt(gameboard.length) / 2 + Math.sqrt(board.children.length) / 2];
    displayGrid();
}

function sizeFix(item) {
    if(item.target.value === "") item.target.value = 1;
    else if(parseInt(item.target.value) < 1 || parseInt(item.value) === NaN) item.target.value = 1;
}

function displayGrid() {
    let board = document.getElementById("board");
    board.innerHTML = "";

    let item;
    for(let i = Y[0]; i < Y[1]; i++) {
        for(let j = X[0]; j < X[1]; j++) {
            if((i-Y[0]) % (Y[1]-Y[0]-1) === 0 && (j-X[0]) % (X[1]-X[0]-1) === 0) {
                item = document.createElement("div");
            }
            else if((i-Y[0]) % (Y[1]-Y[0]-1) === 0) {
                item = document.createElement("p");
                item.innerHTML = j+1;
            }
            else if((j-X[0]) % (X[1]-X[0]-1) === 0) {
                item = document.createElement("p");
                item.innerHTML = i+1;
            }
            else {
                item = document.createElement("div");
                item.style.backgroundColor = "";
                item.setAttribute("square-id", (j + (Math.sqrt(gameboard.length) * i)));
                item.addEventListener("click", selectPiece);
                
                if(gameboard[j + (Math.sqrt(gameboard.length) * i)] === 1) item.style.backgroundImage = 'url("image/wnp.png")';
                else if(gameboard[j + (Math.sqrt(gameboard.length) * i)] === 2) item.style.backgroundImage = 'url("image/wn.png")';
                else if(gameboard[j + (Math.sqrt(gameboard.length) * i)] === 3) item.style.backgroundImage = 'url("image/bnp.png")';
                else if(gameboard[j + (Math.sqrt(gameboard.length) * i)] === 4) item.style.backgroundImage = 'url("image/bn.png")';
    
                if((i + j) % 2 === 0) {
                    item.classList.add("dark");
                }
                else {
                    item.classList.add("light");
                }
            }

            board.appendChild(item);
        }
    }

    if(selected !== undefined) {
        document.querySelector('[square-id="'+selected+'"]').style.backgroundColor = "rgb(255, 255, 32)";
        let move = moves.filter(value => value[0] === selected);
        for(let i = 0; i < move.length; i++) {
            document.querySelector('[square-id="'+move[i][1]+'"]').style.backgroundColor = "rgb(255, 192, 32)";
        }
    }
}

function moveScreen(dir) {
    if(dir.id === "south") {
        if(Y[1] > Math.sqrt(gameboard.length)) return;
        else {
            Y[0]++; Y[1]++;
        }
    }
    else if(dir.id === "north") {
        if(Y[0] < 0) return;
        else {
            Y[0]--; Y[1]--;
        }
    }
    else if(dir.id === "east") {
        if(X[1] > Math.sqrt(gameboard.length)) return;
        else {
            X[0]++; X[1]++;
        }
    }
    else if(dir.id === "west") {
        if(X[0] < 0) return;
        else {
            X[0]--; X[1]--;
        }
    }

    displayGrid();
}

function selectPiece(item) {
    if(item.target.style.backgroundImage !== "" && selected === undefined &&
            moves.findIndex(value => value[0] === parseInt(item.target.getAttribute("square-id"))) >= 0) {
        item.target.style.backgroundColor = "rgb(255, 255, 32)";
        selected = parseInt(item.target.getAttribute("square-id"));

        let move = moves.filter(value => value[0] === selected);
        for(let i = 0; i < move.length; i++) {
            document.querySelector('[square-id="'+move[i][1]+'"]').style.backgroundColor = "rgb(255, 192, 32)";
        }
    }
    else if(selected !== undefined &&
            moves.findIndex(value => value[1] === parseInt(item.target.getAttribute("square-id")) &&
            value[0] === selected) >= 0) {
        item.target.style.backgroundImage = document.querySelector('[square-id="'+selected+'"]').style.backgroundImage;
        document.querySelector('[square-id="'+selected+'"]').style.backgroundImage = "";
        document.querySelector('[square-id="'+selected+'"]').style.backgroundColor = "";

        gameboard[parseInt(item.target.getAttribute("square-id"))] = gameboard[selected];
        gameboard[selected] = 0;
        game.push([selected, parseInt(item.target.getAttribute("square-id"))]);

        let move = moves.filter(value => value[0] === selected);
        for(let i = 0; i < move.length; i++) {
            document.querySelector('[square-id="'+move[i][1]+'"]').style.backgroundColor = "";
        }

        selected = undefined;
        onTurn = Math.abs(onTurn - 1);
        if(parseInt(item.target.getAttribute("square-id")) % (gameboard.length - 1) === 0) {}
        else generateMoves();
        displayGame();
    }
    else if(selected === parseInt(item.target.getAttribute("square-id"))) {
        document.querySelector('[square-id="'+selected+'"]').style.backgroundColor = "";
        let move = moves.filter(value => value[0] === selected);
        for(let i = 0; i < move.length; i++) {
            document.querySelector('[square-id="'+move[i][1]+'"]').style.backgroundColor = "";
        }
        selected = undefined;
    }
}

function generateMoves() {
    moves = [];
    for(let i = 0; i < gameboard.length; i++) {
        if(onTurn === 0 && gameboard[i] === 2) {
            pieceMoves(i);
        }
        else if(onTurn === 1 && gameboard[i] === 4) {
            pieceMoves(i);
        }
    }
}

function pieceMoves(index) {
    let move = [
        index + 1 - 2 * onTurn,
        index + Math.sqrt(gameboard.length)  - (2 * Math.sqrt(gameboard.length) * onTurn),
        index + (1 + Math.sqrt(gameboard.length)) - ((2 + 2 * Math.sqrt(gameboard.length)) * onTurn)
    ];

    for(let i = 0; i < move.length; i++) {
        if(move[i] < 0 || move[i] >= gameboard.length) {}
        else if(Math.abs(Math.floor(move[i] / Math.sqrt(gameboard.length)) - 
            Math.floor(index / Math.sqrt(gameboard.length))) !== Math.ceil(i / 2)) {}
        else if(Math.abs(Math.ceil(gameboard[move[i]] / 2) - Math.ceil(gameboard[index] / 2)) !== 0)
            moves.push([index, move[i]]);
    }
}

function displayGame() {
    let container = document.getElementById("moves");
    container.innerHTML = "";

    container.innerHTML = "(" + Math.sqrt(gameboard.length) + 'x' + Math.sqrt(gameboard.length) + ') ';
    for(let i = 0; i < game.length; i++) {
        if(i % 2 === 0) 
            container.innerHTML += Math.floor(i / 2 + 1) + '. ' + (game[i][0] % Math.sqrt(gameboard.length) + 1) + 
                '|' + Math.floor(game[i][0] / Math.sqrt(gameboard.length) + 1) + ' - ' + (game[i][1] % Math.sqrt(gameboard.length) + 1) + 
                '|' + Math.floor(game[i][1] / Math.sqrt(gameboard.length) + 1) + '; ';
        else 
            container.innerHTML += (game[i][0] % Math.sqrt(gameboard.length) + 1) + 
                '|' + Math.floor(game[i][0] / Math.sqrt(gameboard.length) + 1) + ' - ' + (game[i][1] % Math.sqrt(gameboard.length) + 1) + 
                '|' + Math.floor(game[i][1] / Math.sqrt(gameboard.length) + 1) + '; ';
    }
}

document.getElementById("size").addEventListener("change", sizeFix);
document.getElementById("newGame").addEventListener("click", newGame);
document.getElementById("newGame").click();