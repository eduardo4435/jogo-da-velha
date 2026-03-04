import { GameController } from "./modules/GameController.js";
import { aiMove } from "./modules/AIController.js";
import { showWinMessage, showDrawMessage, resetScore } from "./modules/UIController.js";

// elementos html
let x = document.querySelector(".x");
let o = document.querySelector(".o");
let boxes = document.querySelectorAll(".box");
let buttons = document.querySelectorAll("#buttons-container button");
let messageContainer = document.querySelector("#message");
let messageText = document.querySelector("#message p");
let resetScoreBtn = document.querySelector("#reset-score"); 
let backMenuBtn = document.querySelector("#back-menu");

GameController.loadScore();

//botoes
buttons[0].addEventListener("click", () => startGame("pvp"));
buttons[1].addEventListener("click", () => startGame("ai"));
resetScoreBtn.addEventListener("click", resetScore);
backMenuBtn.addEventListener("click", backToMenu);

function startGame(mode) {

    if (GameController.gameMode && GameController.gameMode !== mode) {

        GameController.resetScore();
        resetScore();
    }

    GameController.start(mode);

    document.getElementById("menu-game").classList.add("hide");
    document.getElementById("container").classList.remove("hide");
}

// blocos do tabuleiro
const blocks = [];
for(let i = 1; i <= 9; i++){
    blocks.push(document.getElementById(`block-${i}`));
}

//evento de click nos blocos
for(let i = 0; i < boxes.length; i++) {

    boxes[i].addEventListener("click", function() {

        if (GameController.gameOver) return;
        if (GameController.isAITurn()) return;

        let vez = GameController.isPlayerTurn() ? x : o;

        // Verifica de tem x ou o
        if(this.children.length == 0) {

            //duplica o elemento para adicionar ao boxe
            let cloneVez = vez.cloneNode(true);
            this.appendChild(cloneVez);

            //computa Jogada
            GameController.addMove();

            checkWinCondition();

            if(GameController.gameMode === "ai" && !GameController.gameOver) {
                setTimeout(() => {
                    aiMove(blocks, o, GameController, checkWinCondition);
                }, 500);
            }
        }
    })
}



// array bidimensional, guarda a condicao de vitoria
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

//verificacao de vitoria
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
        GameController.finishGame();
        handleWin(winner, winningBlocks);
        return;
    }

    // verifica empate usando callback
    const allFilled = blocks.every(block => block.children.length > 0);

    if (allFilled) {
        GameController.finishGame();
        handleDraw();
    }
}

//tratamento de vitoria
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

    GameController.saveScore();

    //mostra mensagem de vencedor
    setTimeout(() => {
        showWinMessage(winner, messageContainer, messageText)
    }, 1800);

    // limpar tabuleiro
    setTimeout(resetGame, 3500);
}

//empate
function handleDraw() {

    setTimeout(() => {
        showDrawMessage(messageContainer, messageText);
        }, 500);

    setTimeout(resetGame, 3000);
}

//reset
function resetGame() {

    blocks.forEach(block => {
        block.innerHTML = "";
        block.classList.remove("win");
    });

    messageContainer.classList.remove("show");
    messageContainer.classList.add("hide");

    GameController.reset();
}

function backToMenu() {

    resetGame();

    document.getElementById("container").classList.add("hide");
    document.getElementById("menu-game").classList.remove("hide");
}