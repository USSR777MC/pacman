const width = 20;
const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
let squares = [];
let score = 0;

// Layout: 0=dot, 1=wall, 2=empty/ghost lair, 3=power pellet
const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,
    1,3,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,3,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,2,2,2,2,2,2,1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,
    1,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,3,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];

// Create the board
function createBoard() {
    for (let i = 0; i < layout.length; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);

        if (layout[i] === 1) square.classList.add('wall');
        else if (layout[i] === 0) square.classList.add('pac-dot');
        else if (layout[i] === 3) square.classList.add('power-pellet');
        else if (layout[i] === 2) square.classList.add('empty');
    }
}
createBoard();

// Pac-Man
let pacmanCurrentIndex = 220;
squares[pacmanCurrentIndex].classList.add('pac-man');

function control(e) {
    squares[pacmanCurrentIndex].classList.remove('pac-man');

    switch(e.key) {
        case 'ArrowLeft':
            if (pacmanCurrentIndex % width !== 0 && 
                !squares[pacmanCurrentIndex -1].classList.contains('wall')) 
                pacmanCurrentIndex -=1;
            break;
        case 'ArrowRight':
            if (pacmanCurrentIndex % width < width -1 &&
                !squares[pacmanCurrentIndex +1].classList.contains('wall'))
                pacmanCurrentIndex +=1;
            break;
        case 'ArrowUp':
            if (pacmanCurrentIndex - width >=0 &&
                !squares[pacmanCurrentIndex - width].classList.contains('wall'))
                pacmanCurrentIndex -= width;
            break;
        case 'ArrowDown':
            if (pacmanCurrentIndex + width < squares.length &&
                !squares[pacmanCurrentIndex + width].classList.contains('wall'))
                pacmanCurrentIndex += width;
            break;
    }

    squares[pacmanCurrentIndex].classList.add('pac-man');
    pacDotEaten();
}
document.addEventListener('keyup', control);

function pacDotEaten() {
    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
        squares[pacmanCurrentIndex].classList.remove('pac-dot');
        score++;
        scoreDisplay.textContent = score;
    }
    if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
        squares[pacmanCurrentIndex].classList.remove('power-pellet');
        score +=10;
        ghosts.forEach(ghost => ghost.isScared = true);
        setTimeout(() => ghosts.forEach(ghost => ghost.isScared = false), 10000);
    }
    checkWin();
}

// Ghosts
class Ghost {
    constructor(className, startIndex, speed){
        this.className = className;
        this.startIndex = startIndex;
        this.currentIndex = startIndex;
        this.speed = speed;
        this.isScared = false;
        this.timerId = NaN;
    }
}

const ghosts = [
    new Ghost('blinky', 182, 250),
    new Ghost('pinky', 187, 400),
    new Ghost('inky', 192, 300),
    new Ghost('clyde', 197, 500)
];

// Draw ghosts
ghosts.forEach(ghost => {
    squares[ghost.currentIndex].classList.add(ghost.className);
    squares[ghost.currentIndex].classList.add('ghost');
    moveGhost(ghost);
});

function moveGhost(ghost){
    const directions = [-1, +1, -width, +width];
    let direction = directions[Math.floor(Math.random()*directions.length)];

    ghost.timerId = setInterval(() => {
        if (!squares[ghost.currentIndex + direction].classList.contains('wall') &&
            !squares[ghost.currentIndex + direction].classList.contains('ghost')) {

            squares[ghost.currentIndex].classList.remove(ghost.className,'ghost','scared-ghost');
            ghost.currentIndex += direction;
            squares[ghost.currentIndex].classList.add(ghost.className,'ghost');

            if (ghost.isScared) squares[ghost.currentIndex].classList.add('scared-ghost');
        } else {
            direction = directions[Math.floor(Math.random()*directions.length)];
        }

        checkGameOver();

    }, ghost.speed);
}

function checkGameOver(){
    if (squares[pacmanCurrentIndex].classList.contains('ghost') &&
        !squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener('keyup', control);
        alert('Game Over!');
    }

    if (squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
        const eatenGhost = ghosts.find(ghost => ghost.currentIndex === pacmanCurrentIndex);
        if (eatenGhost){
            squares[eatenGhost.currentIndex].classList.remove(eatenGhost.className,'ghost','scared-ghost');
            eatenGhost.currentIndex = eatenGhost.startIndex;
            score +=200;
            scoreDisplay.textContent = score;
            squares[eatenGhost.currentIndex].classList.add(eatenGhost.className,'ghost');
        }
    }
}

function checkWin(){
    if (score >= layout.filter(x=> x===0 || x===3).length + layout.filter(x=> x===3).length*10) {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener('keyup', control);
        alert('You Win!');
    }
}
