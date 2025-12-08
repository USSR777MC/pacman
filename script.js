const width = 20; // 20 cells wide
const scoreDisplay = document.getElementById('score');
const grid = document.querySelector('.grid');
let squares = [];
let score = 0;

// Example map layout (must be an array of length width*width, e.g., 400)
// 1=wall, 0=dot, 2=ghost lair/no food, 3=power pellet, 4=empty
const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,
    1,3,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,3,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    // ... continue to fill the rest of the 400 cells
];

// Function to draw the board
function createBoard() {
    for (let i = 0; i < layout.length; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);

        // Add class based on the layout number
        if (layout[i] === 1) {
            square.classList.add('wall');
        } else if (layout[i] === 0) {
            square.classList.add('pac-dot');
        } else if (layout[i] === 3) {
            square.classList.add('power-pellet');
        } else if (layout[i] === 2) {
            square.classList.add('empty');
        }
    }
}

createBoard();

let pacmanCurrentIndex = 300; // Example starting position

squares[pacmanCurrentIndex].classList.add('pac-man');

function control(e) {
    squares[pacmanCurrentIndex].classList.remove('pac-man');

    switch(e.key) {
        case 'ArrowLeft':
            // Check if the next space is NOT a wall (1)
            if (
                pacmanCurrentIndex % width !== 0 && // Not on the far left edge
                !squares[pacmanCurrentIndex - 1].classList.contains('wall')
            ) pacmanCurrentIndex -= 1;
            break;
        case 'ArrowRight':
            if (
                pacmanCurrentIndex % width < width - 1 && // Not on the far right edge
                !squares[pacmanCurrentIndex + 1].classList.contains('wall')
            ) pacmanCurrentIndex += 1;
            break;
        // ... add logic for ArrowUp and ArrowDown (checking for index - width and index + width)
    }
    
    squares[pacmanCurrentIndex].classList.add('pac-man');
    pacDotEaten();
}

document.addEventListener('keyup', control);

// Ghost Class
class Ghost {
    constructor(className, startIndex, speed) {
        this.className = className;
        this.startIndex = startIndex;
        this.currentIndex = startIndex;
        this.speed = speed;
        this.isScared = false;
        this.timerId = NaN;
    }
}

// Create an array of ghosts
const ghosts = [
    new Ghost('blinky', 190, 250),
    // Add more ghosts here: pinky, inky, clyde
];

// Draw ghosts on the board
ghosts.forEach(ghost => {
    squares[ghost.currentIndex].classList.add(ghost.className);
    squares[ghost.currentIndex].classList.add('ghost');
});

// Main ghost movement logic
ghosts.forEach(ghost => moveGhost(ghost));

function moveGhost(ghost) {
    const directions = [-1, +1, width, -width]; // left, right, down, up
    let direction = directions[Math.floor(Math.random() * directions.length)];

    ghost.timerId = setInterval(function() {
        // Ghost can only move if the next square is not a wall (1)
        if (
            !squares[ghost.currentIndex + direction].classList.contains('wall') &&
            !squares[ghost.currentIndex + direction].classList.contains('ghost') // Optional: prevent ghosts from stacking
        ) {
            // Remove old ghost appearance
            squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost');
            
            // Move the ghost
            ghost.currentIndex += direction;
            
            // Add new ghost appearance
            squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');

            // Handle scared mode visuals
            if (ghost.isScared) {
                squares[ghost.currentIndex].classList.add('scared-ghost');
            }
        } else {
            // Find a new random direction if the current one is blocked
            direction = directions[Math.floor(Math.random() * directions.length)];
        }

        // Check for collisions (win/lose)
        checkGameOver();

    }, ghost.speed); // Ghost moves every 'speed' milliseconds
}

function checkGameOver() {
    // Game Over: Pac-Man runs into a non-scared ghost
    if (
        squares[pacmanCurrentIndex].classList.contains('ghost') && 
        !squares[pacmanCurrentIndex].classList.contains('scared-ghost')
    ) {
        ghosts.forEach(ghost => clearInterval(ghost.timerId)); // Stop all movement
        document.removeEventListener('keyup', control);
        // ... Display "Game Over" message
    }

    // Eating a Scared Ghost
    if (
        squares[pacmanCurrentIndex].classList.contains('scared-ghost')
    ) {
        // Find the ghost and send it back to the lair
        ghosts.find(ghost => ghost.currentIndex === pacmanCurrentIndex).currentIndex = 
            ghosts.find(ghost => ghost.currentIndex === pacmanCurrentIndex).startIndex;
        score += 200;
        scoreDisplay.innerHTML = score;
        // The ghost will then continue moving from its start index
    }
    
    // Check for Win: All dots have been eaten
    if (score >= /* Total maximum score */) {
        // ... Display "You Win" message
    }
}
