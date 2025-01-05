class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        document.body.appendChild(this.canvas);
        this.canvas.style.display = 'none';

        this.balloons = [];
        this.smashes = [];
        this.score = 0;
        this.gameOver = false;
        this.gameInterval = null;

        this.background = new Image();
        this.background.src = './background.jpg';
        this.popSound = new Audio('./balloon-pop-effect.mp3');
        this.balloonColors = ['red', 'blue', 'green', 'yellow', 'purple'];

        this.init();
    }

    init() {
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    }

    createBalloon() {
        const x = Math.random() * (this.canvas.width - 40);
        const y = this.canvas.height;
        const speed = Math.random() * 2 + 1;
        const color = this.balloonColors[Math.floor(Math.random() * this.balloonColors.length)];
        return { x, y, speed, color };
    }

    createSmash(x, y) {
        return { x, y, timer: 10, radius: 8 };
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const smash = this.createSmash(e.clientX - rect.left, e.clientY - rect.top);
        this.smashes.push(smash);
    }

    drawBalloon(balloon) {
        this.ctx.fillStyle = balloon.color;
        this.ctx.beginPath();
        this.ctx.arc(balloon.x, balloon.y, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }

    startGame() {
        document.getElementById('startButton').style.display = 'none';
        this.canvas.style.display = 'block';
        this.score = 0;
        this.gameOver = false;
        this.balloons = [];
        this.smashes = [];

        this.gameInterval = setInterval(() => {
            if (!this.gameOver) this.balloons.push(this.createBalloon());
        }, 1000);

        this.gameLoop();
    }

    gameLoop() {
        if (this.gameOver) {
            clearInterval(this.gameInterval);
            this.displayGameOver();
            return;
        }

        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

        this.balloons.forEach((balloon, i) => {
            this.drawBalloon(balloon);
            balloon.y -= balloon.speed;
            if (balloon.y < -20) this.gameOver = true;
        });

        this.smashes.forEach((smash, i) => {
            this.drawSmash(smash);
            smash.timer--;
            smash.radius += 1;

            if (smash.timer <= 0) this.smashes.splice(i, 1);
        });

        this.checkCollisions();

        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);

        requestAnimationFrame(() => this.gameLoop());
    }

    drawSmash(smash) {
        const gradient = this.ctx.createRadialGradient(
            smash.x, smash.y, smash.radius / 4, smash.x, smash.y, smash.radius
        );
        gradient.addColorStop(0, 'rgba(255, 165, 0, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(smash.x, smash.y, smash.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    checkCollisions() {
        this.smashes.forEach((smash, i) => {
            this.balloons.forEach((balloon, j) => {
                const dx = smash.x - balloon.x;
                const dy = smash.y - balloon.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < smash.radius + 20) {
                    this.balloons.splice(j, 1);
                    this.score++;
                    this.popSound.currentTime = 0;
                    this.popSound.play();
                }
            });
        });
    }

    displayGameOver() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Game Over! Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText('Refresh the page to play again.', this.canvas.width / 2, this.canvas.height / 2 + 40);

        // Remove the start button from the DOM
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.remove();
        }
    }
}

// Initialize the game
const game = new Game();
