//fucao IA
export function aiMove(blocks, o, GameController, checkWinCondition) {

    let emptyBlocks = blocks.filter(block => block.children.length === 0);

    if (emptyBlocks.length === 0) return;

    let randomBlock = emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];

    let cloneO = o.cloneNode(true);
    randomBlock.appendChild(cloneO);

    GameController.player2++;

    checkWinCondition();
}