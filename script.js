const width = 20;
const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
let squares = [];
let score = 0;

// Layout: 0=dot, 1=wall, 2=ghost lair, 3=power pellet
const layout = [
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
1,3,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,3,1,
1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,
1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,
1,0,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,
1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,1,
1,0,1,0,1,1,0,1,0,1,0,1,0,1,1,0,1,0,1,1,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
1,0,1,0,1,1,0,1,1,2,2,1,1,0,1,1,0,1,0,1,
1,0,1,0,0,0,0,1,2,2,2,2,1,0,0,0,0,1,0,1,
1,0,1,1,0,1,1,1,2,2,2,2,1,1,0,1,1,0,1,1,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
1,1,1,0,1,1,0,1,0,0,0,1,0,1,1,0,1,1,1,1,
1,3,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,3,1,
1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,
1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,
1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];

// Create board
function createBoard() {
    for(let i=0;i<layout.length;i++){
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);
        if(layout[i]===1) square.classList.add('wall');
        else if(layout[i]===0) square.classList.add('pac-dot');
        else if(layout[i]===3) square.classList.add('power-pellet');
        else if(layout[i]===2) square.classList.add('empty');
    }
}
createBoard();

// Pac-Man
let pacmanCurrentIndex = 220;
squares[pacmanCurrentIndex].classList.add('pac-man');

function control(e){
    squares[pacmanCurrentIndex].classList.remove('pac-man');
    let nextIndex = pacmanCurrentIndex;

    switch(e.key){
        case 'ArrowLeft': nextIndex = pacmanCurrentIndex-1; break;
        case 'ArrowRight': nextIndex = pacmanCurrentIndex+1; break;
        case 'ArrowUp': nextIndex = pacmanCurrentIndex-width; break;
        case 'ArrowDown': nextIndex = pacmanCurrentIndex+width; break;
    }

    if(nextIndex>=0 && nextIndex<squares.length &&
       !squares[nextIndex].classList.contains('wall') &&
       !squares[nextIndex].classList.contains('empty')) {
        pacmanCurrentIndex = nextIndex;
    }

    squares[pacmanCurrentIndex].classList.add('pac-man');
    pacDotEaten();
}
document.addEventListener('keyup', control);

// Eating dots/power-pellets
function pacDotEaten(){
    if(squares[pacmanCurrentIndex].classList.contains('pac-dot')){
        squares[pacmanCurrentIndex].classList.remove('pac-dot');
        score++;
        scoreDisplay.textContent = score;
    }
    if(squares[pacmanCurrentIndex].classList.contains('power-pellet')){
        squares[pacmanCurrentIndex].classList.remove('power-pellet');
        score+=10;
        scoreDisplay.textContent = score;
        ghosts.forEach(ghost=>ghost.isScared=true);
        setTimeout(()=>ghosts.forEach(ghost=>ghost.isScared=false),10000);
    }
    checkWin();
}

// Ghosts
class Ghost{
    constructor(className,startIndex,speed){
        this.className=className;
        this.startIndex=startIndex;
        this.currentIndex=startIndex;
        this.speed=speed;
        this.isScared=false;
        this.canLeaveLair=false;
        this.timerId=NaN;
    }
}

const ghosts=[
    new Ghost('blinky',182,250),
    new Ghost('pinky',187,400),
    new Ghost('inky',192,300),
    new Ghost('clyde',197,500)
];

// Draw ghosts and release from lair
ghosts.forEach(ghost=>{
    squares[ghost.currentIndex].classList.add(ghost.className,'ghost');
    setTimeout(()=>ghost.canLeaveLair=true,1000); // 1 sec delay
    moveGhost(ghost);
});

// Ghost AI
function moveGhost(ghost){
    const directions=[-1,+1,-width,+width];

    ghost.timerId=setInterval(()=>{
        // only allow leaving lair if canLeaveLair=true
        if(!ghost.canLeaveLair && layout[ghost.currentIndex]!==2) return;

        let direction=directions[Math.floor(Math.random()*directions.length)];
        const nextIndex = ghost.currentIndex + direction;

        if(nextIndex>=0 && nextIndex<squares.length &&
           !squares[nextIndex].classList.contains('wall') &&
           !squares[nextIndex].classList.contains('ghost')) {

            squares[ghost.currentIndex].classList.remove(ghost.className,'ghost','scared-ghost');
            ghost.currentIndex=nextIndex;
            squares[ghost.currentIndex].classList.add(ghost.className,'ghost');
            if(ghost.isScared) squares[ghost.currentIndex].classList.add('scared-ghost');
        }

        checkGameOver();
    },ghost.speed);
}

// Collisions
function checkGameOver(){
    if(squares[pacmanCurrentIndex].classList.contains('ghost') &&
       !squares[pacmanCurrentIndex].classList.contains('scared-ghost')){
        ghosts.forEach(g=>clearInterval(g.timerId));
        document.removeEventListener('keyup',control);
        alert('Game Over!');
    }

    if(squares[pacmanCurrentIndex].classList.contains('scared-ghost')){
        const eatenGhost=ghosts.find(g=>g.currentIndex===pacmanCurrentIndex);
        if(eatenGhost){
            squares[eatenGhost.currentIndex].classList.remove(eatenGhost.className,'ghost','scared-ghost');
            eatenGhost.currentIndex=eatenGhost.startIndex;
            score+=200;
            scoreDisplay.textContent=score;
            squares[eatenGhost.currentIndex].classList.add(eatenGhost.className,'ghost');
        }
    }
}

// Win condition
function checkWin(){
    const totalDots=layout.filter(x=>x===0||x===3).length+layout.filter(x=>x===3).length*10;
    if(score>=totalDots){
        ghosts.forEach(g=>clearInterval(g.timerId));
        document.removeEventListener('keyup',control);
        alert('You Win!');
    }
}
