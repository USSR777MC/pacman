const width = 100; // 100 cells per row
const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
let squares = [];
let score = 0;

// Fully completed layout for 20x100 board (2000 cells)
// 0 = pac-dot, 1 = wall, 2 = ghost lair, 3 = power pellet
const layout = [
  // Row 0 (top wall)
  ...Array(100).fill(1),

  // Row 1 (dots + corner power pellets)
  3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,

  // Rows 2–8 (walls at edges, dots inside)
  ...Array(7*100).fill(0).map((v,i)=> (i%100===0 || i%100===99 ? 1 : 0)),

  // Rows 9–10 (ghost lair in columns 45–55)
  ...Array(100).fill(0).map((v,i)=> {
    if(i===0 || i===99) return 1; // walls
    if(i>=45 && i<=55) return 2;  // ghost lair
    return 0;                     // pac-dot
  }),
  ...Array(100).fill(0).map((v,i)=> {
    if(i===0 || i===99) return 1;
    if(i>=45 && i<=55) return 2;
    return 0;
  }),

  // Rows 11–18 (walls at edges, dots inside)
  ...Array(8*100).fill(0).map((v,i)=> (i%100===0 || i%100===99 ? 1 : 0)),

  // Row 19 (bottom wall)
  ...Array(100).fill(1)
];

// Calculate total points for win condition
const totalScore = layout.reduce((acc, cell) => {
    if(cell===0) return acc+1;      // pac-dot
    if(cell===3) return acc+10;     // power pellet
    return acc;
}, 0);

// Create board
function createBoard(){
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
let pacmanCurrentIndex = 1050; // center of board
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
       !squares[nextIndex].classList.contains('empty')){
        pacmanCurrentIndex = nextIndex;
    }

    squares[pacmanCurrentIndex].classList.add('pac-man');
    pacDotEaten();
}
document.addEventListener('keyup', control);

// Eating dots and power pellets
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
        ghosts.forEach(g=>g.isScared=true);
        setTimeout(()=>ghosts.forEach(g=>g.isScared=false),10000);
    }

    if(score>=totalScore){
        document.removeEventListener('keyup', control);
        ghosts.forEach(g=>clearInterval(g.timerId));
        alert("You Win! 🎉");
    }
}

// Ghost class
class Ghost{
    constructor(className,startIndex,speed){
        this.className = className;
        this.startIndex = startIndex;
        this.currentIndex = startIndex;
        this.speed = speed;
        this.isScared = false;
        this.canLeaveLair = false;
        this.timerId = null;
    }
}

// Ghosts in lair
const ghosts = [
    new Ghost('blinky',1045,250),
    new Ghost('pinky',1046,400),
    new Ghost('inky',1047,300),
    new Ghost('clyde',1048,500)
];

// Draw and move ghosts
ghosts.forEach(ghost=>{
    squares[ghost.currentIndex].classList.add(ghost.className,'ghost');
    setTimeout(()=>ghost.canLeaveLair=true,1000); // 1 sec delay
    moveGhost(ghost);
});

function moveGhost(ghost){
    const directions = [-1,+1,-width,+width];
    ghost.timerId = setInterval(()=>{
        if(!ghost.canLeaveLair && layout[ghost.currentIndex]!==2) return;

        let direction = directions[Math.floor(Math.random()*directions.length)];
        const nextIndex = ghost.currentIndex + direction;

        if(nextIndex>=0 && nextIndex<squares.length &&
           !squares[nextIndex].classList.contains('wall') &&
           !squares[nextIndex].classList.contains('ghost')){

            squares[ghost.currentIndex].classList.remove(ghost.className,'ghost','scared-ghost');
            ghost.currentIndex = nextIndex;
            squares[ghost.currentIndex].classList.add(ghost.className,'ghost');
            if(ghost.isScared) squares[ghost.currentIndex].classList.add('scared-ghost');
        }

        checkGameOver();
    }, ghost.speed);
}

// Game over / eating scared ghosts
function checkGameOver(){
    if(squares[pacmanCurrentIndex].classList.contains('ghost') &&
       !squares[pacmanCurrentIndex].classList.contains('scared-ghost')){
        ghosts.forEach(g=>clearInterval(g.timerId));
        document.removeEventListener('keyup', control);
        alert("Game Over 💀");
    }

    if(squares[pacmanCurrentIndex].classList.contains('scared-ghost')){
        const eatenGhost = ghosts.find(g=>g.currentIndex===pacmanCurrentIndex);
        if(eatenGhost){
            eatenGhost.currentIndex = eatenGhost.startIndex;
            score += 200;
            scoreDisplay.textContent = score;
        }
    }
}
