//controla o estado do game e mudanca de estado
export const GameController = {
    gameMode: null,
    player1: 0,
    player2: 0,
    gameOver: false,

    start(mode) {
        this.gameMode = mode;
    },

    isAITurn() {
        return this.gameMode === "ai" && this.player1 !== this.player2;
    },

    isPlayerTurn() {
        return this.player1 === this.player2;
    },

    addMove() {
        if (this.isPlayerTurn()) {
            this.player1++;
        } else {
            this.player2++;
        }
    },

    finishGame(){
        this.gameOver = true;
    },

    reset() {
        this.player1 = 0;
        this.player2 = 0;
        this.gameOver = false;
    },

    saveScore() {
        const score = {
            player1: document.querySelector("#scoreboard-1").innerText,
            player2: document.querySelector("#scoreboard-2").innerText
        };

        localStorage.setItem("ticTacToeScore", JSON.stringify(score));
    },

    loadScore() {
        const saved = localStorage.getItem("ticTacToeScore");

        if (!saved) return;

        const score = JSON.parse(saved);

        document.querySelector("#scoreboard-1").innerText = score.player1;
        document.querySelector("#scoreboard-2").innerText = score.player2;
    },

    resetScore() {
    this.player1 = 0;
    this.player2 = 0;
}
};
