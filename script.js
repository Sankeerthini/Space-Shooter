const gameCanvas = document.getElementById('gameCanvas');
const gameContext = gameCanvas.getContext('2d');

// Ensure the music is loaded and played
const introMusic = document.getElementById('intro-music');
const backgroundMusic = document.getElementById('background-music');

let isPaused = false;
let savedState = null;

const pauseButton = document.getElementById('pause-button');
const pauseModal = document.getElementById('pause-modal');
const continueButton = document.getElementById('continue-button');
const pauseExitButton = document.getElementById('pause-exit-button');

window.addEventListener('load', () => {
    playIntroMusic(); // Play the intro music when the game is paused
});

function playIntroMusic() {
    introMusic.play();
}

function stopIntroMusic() {
    introMusic.pause();
}

pauseButton.addEventListener('click', () => {
    pauseGame();
    playIntroMusic(); // Play the intro music when the game is paused
});

continueButton.addEventListener('click', () => {
    resumeGame();
    stopIntroMusic(); // Stop the intro music when the game is resumed
});

pauseExitButton.addEventListener('click', () => {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('intro-page').style.display = 'flex';
    document.getElementById('intro-footer').style.display = 'block'; // Show the footer
    pauseModal.style.display = 'none';
    resetGame();
    backgroundMusic.pause();
    introMusic.currentTime = 0;
    playIntroMusic(); // Ensure the intro music plays again on exit
});

// Add visibility change event listener
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseGame();
    }
});

function pauseGame() {
    if (!isPaused) {
        isPaused = true;
        savedState = {
            playerX: player.x,
            playerY: player.y,
            bullets: [...bullets],
            enemies: [...enemies],
            score: score,
            enemySpeed: enemySpeed,
            bulletSpeed: bulletSpeed,
            timer: timer,
            specialEnemyActive: specialEnemyActive,
            specialEnemyTimer: specialEnemyTimer
        };
        cancelAnimationFrame(animationFrameId);
        pauseModal.style.display = 'flex';
        backgroundMusic.pause();
    }
}

function resumeGame() {
    if (isPaused) {
        isPaused = false;
        pauseModal.style.display = 'none';
        startCountdown();
    }
}

function startCountdown() {
    const countdownNumber = document.getElementById('countdown-number');
    const countdownTimer = document.getElementById('countdown-timer');
    countdownNumber.innerText = '3';
    countdownTimer.style.display = 'flex';

    let countdown = 3;
    const countdownInterval = setInterval(() => {
        countdown -= 1;
        countdownNumber.innerText = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownTimer.style.display = 'none';
            // Restore game state
            player.x = savedState.playerX;
            player.y = savedState.playerY;
            bullets = savedState.bullets;
            enemies = savedState.enemies;
            score = savedState.score;
            enemySpeed = savedState.enemySpeed;
            bulletSpeed = savedState.bulletSpeed;
            timer = savedState.timer;
            specialEnemyActive = savedState.specialEnemyActive;
            specialEnemyTimer = savedState.specialEnemyTimer;
            backgroundMusic.play();
            update();
        }
    }, 1000);
}


// Event listeners to pause the game when the document/tab/window loses focus
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseGame();
    }
});

window.addEventListener('blur', () => {
    pauseGame();
});

// Play the music when the website is loaded
window.addEventListener('load', () => {
    backgroundMusic.play();
});

// Load the shooter image
const shooterImage = new Image();
shooterImage.src = 'images/shoot.png';

// Ensure the shooter image is loaded before using it
shooterImage.onload = () => {
    console.log("Shooter image loaded successfully.");
};

shooterImage.onerror = () => {
    console.error("Failed to load the shooter image.");
};

// Load the alien image
const alienImage = new Image();
alienImage.src = 'images/alien.png';

// Ensure the alien image is loaded before using it
alienImage.onload = () => {
    console.log("Alien image loaded successfully.");
};

alienImage.onerror = () => {
    console.error("Failed to load the alien image.");
};

// Load the UFO image
const ufoImage = new Image();
ufoImage.src = 'images/ufo.png';

// Ensure the UFO image is loaded before using it
ufoImage.onload = () => {
    console.log("UFO image loaded successfully.");
};

ufoImage.onerror = () => {
    console.error("Failed to load the UFO image.");
};

// Star variables
const numStars = 100;
let stars = [];

// Game variables
let player = { x: gameCanvas.width / 2 - 25, y: 550, width: 50, height: 50, speed: 7 };
let bullets = [];
let enemies = [];
let score = 0;
let enemySpeed = 7;
let bulletSpeed = 10; // Adjust bullet speed
let keys = {};
let gameOverFlag = false;

// Default values for bullet speed, enemy speed, and initial enemy count
const DEFAULT_BULLET_SPEED = 8;
const DEFAULT_ENEMY_SPEED = 1.2;
const DEFAULT_ENEMY_COUNT = 1.8; // Start with fewer enemies
const MAX_ENEMY_COUNT = 15; // Maximum number of enemies to spawn at once
const SPAWN_RATE_DECREASE = 250; // Decrease spawn rate by 500ms every interval
const MIN_SPAWN_RATE = 500; // Minimum spawn rate (faster spawn)

let animationFrameId;
let timer = 0;
let difficultyIncreaseInterval = 10;
let specialEnemyInterval = 60;
let specialEnemyDuration = 15; // Increased duration to 15 seconds
let specialEnemyActive = false;
let specialEnemyTimer = 0;
let currentSpawnRate = 2000; // Initial spawn rate in milliseconds

// Initialize stars
function initializeStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * gameCanvas.width,
            y: Math.random() * gameCanvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 1.5
        });
    }
}

// Draw stars
function drawStars(context) {
    context.fillStyle = '#fff';
    stars.forEach(star => {
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
    });
}

// Move stars
function moveStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > gameCanvas.height) {
            star.y = 0;
            star.x = Math.random() * gameCanvas.width;
        }
    });
}

// Event listeners for key presses
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Draw player
function drawPlayer() {
    gameContext.drawImage(shooterImage, player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
    gameContext.fillStyle = '#FFD700'; // Golden yellow color
    bullets.forEach(bullet => gameContext.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));
}

// Draw enemies (Aliens and UFOs)
function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.type === 'alien') {
            gameContext.drawImage(alienImage, enemy.x, enemy.y, enemy.width, enemy.height);
        } else if (enemy.type === 'ufo') {
            gameContext.drawImage(ufoImage, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

// Move player
function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x + player.width < gameCanvas.width) player.x += player.speed;
}

// Move bullets
function moveBullets() {
    bullets = bullets.filter(bullet => bullet.y > 0);
    bullets.forEach(bullet => bullet.y -= bullet.speed);
}

// Move enemies
function moveEnemies() {
    enemies.forEach(enemy => {
        if (enemy.type === 'ufo') {
            enemy.y += enemySpeed * 4; // Increased UFO speed
        } else {
            enemy.y += enemySpeed;
        }
    });
    enemies = enemies.filter(enemy => {
        if (enemy.y + enemy.height > gameCanvas.height) {
            if (enemy.type !== 'ufo') {
                gameOver();
                return false; // Remove regular enemies that reach the bottom
            }
            return false; // Remove UFOs that reach the bottom without ending the game
        }
        return true; // Keep the enemy if it's still within the game area
    });
}

// Game over function
function gameOver() {
    gameOverFlag = true;
    document.getElementById('game-over-modal').style.display = 'flex';
    cancelAnimationFrame(animationFrameId); // Stop the game loop
    backgroundMusic.pause(); // Pause the music on game over
}

// Fire bullet
function fireBullet() {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: bulletSpeed });
}

// Check for collisions and misses
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                if (enemy.type === 'ufo') {
                    gameOver();
                } else {
                    bullets.splice(bulletIndex, 1);
                    enemies.splice(enemyIndex, 1);
                    score += 1;
                    document.getElementById('score').innerText = `Score: ${score}`;
                }
            }
        });
    });

    // Check for collision between shooter and enemies
    enemies.forEach((enemy, enemyIndex) => {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            if (enemy.type === 'ufo') {
                gameOver();
            } else {
                gameOver();
            }
        }
    });
}

// Spawn enemies
function spawnEnemies() {
    if (!specialEnemyActive && timer % (specialEnemyInterval * 60) < (specialEnemyInterval * 60 - 5 * 60)) { // Pause alien spawn 7s before UFO spawn
        if (Math.random() < 0.02) {
            let x = Math.random() * (gameCanvas.width - 30);
            let y = 0;
            let width = 30;
            let height = 30;

            // Check for collisions with existing enemies
            let collides = false;
            enemies.forEach(enemy => {
                if (x < enemy.x + enemy.width &&
                    x + width > enemy.x &&
                    y < enemy.y + enemy.height &&
                    y + height > enemy.y) {
                    collides = true;
                }
            });

            // If collision detected, adjust position
            if (collides) {
                x = Math.random() * (gameCanvas.width - 30);
                y = 0;
            }

            enemies.push({ x: x, y: y, width: width, height: height, type: 'alien' });
        }
    }
}

// Spawn special enemies (UFOs)
function spawnSpecialEnemies() {
    if (specialEnemyActive && Math.random() < 0.05) { // Slightly increased spawn rate for UFOs
        let x = Math.random() * (gameCanvas.width - 30);
        let y = 0;
        let width = 30;
        let height = 30;

        // Check for collisions with existing enemies
        let collides = false;
        enemies.forEach(enemy => {
            if (x < enemy.x + enemy.width &&
                x + width > enemy.x &&
                y < enemy.y + enemy.height &&
                y + height > enemy.y) {
                collides = true;
            }
        });

        // If collision detected, adjust position
        if (collides) {
            x = Math.random() * (gameCanvas.width - 30);
            y = 0;
        }

        enemies.push({ x: x, y: y, width: width, height: height, type: 'ufo' });
    }
}

function resetGame() {
    score = 0;
    enemies = [];
    bullets = [];
    player.x = gameCanvas.width / 2 - 25; // Set initial position to center
    player.y = 550; // Reset player's Y position to initial value
    gameOverFlag = false;
    isPaused = false;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('game-over-modal').style.display = 'none';
    document.getElementById('pause-modal').style.display = 'none';
    bulletSpeed = DEFAULT_BULLET_SPEED;
    enemySpeed = DEFAULT_ENEMY_SPEED;
    timer = 0;
    specialEnemyActive = false;
    specialEnemyTimer = 0;
    currentSpawnRate = 3000; // Reset spawn rate
    cancelAnimationFrame(animationFrameId); // Cancel any ongoing animation frame
    keys = {}; // Reset all keys
}

function update() {
    if (!gameOverFlag && !isPaused) {
        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        moveStars();
        drawStars(gameContext);
        movePlayer();
        moveBullets();
        moveEnemies();
        drawPlayer();
        drawBullets();
        drawEnemies();
        checkCollisions();
        spawnEnemies();
        spawnSpecialEnemies();

        timer++;
        if (timer % 60 === 0) {
            document.getElementById('timer').innerText = `Time: ${Math.floor(timer / 60)}s`;
        }
        if (timer % (difficultyIncreaseInterval * 60) === 0) {
            enemySpeed += 0.1;
            bulletSpeed += 0.5;
        }
        if (timer % (specialEnemyInterval * 60) === 0) {
            specialEnemyActive = true;
            specialEnemyTimer = 0;
        }
        if (specialEnemyActive) {
            specialEnemyTimer++;
            if (specialEnemyTimer > specialEnemyDuration * 60) {
                specialEnemyActive = false;
            }
        }

        if (timer === 58 * 60) {
            showDodgeMessage();
        }

        animationFrameId = requestAnimationFrame(update);
    }
}

// Initialize game
function initGame() {
    initializeStars();
    for (let i = 0; i < DEFAULT_ENEMY_COUNT; i++) {
        spawnEnemies();
    }
    bulletSpeed = DEFAULT_BULLET_SPEED;
    enemySpeed = DEFAULT_ENEMY_SPEED;
    update();
    setTimeout(scheduleEnemySpawning, 5000);
}

// Show attack message
function showAttackMessage() {
    const attackMessage = document.getElementById('attack-message');
    attackMessage.style.display = 'block'; // Ensure the message is visible
    attackMessage.classList.add('fade-in');
    setTimeout(() => {
        attackMessage.classList.remove('fade-in');
        attackMessage.classList.add('fade-out');
    }, 2000); // Start fade-out after 2 seconds
    setTimeout(() => {
        attackMessage.style.display = 'none'; // Hide the message after fade-out
        attackMessage.classList.remove('fade-out');
    }, 4000); // Remove fade-out class after animation is done
}

// Show dodge message
function showDodgeMessage() {
    const dodgeMessage = document.getElementById('dodge-message');
    dodgeMessage.style.display = 'block'; // Ensure the message is visible
    dodgeMessage.classList.add('fade-in');
    setTimeout(() => {
        dodgeMessage.classList.remove('fade-in');
        dodgeMessage.classList.add('fade-out');
    }, 2000); // Start fade-out after 2 seconds
    setTimeout(() => {
        dodgeMessage.style.display = 'none'; // Hide the message after fade-out
        dodgeMessage.classList.remove('fade-out');
    }, 4000); // Remove fade-out class after animation is done
}

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('intro-page').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    resetGame();
    initGame();
    showAttackMessage();
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    stopIntroMusic(); // Stop the intro music when the game starts
    // Hide the intro footer
    document.getElementById('intro-footer').style.display = 'none';
});

document.getElementById('retry-button').addEventListener('click', () => {
    resetGame();
    initGame();
    backgroundMusic.play();
    stopIntroMusic(); // Ensure the intro music is stopped on retry
});

document.getElementById('exit-button').addEventListener('click', () => {
    document.getElementById('game-over-modal').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('intro-page').style.display = 'flex';
    resetGame();
    backgroundMusic.pause();
    playIntroMusic(); // Ensure the intro music plays again on exit
    document.getElementById('intro-footer').style.display = 'felx';
    
});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') fireBullet();
});

// Adjust enemy spawn rate dynamically
function adjustSpawnRate() {
    if (currentSpawnRate > MIN_SPAWN_RATE) {
        currentSpawnRate -= SPAWN_RATE_DECREASE;
    }
}

// Schedule enemy spawning with a 5-second initial delay
function scheduleEnemySpawning() {
    function spawn() {
        if (!gameOverFlag && !isPaused) {
            spawnEnemies();
            adjustSpawnRate();
            setTimeout(spawn, currentSpawnRate); // Continue spawning at adjusted rate
        }
    }
    spawn(); // Start the spawning process after the delay
}

// Start the initial enemy spawning with delay
scheduleEnemySpawning();

