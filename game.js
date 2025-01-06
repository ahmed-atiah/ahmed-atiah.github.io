class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
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
        this.selectedColors = ['red', 'blue', 'green', 'yellow', 'purple'];
        this.language = 'en'; // Default language

        // Translations for different languages
        this.translations = {
            en: {
                startGame: 'Start Game',
                settings: 'Settings',
                exit: 'Exit',
                applySettings: 'Apply',
                back: 'Back',
                gameOver: 'Game Over! Your score is:',
                refresh: 'Refresh the page to play again.',
                selectLanguage: 'Select Language:',
                selectColors: 'Select Balloon Colors:',
                errorNoColors: 'Please select at least one balloon color.',
                goodbye: 'Goodbye!',
                colors: {
                    red: 'Red',
                    yellow: 'Yellow',
                    green: 'Green',
                    blue: 'Blue',
                    orange: 'Orange',
                    mixed: 'Mixed',
                },
            },
            tr: {
                startGame: 'Oyuna Başla',
                settings: 'Ayarlar',
                exit: 'Çıkış',
                applySettings: 'Uygula',
                back: 'Geri',
                gameOver: 'Oyun Bitti! Skorunuz:',
                refresh: 'Tekrar oynamak için sayfayı yenileyin.',
                selectLanguage: 'Dil Seçin:',
                selectColors: 'Balon Renklerini Seçin:',
                errorNoColors: 'Lütfen en az bir balon rengi seçin.', 
                goodbye: 'Hoşça kal!',
                colors: {
                    red: 'Kırmızı',
                    yellow: 'Sarı',
                    green: 'Yeşil',
                    blue: 'Mavi',
                    orange: 'Turuncu',
                    mixed: 'Karışık',
                },
            },
            ar: {
                startGame: 'ابدأ اللعبة',
                settings: 'الإعدادات',
                exit: 'الخروج',
                applySettings: 'تطبيق',
                back: 'عودة',
                gameOver: 'انتهت اللعبة! نتيجتك:',
                refresh: 'قم بتحديث الصفحة للعب مرة أخرى.',
                selectLanguage: 'اختر اللغة:',
                selectColors: 'اختر ألوان البالونات:',
                errorNoColors: 'يرجى اختيار لون واحد على الأقل للبالونات.', 
                goodbye: 'وداعاً!', 

                colors: {
                    red: 'أحمر',
                    yellow: 'أصفر',
                    green: 'أخضر',
                    blue: 'أزرق',
                    orange: 'برتقالي',
                    mixed: 'مختلط',
                },
            },
        };
        

        this.initMenu();
        this.updateMenuLanguage();
    }

    // Method to update the menu language
    updateMenuLanguage() {
        document.getElementById('startGameButton').textContent = this.translations[this.language].startGame;
        document.getElementById('settingsButton').textContent = this.translations[this.language].settings;
        document.getElementById('exitButton').textContent = this.translations[this.language].exit;
        document.getElementById('applySettingsButton').textContent = this.translations[this.language].applySettings;
        document.getElementById('backToMenuButton').textContent = this.translations[this.language].back;
    
        // Update select labels dynamically
        document.querySelector('label[for="languageSelect"]').textContent = this.translations[this.language].selectLanguage;
        document.querySelector('h3').textContent = this.translations[this.language].selectColors;
    
        // Update color labels dynamically
        this.updateColorLabels();
    }
    

    // Method to update color labels
    updateColorLabels() {
        const colorOptions = document.querySelectorAll('.colorOption');
        const colorLabels = document.querySelectorAll('.colorOption + label');

        colorOptions.forEach((option, index) => {
            const colorKey = option.value; // e.g., "red", "yellow"
            colorLabels[index].textContent = this.translations[this.language].colors[colorKey];
        });
    }

    initMenu() {
        const menu = document.getElementById('menu');
        const settingsMenu = document.getElementById('settingsMenu');
        const startGameButton = document.getElementById('startGameButton');
        const settingsButton = document.getElementById('settingsButton');
        const exitButton = document.getElementById('exitButton');
        const applySettingsButton = document.getElementById('applySettingsButton');
        const backToMenuButton = document.getElementById('backToMenuButton');
    
        // Show the main menu on page load
        menu.style.display = 'block';
        settingsMenu.style.display = 'none';
    
        startGameButton.addEventListener('click', () => {
            menu.style.display = 'none';
            this.startGame();
        });
    
        settingsButton.addEventListener('click', () => {
            menu.style.display = 'none';
            settingsMenu.style.display = 'block';
        });
    
        exitButton.addEventListener('click', () => {
            // Show the goodbye message in the selected language
            alert(this.translations[this.language].goodbye);
    
            // Attempt to close the window (note: may not work in all browsers)
            window.close();
        });
    
        applySettingsButton.addEventListener('click', () => {
            const languageSelect = document.getElementById('languageSelect');
            const colorOptions = document.querySelectorAll('.colorOption');
    
            // Apply language setting
            const selectedLanguage = languageSelect.value;
            this.language = selectedLanguage; // Update the selected language
            this.updateMenuLanguage(); // Refresh menu text based on language
    
            // Apply color settings
            this.selectedColors = [];
            colorOptions.forEach(option => {
                if (option.checked) {
                    if (option.value === 'mixed') {
                        this.selectedColors = ['red', 'yellow', 'green', 'blue', 'orange'];
                    } else {
                        this.selectedColors.push(option.value);
                    }
                }
            });
    
            if (this.selectedColors.length === 0) {
                alert(this.translations[this.language].errorNoColors);
                return;
            }
    
            settingsMenu.style.display = 'none';
            menu.style.display = 'block';
        });
    
        backToMenuButton.addEventListener('click', () => {
            settingsMenu.style.display = 'none';
            menu.style.display = 'block';
        });
    }

    startGame() {
        this.canvas.style.display = 'block';
        this.setCanvasSize();
        this.balloons = [];
        this.smashes = [];
        this.score = 0;
        this.gameOver = false;

        // Add the event listener for canvas clicks
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

        this.gameInterval = setInterval(() => {
            if (!this.gameOver) this.balloons.push(this.createBalloon());
        }, 1000);

        this.gameLoop();
    }

    setCanvasSize() {
        this.canvas.width = window.innerWidth * 0.9;
        this.canvas.height = window.innerHeight * 0.8;
    }

    createBalloon() {
        const x = Math.random() * (this.canvas.width - 40);
        const y = this.canvas.height;
        const speed = Math.random() * 2 + 1;
        const color =
            this.selectedColors[Math.floor(Math.random() * this.selectedColors.length)];
        return { x, y, speed, color };
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const smash = this.createSmash(e.clientX - rect.left, e.clientY - rect.top);
        this.smashes.push(smash);
    }

    createSmash(x, y) {
        return { x, y, timer: 10, radius: 8 };
    }

    drawBalloon(balloon) {
        this.ctx.fillStyle = balloon.color;
        this.ctx.beginPath();
        this.ctx.arc(balloon.x, balloon.y, 20, 0, Math.PI * 2);
        this.ctx.fill();
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
        this.ctx.fillText(
            `${this.translations[this.language].gameOver} ${this.score}`,
            this.canvas.width / 2,
            this.canvas.height / 2
        );
        this.ctx.fillText(
            this.translations[this.language].refresh,
            this.canvas.width / 2,
            this.canvas.height / 2 + 40
        );
    }

    gameLoop() {
        if (this.gameOver) {
            clearInterval(this.gameInterval);
            this.displayGameOver();
            return;
        }

        // Clear the canvas and draw the background
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

        // Draw and update balloons
        this.balloons.forEach((balloon, i) => {
            this.drawBalloon(balloon);
            balloon.y -= balloon.speed;
            if (balloon.y < -20) this.gameOver = true;
        });

        // Draw and update smashes
        this.smashes.forEach((smash, i) => {
            this.drawSmash(smash);
            smash.timer--;
            smash.radius += 1;

            if (smash.timer <= 0) this.smashes.splice(i, 1);
        });

        // Check for collisions
        this.checkCollisions();

        // Display score
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);

        // Continue the game loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize the game
const game = new Game();
