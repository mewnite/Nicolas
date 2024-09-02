// Configuración de fuegos artificiales
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function Firework(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.distanceToTarget = Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(targetY - y, targetX - x);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 1;
}

Firework.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = Math.sqrt(vx * vx + vy * vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.targetX, this.targetY);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
}

Firework.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + random(0, 360) + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
}

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = random(0, 360);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
}

Particle.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
}

let fireworks = [];
let particles = [];
let timerTick = 0;
let timerTotal = 20;  // Genera fuegos artificiales más frecuentemente

function loop() {
    requestAnimationFrame(loop);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    fireworks.forEach((firework, index) => {
        firework.draw();
        firework.update(index);
    });

    particles.forEach((particle, index) => {
        particle.draw();
        particle.update(index);
    });

    if (timerTick >= timerTotal) {
        // Genera el fuego artificial original
        const originalX = canvas.width / 2;
        const originalY = canvas.height;
        const targetX = random(0, canvas.width / 2);
        const targetY = random(0, canvas.height / 2);
        fireworks.push(new Firework(originalX, originalY, targetX, targetY));

        // Genera el fuego artificial en espejo
        const mirroredTargetX = canvas.width - targetX;
        fireworks.push(new Firework(originalX, originalY, mirroredTargetX, targetY));

        timerTick = 0;
    } else {
        timerTick++;
    }
}

function createParticles(x, y) {
    let particleCount = 50;  // Aumenta la cantidad de partículas por explosión
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

loop();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
