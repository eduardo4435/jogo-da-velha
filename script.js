// Variaveis dos elementos html
let x = document.querySelector(".x");
let o = document.querySelector(".o");
let boxes = document.querySelectorAll(".box");
let buttons = document.querySelectorAll("#buttons-container button");
let messageContainer = document.querySelector("#message");
let messageText = document.querySelector("#message p");

let gameMode = null;

buttons[0].addEventListener("click", function() {
    startGame("pvp");
});

buttons[1].addEventListener("click", function() {
    startGame("ai");
});

// Contador de jogadas
let player1 = 0;
let player2 = 0;

// serve para bloquear o tabuleiro quando alguem vencer
let gameOver = false;

// Adicionando o evento de click aos boxes
for(let i = 0; i < boxes.length; i++) {

    boxes[i].addEventListener("click", function() {

        if (gameOver) return;
        if (gameMode === "ai" && player1 !== player2) return;

        let vez = checkVez(player1, player2);

        // Verifica de tem x ou o
        if(this.children.length == 0) {

            //duplicando o elemento para adicionar ao boxe
            let cloneVez = vez.cloneNode(true);
            this.appendChild(cloneVez);

            //computar Jogada
            if(player1 == player2) {
                player1++;
            } else {
                player2++;
            }

            checkWinCondition();

            if(gameMode === "ai" && !gameOver) {
                setTimeout(aiMove, 500);
            }
        }
    })
}

const blocks = [];

for(let i = 1; i <= 9; i++){
    blocks.push(document.getElementById(`block-${i}`));
}

// array de arrays para guarda condicoes de vitoria
const winConditions = [
    [0,1,2], // horizontal cima
    [3,4,5], // horizontal meio
    [6,7,8], // horizontal baixo
    [0,3,6], // vertical esquerda
    [1,4,7], // vertical meio
    [2,5,8], // vertical direta
    [0,4,8], // diagonal esquerda para baixo
    [2,4,6]  // diagonal direta para baixo
];

function startGame(mode) {
    gameMode = mode;

    document.getElementById("menu-game").classList.add("hide");
    document.getElementById("container").classList.remove("hide");
}

//alterna a vez de quem joga
function checkVez(player1, player2) {
    return player1 === player2 ? x : o;
}

//fucao que faz a ia jogar
function aiMove() {

    let emptyBlocks = blocks.filter(block => block.children.length === 0);

    if (emptyBlocks.length === 0) return;

    let randomBlock = emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];

    let cloneO = o.cloneNode(true);
    randomBlock.appendChild(cloneO);

    player2++;

    checkWinCondition();
}

// funcao que checa vitoria ou empate no final no jogo
function checkWinCondition() {

    let winner = null;
    let winningBlocks = null;

    for(let condition of winConditions) {

        //desestruturacao
        const [a, b, c] = condition;

        const first = blocks[a].children[0];

        if (
            first &&
            blocks[b].children[0] &&
            blocks[c].children[0]
        ) {
            if (
                first.className === blocks[b].children[0].className &&
                first.className === blocks[c].children[0].className
            ) {
                winner = first.className;
                winningBlocks = [a, b, c];
                break;
            }

        }
    } 

    //declara o vencedor
    if (winner) {
        gameOver = true;
        handleWin(winner, winningBlocks);
        return;
    }

    // verifica empate usando callback
    const allFilled = blocks.every(block => block.children.length > 0);

    if (allFilled) {
        gameOver = true;
        handleDraw();
    }
}

function handleWin(winner, winningBlocks) {
    
    //piscar blocos vencedores
    winningBlocks.forEach(index => {
        blocks[index].classList.add("win");
    });

    //atualizar placar
    if (winner === "x") {
        document.querySelector("#scoreboard-1").innerText++;
    } else {
        document.querySelector("#scoreboard-2").innerText++;
    }

    //mostra mensagem de vencedor
    setTimeout(() => {

        messageText.innerText = winner.toUpperCase() + " Venceu!";
        messageContainer.classList.remove("hide");
        messageContainer.classList.add("show");

    }, 1800)

    // limpar tabuleiro
    setTimeout(resetGame, 3500);
}

function handleDraw() {

    setTimeout(() => {

        messageText.innerText = "Deu velha!";
        messageContainer.classList.remove("hide");
        messageContainer.classList.add("show");

    }, 500);

    setTimeout(resetGame, 3000);
}

function resetGame() {

    blocks.forEach(block => {
        block.innerHTML = "";
        block.classList.remove("win");
    });

    messageContainer.classList.remove("show");
    messageContainer.classList.add("hide");

    player1 = 0;
    player2 = 0;
    gameOver = false;
}