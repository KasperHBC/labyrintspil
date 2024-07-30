const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = { x: 200, y: 200, radius: 5 };
let maze = [
    // Labyrintens vægge som linjer
    { x1: 50, y1: 50, x2: 350, y2: 50 },
    { x1: 50, y1: 350, x2: 350, y2: 350 },
    { x1: 50, y1: 50, x2: 50, y2: 350 },
    { x1: 350, y1: 50, x2: 350, y2: 350 },
    { x1: 100, y1: 50, x2: 100, y2: 300 },
    { x1: 200, y1: 100, x2: 300, y2: 100 },
    // Tilføj flere linjer for at lave en mere kompleks labyrint
];

let holes = [
    { x: 150, y: 150, radius: 10 },
    { x: 250, y: 250, radius: 10 },
    // Tilføj flere huller
];

let goal = { x: 200, y: 200, radius: 15 };

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

function drawHoles() {
    ctx.fillStyle = 'black';
    holes.forEach(hole => {
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function drawGoal() {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(goal.x, goal.y, goal.radius, 0, Math.PI * 2);
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
        if (ball.x > line.x1 && ball.x < line.x2 && ball.y > line.y1 && ball.y < line.y2) {
            ball.x -= gamma * 0.1;
            ball.y -= beta * 0.1;
        }
    });

    // Tjek kollision med huller
    holes.forEach(hole => {
        let dx = ball.x - hole.x;
        let dy = ball.y - hole.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.radius + hole.radius) {
            alert('Du faldt i et hul! Prøv igen.');
            ball.x = 200;
            ball.y = 200;
        }
    });

    // Tjek om kuglen rammer målhullet
    let dx = ball.x - goal.x;
    let dy = ball.y - goal.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + goal.radius) {
        alert('Tillykke! Du har ramt målet.');
        ball.x = 200;
        ball.y = 200;
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

updateGame();
