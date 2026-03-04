import { resetScoreStorage } from "./storage.js";

export function showWinMessage(winner, messageContainer, messageText) {

    messageText.innerText = winner.toUpperCase() + " Venceu!";
    messageContainer.classList.remove("hide");
    messageContainer.classList.add("show");
}

export function showDrawMessage(messageContainer, messageText) {

    messageText.innerText = "Deu velha!";
    messageContainer.classList.remove("hide");
    messageContainer.classList.add("show");
}

export function resetScore() {

    // limpa localStorage
    resetScoreStorage();

    // zera placar visual
    document.querySelector("#scoreboard-1").innerText = 0;
    document.querySelector("#scoreboard-2").innerText = 0;
}