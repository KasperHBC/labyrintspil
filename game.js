const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = { x: 200, y: 200, radius: 5 };
let maze = [
    // Tegn labyrinten som et array af linjer eller rektangler
    { x1: 50, y1: 50, x2: 350, y2: 50 },
    { x1: 50, y1: 350, x2: 350, y2: 350 },
    { x1: 50, y1: 50, x2: 50, y2: 350 },
    { x1: 350, y1: 50, x2: 350, y2: 350 },
    // Tilføj flere linjer/rektangler for at lave din labyrint
];

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    maze.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    });
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
    maze.forEach(line => {
        if (ball.x > line.x1 && ball.x < line.x2 && ball.y > line.y1 && ball.y < line.y2) {
            // Simpel kollision detektion - juster efter dine labyrintvægge
            ball.x -= gamma * 0.1;
            ball.y -= beta * 0.1;
        }
    });
}

function updateGame() {
    drawMaze();
    drawBall();
    requestAnimationFrame(updateGame);
}

if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
}



updateGame();
