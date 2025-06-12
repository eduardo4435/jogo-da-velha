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
for(let i = 0; i < boxes.length; i++){

    //quando alguem clica na caixa
    boxes[i].addEventListener("click", function(){

        let el = checkEl(player1, player2)

        //verifica se ja tem x ou o
        if(this.childNodes.length == 0){
            //criando clone do elemento
            let cloneEl = el.cloneNode(true);
            //adicionando o clone
            this.appendChild(cloneEl);

            //contabilizar jogada
            if(player1 == player2){
            player1++

            if(secondPlayer == 'ai-player') {
                // funcao executar a jogada
                computerPlay();
                player2++;
            }

            } else{
            player2++;
            }

            //checa se alguem venceu
            checkWinCodition()
        }

    })
}

// evento para saber se e dois player ou IA
for(let i = 0; i < buttons.length; i++) {

    buttons[i].addEventListener("click", function() {

        secondPlayer = this.getAttribute("id");

        for(let j = 0; j < buttons.length; j++){
            buttons[j].style.display = 'none'
        }

        setTimeout(function() {
            let conteiner = document.querySelector('#conteiner')
            conteiner.classList.remove("hide")
        }, 500)

    })

}

// ver quem vai jogar 
function checkEl(p1, p2) {
    if(p1 == p2){
    //x
    el = x;
    } else {
    //o
    el = o;
    }

    return el;
}

// ver quem ganhou
function checkWinCodition() {
    
    // Monta a matriz 3x3 com o valor de cada posição: 'x', 'o' ou null
    let matrix = [];

    for (let i = 0; i < 3; i++) {
        matrix[i] = [];
        for (let j = 0; j < 3; j++) {
            let boxIndex = i * 3 + j; // mapeia linha e coluna para o índice do box
            let box = boxes[boxIndex];
            if (box.childNodes.length > 0) {
                matrix[i][j] = box.childNodes[0].className; // 'x' ou 'o'
            } else {
                matrix[i][j] = null;
            }
        }
    }

    // Função auxiliar para checar se 3 valores são iguais e não nulos
    function checkLine(a, b, c) {
        return (a !== null) && (a === b) && (b === c);
    }

    // Checar linhas
    for (let i = 0; i < 3; i++) {
        if (checkLine(matrix[i][0], matrix[i][1], matrix[i][2])) {
            declareWinner(matrix[i][0]);
            return;
        }
    }

    // Checar colunas
    for (let j = 0; j < 3; j++) {
        if (checkLine(matrix[0][j], matrix[1][j], matrix[2][j])) {
            declareWinner(matrix[0][j]);
            return;
        }
    }

    // Checar diagonais
    if (checkLine(matrix[0][0], matrix[1][1], matrix[2][2])) {
        declareWinner(matrix[0][0]);
        return;
    }
    if (checkLine(matrix[0][2], matrix[1][1], matrix[2][0])) {
        declareWinner(matrix[0][2]);
        return;
    }

    // Checar empate (velha)
    let filledBoxes = boxes.length - Array.from(boxes).filter(box => box.childNodes.length === 0).length;

    if (filledBoxes === 9) {
        declareWinner('velha');
    }
}

//limpa o jogo, declara o vencedor e limpa o placar
function declareWinner(winner) {
    let scoreboardx = document.querySelector("#scoreboard-1")
    let scoreboardo = document.querySelector("#scoreboard-2")
    let msg = '';

    if(winner == 'x') {
        scoreboardx.textContent = parseInt(scoreboardx.textContent) + 1
        messageText.classList.remove('bg-red', 'bg-green', 'bg-gray');
        messageText.classList.add('bg-red');
        msg = 'O jogador 1 venceu!'
    } else if (winner == 'o') {
        scoreboardo.textContent = parseInt(scoreboardo.textContent) + 1
        messageText.classList.remove('bg-red', 'bg-green', 'bg-gray')
        messageText.classList.add('bg-green');
        msg = 'O jogador 2 venceu!'
    } else {
        messageText.classList.remove('bg-red', 'bg-green', 'bg-gray')
        messageText.classList.add('bg-gray');
        msg = 'Deu velha!'
    }

    //exibe mensagem
    messageText.innerHTML = msg;
    messageConteiner.classList.remove("hide")

    //esconder a mensagem dnv
    setTimeout(function() {
        messageConteiner.classList.add("hide")
    }, 3000)

    //zera jogadas
    player1 = 0
    player2 = 0

    //remove x e o
    let boxesToRemove = document.querySelectorAll(".box div")

    for(let i = 0; i < boxesToRemove.length; i++){
        boxesToRemove[i].parentNode.removeChild(boxesToRemove[i])
    }

}

// executar a logica da jogada da CPU

function computerPlay() {
    let cloneO = o.cloneNode(true);
    let counter = 0;
    let filled = 0;

    for(let i = 0; i < boxes.length; i++) {
        if(boxes[i].childNodes[0] != undefined) {
            filled++;
        }
    }

    if(filled < 9) {
        let rand = Math.floor(Math.random() * 9);

        while(boxes[rand].childNodes.length > 0) {
            rand = Math.floor(Math.random() * 9);
        }

        boxes[rand].appendChild(cloneO);
    }
}
