const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 32;
const rows = 15;
const cols = 14;

let pacman = {
    x: 1,
    y: 1,
    dir: { x: 0, y: 0 },
    nextDir: { x: 0, y: 0 }
};

// Simple maze: 0 = path, 1 = wall
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Draw maze
function drawMaze() {
    for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
            if(maze[y][x] === 1){
                ctx.fillStyle = "blue";
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            } else {
                ctx.fillStyle = "black";
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                // draw dot
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(x*tileSize + tileSize/2, y*tileSize + tileSize/2, 4, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }
}

// Draw Pac-Man
function drawPacman() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(pacman.x*tileSize + tileSize/2, pacman.y*tileSize + tileSize/2, tileSize/2 - 2, 0, Math.PI*2);
    ctx.fill();
}

// Update Pac-Man position
function updatePacman() {
    // check if nextDir is possible
    let nx = pacman.x + pacman.nextDir.x;
    let ny = pacman.y + pacman.nextDir.y;
    if(maze[ny][nx] === 0){
        pacman.dir = {...pacman.nextDir};
    }

    let newX = pacman.x + pacman.dir.x;
    let newY = pacman.y + pacman.dir.y;
    if(maze[newY][newX] === 0){
        pacman.x = newX;
        pacman.y = newY;
    }
}

// Key controls
document.addEventListener("keydown", e=>{
    switch(e.key){
        case "ArrowUp": pacman.nextDir = {x:0, y:-1}; break;
        case "ArrowDown": pacman.nextDir = {x:0, y:1}; break;
        case "ArrowLeft": pacman.nextDir = {x:-1, y:0}; break;
        case "ArrowRight": pacman.nextDir = {x:1, y:0}; break;
    }
});

// Game loop
function gameLoop() {
    drawMaze();
    updatePacman();
    drawPacman();
    requestAnimationFrame(gameLoop);
}

gameLoop();
