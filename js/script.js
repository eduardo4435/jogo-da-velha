let x = document.querySelector(".x")
let o = document.querySelector(".o")
let boxes = document.querySelectorAll(".box")
let buttons = document.querySelectorAll("#buttons-conteiner button")
let messageConteiner = document.querySelector("#message")
let messageText = document.querySelector("#message p")
let secondPlayer;

//contador de jogadas
let player1 = 0
let player2 = 0

//adicionando evento de click aos boxes
for (let i = 0; i < boxes.length; i++) {

    boxes[i].addEventListener("click", function () {

        let el = checkEl(player1, player2)

        if (this.childNodes.length == 0) {

            let cloneEl = el.cloneNode(true);
            this.appendChild(cloneEl);

            if (player1 == player2) {
                player1++

                if (secondPlayer == 'ai-player') {
                    computerPlay();
                    player2++;
                }

            } else {
                player2++;
            }

            checkWinCodition()
        }

    })
}

// evento 2 players ou IA
for (let i = 0; i < buttons.length; i++) {

    buttons[i].addEventListener("click", function () {

        secondPlayer = this.getAttribute("id");

        for (let j = 0; j < buttons.length; j++) {
            buttons[j].style.display = 'none'
        }

        setTimeout(function () {
            let conteiner = document.querySelector('#conteiner')
            conteiner.classList.remove("hide")
        }, 500)

    })

}

// ver quem vai jogar 
function checkEl(p1, p2) {
    return p1 == p2 ? x : o;
}

// desenhar linha vencedora
function drawWinLine(type, index) {
    const board = document.querySelector("#conteiner");
    const line = document.createElement("div");
    line.classList.add("win-line");

    if (type === "row") {
        line.style.top = `${index * 100 + 50}px`;
        line.style.left = "0px";
    }

    if (type === "col") {
        line.style.transform = "rotate(90deg)";
        line.style.top = "150px";
        line.style.left = `${index * 100 + 50}px`;
    }

    if (type === "diag" && index === 1) {
        line.style.transform = "rotate(45deg)";
        line.style.top = "150px";
        line.style.left = "-10px";
    }

    if (type === "diag" && index === 2) {
        line.style.transform = "rotate(-45deg)";
        line.style.top = "150px";
        line.style.left = "10px";
    }

    board.appendChild(line);
}

// ver quem ganhou
function checkWinCodition() {

    let matrix = [];

    for (let i = 0; i < 3; i++) {
        matrix[i] = [];
        for (let j = 0; j < 3; j++) {
            let boxIndex = i * 3 + j;
            let box = boxes[boxIndex];
            matrix[i][j] = box.childNodes.length ? box.childNodes[0].className : null;
        }
    }

    function checkLine(a, b, c) {
        return (a !== null) && (a === b) && (b === c);
    }

    // linhas
    for (let i = 0; i < 3; i++) {
        if (checkLine(matrix[i][0], matrix[i][1], matrix[i][2])) {
            drawWinLine("row", i);
            declareWinner(matrix[i][0]);
            return;
        }
    }

    // colunas
    for (let j = 0; j < 3; j++) {
        if (checkLine(matrix[0][j], matrix[1][j], matrix[2][j])) {
            drawWinLine("col", j);
            declareWinner(matrix[0][j]);
            return;
        }
    }

    // diagonal principal
    if (checkLine(matrix[0][0], matrix[1][1], matrix[2][2])) {
        drawWinLine("diag", 1);
        declareWinner(matrix[0][0]);
        return;
    }

    // diagonal secundária
    if (checkLine(matrix[0][2], matrix[1][1], matrix[2][0])) {
        drawWinLine("diag", 2);
        declareWinner(matrix[0][2]);
        return;
    }

    // velha
    let filled = [...boxes].filter(b => b.childNodes.length > 0).length;

    if (filled === 9) {
        declareWinner('velha');
    }
}

// declarando vencedor e reset atrasado
function declareWinner(winner) {
    let scoreboardx = document.querySelector("#scoreboard-1")
    let scoreboardo = document.querySelector("#scoreboard-2")
    let msg = '';

    if (winner == 'x') {
        scoreboardx.textContent = parseInt(scoreboardx.textContent) + 1
        messageText.className = 'bg-red'
        msg = 'O jogador 1 venceu!'
    } else if (winner == 'o') {
        scoreboardo.textContent = parseInt(scoreboardo.textContent) + 1
        messageText.className = 'bg-green'
        msg = 'O jogador 2 venceu!'
    } else {
        messageText.className = 'bg-gray'
        msg = 'Deu velha!'
    }

    messageText.innerHTML = msg;
    messageConteiner.classList.remove("hide");

    // espera antes de limpar
    setTimeout(function () {

        messageConteiner.classList.add("hide")

        // limpa os símbolos
        document.querySelectorAll(".box div").forEach(div => div.remove());

        // limpa linha vencedora
        let line = document.querySelector(".win-line");
        if (line) line.remove();

        player1 = 0;
        player2 = 0;

    }, 3000);
}

// IA
function computerPlay() {
    let cloneO = o.cloneNode(true);
    let filled = 0;

    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].childNodes[0] != undefined) {
            filled++;
        }
    }

    if (filled < 9) {
        let rand = Math.floor(Math.random() * 9);

        while (boxes[rand].childNodes.length > 0) {
            rand = Math.floor(Math.random() * 9);
        }

        boxes[rand].appendChild(cloneO);
    }
}

