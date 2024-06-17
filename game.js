const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostsFrames = document.getElementById("ghosts");

let creatRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

let fps = 30;
let blockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = blockSize / 1.5;
let wallOffset = (blockSize - wallSpaceWidth) / 2; 
let wallInnerColor = "black";
let foodColor = "#FEB897";
let score = 0;
let ghosts = [];
let ghostCount = 4;
let lives = 3;
let foodCount = 0;

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let ghostLocations = [
    {x: 0, y: 0},
    {x: 176, y: 0},
    {x: 0, y: 121},
    {x: 176, y: 121},
]

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1], 
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2) {
            foodCount++;    
        }
    }
}

let randomTargetsForGhosts = [
    {x: 1 * blockSize, y: 1 * blockSize},
    {x: 1 * blockSize, y: (map.length - 2) * blockSize},
    {x: (map[0].length - 2) * blockSize, y: blockSize},
    {x: (map[0].length - 2) * blockSize, y: (map.length - 2) * blockSize},
];

let gameLoop = () => {
    draw();
    update();
}

let update = () => {
    pacman.playerMovement();
    pacman.eat();

    for(let i = 0; i < ghosts.length; i++){
        ghosts[i].ghostMovement();
    }

    if(pacman.checkGhostCollision()) {
        console.log("hit");
        restartGame();
    }

    if(score >= foodCount) {
        drawWin();
        clearInterval(gameInterval);
    }
}

restartGame = () => {
    createNewPacman();
    createGhosts();
    lives--;
    if(lives == 0){
        gameOver();
    }
}

gameOver = () => {
    drawGameOver();
    clearInterval(gameInterval);
}

let drawGameOver = () => {
    canvasContext.font = "30px 'Pixelify Sans'";
    canvasContext.fillStyle = "White";
    canvasContext.fillText("Game Over!", 140, 225)
}

let drawWin = () => {
    canvasContext.font = "30px 'Pixelify Sans'";
    canvasContext.fillStyle = "White";
    canvasContext.fillText("You Win!", 155, 225)
}

let drawLives = () => {
    canvasContext.font = "30px 'Pixelify Sans'";
    canvasContext.fillStyle = "White";
    canvasContext.fillText("Lives: ", 220, blockSize * (map.length + 1) + 10);

    for(let i = 0; i < lives; i++){
        canvasContext.drawImage(
            pacmanFrames,
            2 * blockSize,
            0,
            blockSize,
            blockSize,
            310 + i * blockSize,
            blockSize * map.length + 12,
            blockSize,
            blockSize
        );
    }
}

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                creatRect(
                    j * blockSize + blockSize / 3,
                    i * blockSize + blockSize / 3,
                    blockSize / 3,
                    blockSize / 3,
                    foodColor
                );
            }
        }
    }
}

let drawScore = () => {
    canvasContext.font = "30px 'Pixelify Sans'";
    canvasContext.fillStyle = "White";
    canvasContext.fillText("SCORE: " + score, 0, blockSize * (map.length + 1) + 10);
}

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++){
        ghosts[i].draw();
    }
}

let draw = () => {
    creatRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
}

let gameInterval = setInterval(gameLoop, 1000/fps);

let drawWalls = () => {
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[0].length; j++) {
            if(map[i][j] == 1) {
                creatRect(
                 j * blockSize,
                 i * blockSize, 
                 blockSize, 
                 blockSize, 
                 wallColor
                );

                if(j > 0 && map[i][j - 1] == 1) {
                    creatRect(
                    j * blockSize, 
                    i * blockSize + wallOffset, 
                    wallSpaceWidth + wallOffset, 
                    wallSpaceWidth, 
                    wallInnerColor
                );
                }
                if(j < map[0].length - 1 && map[i][j + 1] == 1) {
                    creatRect(
                        j * blockSize + wallOffset, 
                        i * blockSize + wallOffset, 
                        wallSpaceWidth + wallOffset, 
                        wallSpaceWidth, 
                        wallInnerColor
                    );
                }
                if(i > 0 && map[i - 1][j] == 1) {
                    creatRect(
                    j * blockSize + wallOffset, 
                    i * blockSize, 
                    wallSpaceWidth, 
                    wallSpaceWidth + wallOffset, 
                    wallInnerColor
                );
                }
                if(i < map.length - 1 && map[i + 1][j] == 1) {   
                    creatRect(
                        j * blockSize + wallOffset, 
                        i * blockSize + wallOffset, 
                        wallSpaceWidth, 
                        wallSpaceWidth + wallOffset, 
                        wallInnerColor
                    );
                }
            }
        }
    }
}

let createNewPacman = () => {
    pacman = new Pacman(
        blockSize,
        blockSize,
        blockSize,
        blockSize,
        blockSize / 5
    );
}

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount; i++){
        let newGhost = new Ghost(
            9 * blockSize + (i % 2 == 0 ? 0 : 1) * blockSize,
            10 * blockSize + (i % 2 == 0 ? 0 : 1) * blockSize,
            blockSize,
            blockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124, 116,
            6 + i
        );
        ghosts.push(newGhost);
    }
}

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
    let key = event.keyCode;

    setTimeout(() => {
        if(key == 37 || key == 65) {           //·· Left Movement ·····//
            pacman.nextDirection = DIRECTION_LEFT;

        } else if (key == 38 || key == 87) {   //·· Up Movement ·······//
            pacman.nextDirection = DIRECTION_UP;

        } else if (key == 39 || key == 68) {   //·· Right Movement ····//
            pacman.nextDirection = DIRECTION_RIGHT;

        } else if (key == 40 || key == 83) {   //·· Bottom Movement ···//     
            pacman.nextDirection = DIRECTION_BOTTOM;

        }
    }, 1);
});