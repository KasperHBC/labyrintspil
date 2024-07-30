const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dynamisk justering af canvas dimensioner
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mazeWidth = 20; // Bredde af maze i celler
const mazeHeight = 20; // Højde af maze i celler
const cellSize = Math.min(canvas.width / mazeWidth, canvas.height / mazeHeight);

let ball = { x: 1 * cellSize, y: 1 * cellSize, radius: cellSize / 4 };
let maze = [];
let holes = [];
let goal = {};

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    maze.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.x1 * cellSize, line.y1 * cellSize);
        ctx.lineTo(line.x2 * cellSize, line.y2 * cellSize);
        ctx.stroke();
    });
}

function drawHoles() {
    ctx.fillStyle = 'black';
    holes.forEach(hole => {
        ctx.beginPath();
        ctx.arc(hole.x * cellSize, hole.y * cellSize, hole.radius * cellSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function drawGoal() {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(goal.x * cellSize, goal.y * cellSize, goal.radius * cellSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function handleOrientation(event) {
    const gamma = event.gamma; // Til venstre/højre tilt
    const beta = event.beta; // Frem/tilbage tilt

    // Juster kuglens position baseret på tilt-værdierne
    ball.x += gamma * 0.1;
    ball.y += beta * 0.1;

    // Hold kuglen indenfor canvas grænserne
    if (ball.x < ball.radius) ball.x = ball.radius;
    if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;
    if (ball.y < ball.radius) ball.y = ball.radius;
    if (ball.y > canvas.height - ball.radius) ball.y = canvas.height - ball.radius;

    checkCollision();
}

function checkCollision() {
    // Tjek kollision med labyrintens vægge
    maze.forEach(line => {
        let x1 = line.x1 * cellSize;
        let y1 = line.y1 * cellSize;
        let x2 = line.x2 * cellSize;
        let y2 = line.y2 * cellSize;

        if (ball.x > Math.min(x1, x2) && ball.x < Math.max(x1, x2) && ball.y > Math.min(y1, y2) && ball.y < Math.max(y1, y2)) {
            ball.x -= gamma * 0.1;
            ball.y -= beta * 0.1;
        }
    });

    // Tjek kollision med huller
    holes.forEach(hole => {
        let dx = ball.x - hole.x * cellSize;
        let dy = ball.y - hole.y * cellSize;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.radius + hole.radius * cellSize) {
            alert('Du faldt i et hul! Prøv igen.');
            ball.x = 1 * cellSize;
            ball.y = 1 * cellSize;
        }
    });

    // Tjek om kuglen rammer målhullet
    let dx = ball.x - goal.x * cellSize;
    let dy = ball.y - goal.y * cellSize;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + goal.radius * cellSize) {
        alert('Tillykke! Du har ramt målet.');
        ball.x = 1 * cellSize;
        ball.y = 1 * cellSize;
    }
}

function updateGame() {
    drawMaze();
    drawHoles();
    drawGoal();
    drawBall();
    requestAnimationFrame(updateGame);
}

if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
}

// Hent JSON-filen og initialiser spillet
fetch('bane.json')
    .then(response => response.json())
    .then(data => {
        maze = data.maze;
        holes = data.holes;
        goal = data.goal;
        updateGame(); // Start spillet efter data er hentet
    })
    .catch(error => console.error('Error loading level data:', error));
